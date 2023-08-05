<template>
    <v-btn @click="connect" :disable="address">Connect</v-btn>
    hewwo, {{ address }}
    <v-text-field v-model="myText" :label="label"></v-text-field>
    <v-btn @click="upload">UPLOAD</v-btn>
    <v-file-input multiple v-model="files"></v-file-input>
</template>

<script setup lang="ts">
const arweave = useArweave()
const wallet = useArconnectProvider()

const label = ref<string>('this just be a label')
const myText = ref<string>('')
const address = ref<string | null>(null)
const files = ref<File[]>([])
const upload = async () => {
    try{
        const datas: ArrayBuffer[] = []
        for (const file of files.value) {
            // upload file
            console.log('file', file.name, file.size)
            datas.push(await readFileAsArrayBufferAsync(file))

        }
        console.log('upload test', datas[0].byteLength)
        const tx = await arweave.createTransaction({ data: datas[0] })
        tx.addTag('Content-Type', 'image/png')
        await arweave.transactions.sign(tx)
        console.log('Posting Transaction', tx.id)
        await arweave.transactions.post(tx)
        console.log('Done posting')
    } catch(error){
        console.error('Error while uploading.', error)
    }
}
const connect = async () => {
    try {
        address.value = await wallet.connect()
    } catch (error) {
        console.error("Error connecting.", error)
    }
}

// create transaction

</script>