<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="header title">
          Publish
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p v-if="walletAddress" class="text">
          Welcome, <code>{{ walletAddress }}</code>
        </p>
        <v-btn
          v-else
          color="primary" 
          class="btn-connect text"
          @click="connect"
        >
          Connect Wallet
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="walletAddress">
      <v-col cols="12">
        <v-form
          :disabled="loading"
          @submit.prevent="uploadFiles"
          validate-on="submit"
        >
          <v-text-field
            v-model="gameTitle"
            hint="My Awesome Godot Game"
            counter="150"
            :rules="rules.title"
            label="Game Title"
          />
          <v-textarea
            v-model="gameDescription"
            hint="A cool game about cats." 
            counter="300"
            label="Game Description"
          />
          <v-file-input
            v-model="filesToUpload"
            label="Game Files" 
            multiple
            @update:model-value="onGameFilesChanged"
          />

          <GamePreview :key="gameFilesChanged" :files="gameFiles" />

          <v-switch
            v-model="useUdl"
            color="red-darken-4" 
            class="switch"
            label="Use Universal Data License"
          />
          <v-switch
            v-if="useUdl"
            v-model="useDerivationCredit"
            color="red-darken-4"
            class="switch"
            label="Derivation with Credit"
          />
          <v-switch
            v-if="useUdl"
            v-model="useDerivationIndication"
            color="red-darken-4"
            class="switch"
            label="Derivation with Indication"
          />
          <v-switch
            v-if="useUdl"
            v-model="useDerivationPassthrough"
            color="red-darken-4"
            class="switch"
            label="Derivation with License Passthrough"
          />
          <a
            target="_blank" 
            href="https://arwiki.wiki/#/en/Universal-Data-License-How-to-use-it"
          >
            What is the Universal Data License?
          </a>
          <br><br>
          <v-btn
            color="primary"
            class="btn-upload text" 
            :loading="loading"
            type="submit"
          >
            Upload
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn to="../" color="primary" class="btn-back text">
          Back to Games
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

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
    right: 0;
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

<script setup lang="ts">
import { DataItem } from 'arbundles'
import BundleFactory from '~/utils/bundle'
import DataItemFactory from '~/utils/dataItem'
import ArweaveWalletSigner from '~/utils/arweaveWalletSigner'

const arweave = useArweave()
const wallet = useArconnectProvider()
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

const rules = {
  title: [
    (value: string) => !!value || 'Title is required',
    (value: string) => value.length <= 150 || 'Title must be 150 chars or less'
  ]
}

type GodotEngineFile = { name: string, size: number, url: string }
type GodotGameFiles = {
  js: GodotEngineFile
  pck: GodotEngineFile
  wasm: GodotEngineFile
  icon: GodotEngineFile
  appleIcon: GodotEngineFile
}
const gameFiles = ref<GodotGameFiles | null>(null)
const gameFilesChanged = ref<number>(0)
const onGameFilesChanged = (files: File[]) => {
  console.log('onGameFilesChanged', files.length, files)

  let js, pck, wasm, icon, appleIcon
  for (const file of files) {
    const gameFile = {
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }
    if (file.name.endsWith('.js')) {
      js = gameFile
    } else if (file.name.endsWith('.pck')) {
      pck = gameFile
    } else if (file.name.endsWith('.wasm')) {
      wasm = gameFile
    } else if (file.name.endsWith('.icon.png')) {
      icon = gameFile
    } else if (file.name.endsWith('.apple-touch-icon.png')) {
      appleIcon = gameFile
    }
  }
  
  if (js && pck && wasm && icon && appleIcon) {
    gameFiles.value = { js, pck, wasm, icon, appleIcon }
    gameFilesChanged.value = Date.now()
  }

  console.log('onGameFilesChanged gameFiles.value', gameFiles.value)
}

