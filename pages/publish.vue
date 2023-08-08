<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <div class="header title">Publish</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <p class="text" v-if="walletAddress">
                    Welcome, <code>{{ walletAddress }}</code>
                </p>
                <v-btn color="primary" class="btn-connect text" v-else @click="connect">
                    Connect Wallet
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="walletAddress">
            <v-col cols="12">
                <v-form :disabled="loading">
                    <v-text-field hint="My Awesome Godot Game" counter="150" label="Game Title" v-model="gameTitle" />
                    <v-textarea hint="A cool game about cats." counter="300" label="Game Description" v-model="gameDescription"/>
                    <v-file-input label="Game Files" multiple v-model="filesToUpload" />
                    <v-switch color="red-darken-4" class="switch" label="Use Universal Data License" v-model="useUdl"/>
                    <v-switch v-if="useUdl" color="red-darken-4" class="switch" label="Derivation with Credit" v-model="useDerivationCredit"/>
                    <v-switch v-if="useUdl" color="red-darken-4" class="switch" label="Derivation with Indication" v-model="useDerivationIndication"/>
                    <v-switch v-if="useUdl" color="red-darken-4" class="switch" label="Derivation with License Passthrough" v-model="useDerivationPassthrough"/>
                    <a target="_blank" href="https://arwiki.wiki/#/en/Universal-Data-License-How-to-use-it">
                        What is the Universal Data License?
                    </a>
                    <br/><br/>
                    <v-btn color="primary" class="btn-upload text" :loading="loading" @click="uploadFiles">Upload</v-btn>
                </v-form>
            </v-col>
        </v-row>
        <v-row >
            <v-col cols="12">
                <v-btn to="../" color="primary" class="btn-back text">Back to Games</v-btn>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script setup lang="ts">
import { ArconnectSigner, DataItem, createData, bundleAndSignData } from 'arbundles';
import BundleFactory from '~/utils/bundle';
import DataItemFactory from '~/utils/dataItem';
import ArweaveWalletSigner from '~/utils/arweaveWalletSigner';

const arweave = useArweave() // init arweave env
const wallet = useArconnectProvider() // init wallet
const config = useRuntimeConfig()

const walletAddress = ref<string | null>(null)
const filesToUpload = ref<File[]>([])
const gameTitle = ref<string | null>(null)
const gameDescription = ref<string | null>(null)
const loading =  ref<boolean>(false)
const useUdl = ref<boolean>(true)
const useDerivationCredit = ref<boolean>(false)
const useDerivationIndication = ref<boolean>(false)
const useDerivationPassthrough = ref<boolean>(false)

// prep and upload files

