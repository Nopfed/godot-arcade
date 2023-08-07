<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>Publish Your Game</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <code v-if="walletAddress">
                    Your wallet address: {{ walletAddress }}
                </code>
                <v-btn v-else @click="connect">
                    Connect Arconnect Wallet
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="walletAddress">
            <v-col cols="12">
                <v-form>
                    <v-text-field hint="My Awesome Godot Game" counter="150" label="Game Title" v-model="gameTitle" />
                    <v-textarea hint="A cool game about cats." counter="300" label="Game Description" v-model="gameDescription"/>
                    <v-file-input label="Game Files" multiple v-model="filesToUpload" />
                    <v-btn @click="uploadFiles">Upload Files</v-btn>
                </v-form>
            </v-col>
        </v-row>
        
        
    </v-container>
</template>

<script setup lang="ts">
import { ArconnectSigner, DataItem, createData, bundleAndSignData } from 'arbundles';
// import BundleFactory from '~/utils/bundle';
// import DataItemFactory from '~/utils/dataItem';
// import ArweaveWalletSigner from '~/utils/arweaveWalletSigner';

const arweave = useArweave() // init arweave env
const wallet = useArconnectProvider() // init wallet

const walletAddress = ref<string | null>(null)
const filesToUpload = ref<File[]>([])
const gameTitle = ref<string | null>(null)
const gameDescription = ref<string | null>(null)

// prep and upload files

const uploadFiles = async () => {
    try {
        if (!wallet.publicKey) {throw new Error('Wallet not connected.')}

        const dataItems: DataItem[] = []
        //const signer = new ArweaveWalletSigner(wallet.publicKey)
        const signer = new ArconnectSigner(window.arweaveWallet)
        await signer.setPublicKey()

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
            // const dataItem = await DataItemFactory.create(new Uint8Array(data), signer, 
            //     [{
            //         name: 'Content-Type',
            //         value: file.type}]
            // )
            const dataItem = createData(new Uint8Array(data), signer, {
                tags:[{
                    name: 'Content-Type',
                    value: file.type}]
            })
            await dataItem.sign(signer)
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
        // const manifestDataItem = await DataItemFactory.create(
        //     JSON.stringify(manifest), 
        //     signer, 
        //     manifestTags    
        // )
        const manifestDataItem = await createData(
            JSON.stringify(manifest), 
            signer,
            {tags: manifestTags}
        )
        console.log('Manifest ID', manifestDataItem.id)
        dataItems.push(manifestDataItem)

        // make bundle

        // const bundle = BundleFactory.create(dataItems)
        const bundle = await bundleAndSignData(dataItems, signer)
        const verified = await bundle.verify()
        console.log('Bundle verification.', verified)

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

        // await arweave.transactions.sign(tx)
        // console.log('Posting Transaction', tx.id)
        // await arweave.transactions.post(tx)
        // console.log('Finished posting.')

    } catch(error){
        console.error('Error while uploading.', error)
    }
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
