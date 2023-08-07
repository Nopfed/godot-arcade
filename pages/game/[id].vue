<template>
    <v-container>
        <template v-if="game">
            <v-row>
                <v-col cols="12">
                    <h1>{{ game.title }}</h1>
                    <code>Bundle ID: {{ game.tx.id }}</code>
                    <p>
                        Made By: 
                        <NuxtLink :to="`/creator/${game.tx.owner.address}`">
                            {{ game.tx.owner.address }}
                        </NuxtLink>
                    </p>
                    <code>Game ID: {{ game.manifestId }}</code>
                    
                </v-col>
            </v-row>
            <v-row v-if="game.manifestTx">
                <v-col cols="12">
                    <v-responsive aspect-ratio="2">
                        <iframe class="game-frame" :src="`${gateway}/${game.manifestId}`" />
                    </v-responsive>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col cols="12">
                    <h1>Game still unbundling, please hold.</h1>
                    <v-btn @click="refresh" color="primary">Refresh</v-btn>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="12">
                    <v-btn to="../" color="primary">Back to Games</v-btn>
                </v-col>
            </v-row>
        </template>

        <template v-else-if="pending">
            <h1>LOADING...</h1>
        </template>

        <template v-else>
            <h1>404 Game Not Found</h1>
        </template>
    </v-container>
</template>

<script setup lang="ts">
import ArdbTransaction from 'ardb/lib/models/transaction'

const ardb = useArdb()
const route = useRoute()
const arweave = useArweave()
const config = useRuntimeConfig()

const {api: {host, port, protocol}} = arweave.getConfig()
const gateway = `${protocol}://${host}:${port}`

const {
    pending, refresh, data: game
} = useLazyAsyncData(async () => {
    try {
        const txs = await ardb.search('transactions')
            .id(route.params.id.toString())
            .limit(1)
            .sort("HEIGHT_DESC")
            .find() as ArdbTransaction[]
        
        if (!txs[0]) { return null }
        const tx = txs[0]
        console.log('Tx', tx)
        const title = tx.tags.find(t => t.name === 'Title')?.value || 'Untitled Game'
        const description = tx.tags.find(t => t.name === 'Description')?.value
        const manifestId = tx.tags.find(t => t.name === 'Manifest-ID')?.value
        const license = tx.tags.find(t => t.name === 'License')?.value
        const isUdl = config.public.UDLTxID === license
        console.log('ManifestId', manifestId)
        if (!manifestId) {return null}
        const manifestTxs = await ardb.search('transactions')
            .id(manifestId)
            .limit(1)
            .sort("HEIGHT_DESC")
            .find() as ArdbTransaction[]
        
        const manifestTx = manifestTxs[0]
        

        return {tx, title, description, manifestId, manifestTx, license, isUdl}

    } catch (error) {
        console.error("Error fetching transaction.", error)
    }
})
</script>

<style scoped>
.game-frame {
    width: 100%;
    height: 100%;
}
</style>