const uploadFiles = async () => {
    try {
        if (!wallet.publicKey) {throw new Error('Wallet not connected.')}
        loading.value = true

        const dataItems: DataItem[] = []
        const signer = new ArweaveWalletSigner(wallet.publicKey)
        // const signer = new ArconnectSigner(window.arweaveWallet)
        // await signer.setPublicKey()

        // get data from files that are being uploaded and sign them

        const manifest: any = {
            manifest: "arweave/paths",
            version: "0.1.0",
            index: {},
            paths: {},

    }

        for (const file of filesToUpload.value) {
            console.log('file', file.name, file.size, file.type)
            const data = await readFileAsArrayBufferAsync(file)
            const tags: { name: string, value: string }[] = []
            if (file.type) {
                tags.push({ name: 'Content-Type', value: file.type })
            }
            const dataItem = await DataItemFactory.create(
                new Uint8Array(data),
                signer, 
                tags
            )
            // const dataItem = createData(new Uint8Array(data), signer, {
            //     tags:[{
            //         name: 'Content-Type',
            //         value: file.type}]
            // })
            // await dataItem.sign(signer)

            console.log('ID', dataItem.id)
            dataItems.push(dataItem)
            const filename = encodeURIComponent(file.name)
            if (file.type === 'text/html') {
                manifest.index = { path: filename }
            } 
            manifest.paths[filename] = { id: dataItem.id }
        }

        // console.log('First file byte length:', dataFromFiles[0].byteLength)
        const manifestTags = [
            {name: 'Content-Type', value: 'application/x.arweave-manifest+json'},
            {name: 'Type', value: 'game'},
            {name: 'Engine', value: 'godot'},
        ]
        if (gameTitle.value) {
            manifestTags.push({name: 'Title', value: gameTitle.value})
        }
        if (gameDescription.value) {
            manifestTags.push({name: 'Description', value: gameDescription.value})
        }
        const manifestDataItem = await DataItemFactory.create(
            JSON.stringify(manifest), 
            signer, 
            manifestTags    
        )
        // const manifestDataItem = await createData(
        //     JSON.stringify(manifest), 
        //     signer,
        //     {tags: manifestTags}
        // )
        console.log('Manifest ID', manifestDataItem.id)
        dataItems.push(manifestDataItem)

        // make bundle

        const bundle = BundleFactory.create(dataItems)
        // const bundle = await bundleAndSignData(dataItems, signer)
        // const verified = await bundle.verify()
        // console.log('Bundle verification.', verified)

        // make transaction

        const tx = await arweave.createTransaction({ data: bundle.getRaw() })

        tx.addTag('Bundle-Format', 'binary')
        tx.addTag('Bundle-Version', '2.0.0')
        tx.addTag('Type', 'game-bundle')
        tx.addTag('Engine', 'godot')
        tx.addTag('Manifest-ID', manifestDataItem.id)
        if (gameTitle.value) {
            tx.addTag('Title', gameTitle.value)
        }
        if (gameDescription.value) {
            tx.addTag('Description', gameDescription.value)
        }
        if (useUdl.value) {
            tx.addTag('License', config.public.UDLTxID)
        }
        if (useDerivationCredit.value) {
            tx.addTag('Derivation', 'Allowed-With-Credit')
        }
        if (useDerivationIndication.value) {
            tx.addTag('Derivation', 'Allowed-With-Indication')
        }
        if (useDerivationPassthrough.value) {
            tx.addTag('Derivation', 'Allowed-With-License-Passthrough')
        }

        await arweave.transactions.sign(tx)
        console.log('Posting Transaction', tx.id)
        await arweave.transactions.post(tx)
        console.log('Finished posting.')

        navigateTo(`game/${tx.id}`)

    } catch(error){
        console.error('Error while uploading.', error)
    }
    loading.value = false
}


// connect to arconnect wallet

const connect = async () => {
    try {
        walletAddress.value = await wallet.connect()
    } catch (error) {
        console.error("Error connecting.", error)
    }
}

</script>

<style scoped>
.header {
    display: block;
    margin: 30px;
    padding: 15px;
    margin-left: auto;
    margin-right: auto;
    color: white;
    line-height: 40px;
    letter-spacing: 25px;   
}

.title {
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    font-size: 72px;
    text-shadow: -2px 0 0 #fdff2a,
        -4px 0 0 #df4a42,
        2px 0 0 #91fcfe,
        4px 0 0 #4405fc;
}

p {
    font-size: 24px;
}
.btn-connect {
    display: block;
    margin: 30px;
    padding: 7px;
    margin-left: auto;
    margin-right: auto;
    min-width: 275px;
    min-height: 45px;
    font-size: 24px;
}

.btn-upload {
    display: block;
    padding: 7px;
    margin-right: auto;
    max-width: 275px;
    min-height: 45px;
    font-size: 24px;
}

.btn-back {
    display: block;
    margin: 30px;
    padding: 10px;
    margin-right: auto;
    max-width: 275px;
    min-height: 45px;
    font-size: 24px;
    position: fixed;
    bottom: 0;
}

.text {
    text-shadow: -1px 0 0 #fdff2a,
        -2px 0 0 #df4a42,
        1px 0 0 #91fcfe,
        2px 0 0 #4405fc;
}

a:link {
  color: red;
  text-decoration: none;
}

a:visited {
  color: #a09cb0;
}

a:hover {
  color: #FFD23F;
}

a:active {
  color: #EEEEEE;
}

</style>