const uploadFiles = async () => {
  console.log('uploadFiles')
  return

  // try {
  //   if (!wallet.publicKey) {throw new Error('Wallet not connected.')}
  //   if (!filesToUpload.value) {throw new Error('Missing files.')}
  //   const wasmCheck = /(\.wasm)$/i
  //   let wasmBool: boolean = false
  //   const htmlCheck = /(\.html)$/i
  //   let htmlBool: boolean = false
  //   const pckCheck = /(\.pck)$/i
  //   let pckBool: boolean = false

  //   for (const file of filesToUpload.value) {
  //     if (wasmCheck.exec(file.name)) {
  //       wasmBool = true
  //     }
  //     if (htmlCheck.exec(file.name)) {
  //       htmlBool = true
  //     }
  //     if (pckCheck.exec(file.name)) {
  //       pckBool = true
  //     }
  //   }

  //   if (!wasmBool && !htmlBool && !pckBool) {
  //     alert(
  //       "Missing Godot HTML Game files.Please try again with correct files."
  //     )
  //     pckBool = false
  //     htmlBool = false
  //     wasmBool = false
  //     throw new Error('Missing Godot HTML Game Files.')  
  //   }
        
        
        
  //   loading.value = true

  //   const dataItems: DataItem[] = []
  //   const signer = new ArweaveWalletSigner(wallet.publicKey)

  //   // get data from files that are being uploaded and sign them

  //   const manifest = {
  //     manifest: "arweave/paths",
  //     version: "0.1.0",
  //     index: {},
  //     paths: {},
  //   }

  //   for (const file of filesToUpload.value) {
  //     console.log('file', file.name, file.size, file.type)
  //     const data = await readFileAsArrayBufferAsync(file)
  //     const tags: { name: string, value: string }[] = []
  //     if (file.type) {
  //       tags.push({ name: 'Content-Type', value: file.type })
  //     }
  //     const dataItem = await DataItemFactory.create(
  //       new Uint8Array(data),
  //       signer, 
  //       tags
  //     )

  //     console.log('ID', dataItem.id)
  //     dataItems.push(dataItem)
  //     const filename = encodeURIComponent(file.name)
  //     if (file.type === 'text/html') {
  //       manifest.index = { path: filename }
  //     }
  //     // @ts-expect-error we ain't typing out all that nonsense, dawg
  //     manifest.paths[filename] = { id: dataItem.id }
  //   }

  //   const manifestTags = [
  //     {
  //       name: 'Content-Type',
  //       value: 'application/x.arweave-manifest+json'
  //     },
  //     {name: 'Type', value: 'game'},
  //     {name: 'Engine', value: 'godot'},
  //   ]
  //   if (gameTitle.value) {
  //     manifestTags.push({name: 'Title', value: gameTitle.value})
  //   }
  //   if (gameDescription.value) {
  //     manifestTags.push(
  //       {name: 'Description',value: gameDescription.value}
  //     )
  //   }
  //   const manifestDataItem = await DataItemFactory.create(
  //     JSON.stringify(manifest), 
  //     signer, 
  //     manifestTags    
  //   )

  //   console.log('Manifest ID', manifestDataItem.id)
  //   dataItems.push(manifestDataItem)

  //   // make bundle

  //   const bundle = BundleFactory.create(dataItems)

  //   // make transaction

  //   const tx = await arweave.createTransaction({ data: bundle.getRaw() })

  //   tx.addTag('Bundle-Format', 'binary')
  //   tx.addTag('Bundle-Version', '2.0.0')
  //   tx.addTag('Type', 'game-bundle')
  //   tx.addTag('Engine', 'godot')
  //   tx.addTag('Manifest-ID', manifestDataItem.id)
  //   if (gameTitle.value) {
  //     tx.addTag('Title', gameTitle.value)
  //   }
  //   if (gameDescription.value) {
  //     tx.addTag('Description', gameDescription.value)
  //   }
  //   if (useUdl.value) {
  //     tx.addTag('License', config.public.UDLTxID)
  //   }
  //   if (useDerivationCredit.value) {
  //     tx.addTag('Derivation', 'Allowed-With-Credit')
  //   }
  //   if (useDerivationIndication.value) {
  //     tx.addTag('Derivation', 'Allowed-With-Indication')
  //   }
  //   if (useDerivationPassthrough.value) {
  //     tx.addTag('Derivation', 'Allowed-With-License-Passthrough')
  //   }

  //   await arweave.transactions.sign(tx)
  //   console.log('Posting Transaction', tx.id)
  //   await arweave.transactions.post(tx)
  //   console.log('Finished posting.')

  //   await navigateTo(`game/${tx.id}`)

  // } catch(error){
  //   console.error('Error while uploading.', error)
  // }
  // loading.value = false
}

const connect = async () => {
  try {
    walletAddress.value = await wallet.connect()
  } catch (error) {
    console.error("Error connecting.", error)
  }
}
</script>
