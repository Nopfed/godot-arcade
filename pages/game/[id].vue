<template>
    <v-container>
        <template v-if="game">
            <v-row>
                <v-col cols="12">
                    <div class="header title">{{ game.title }}</div>
                    <code>Bundle ID: {{ game.tx.id }}</code>
                    <br/>
                    <code>
                        Made By: 
                    </code>
                    <NuxtLink :to="`/creator/${game.tx.owner.address}`">
                            {{ game.tx.owner.address }}
                    </NuxtLink><br/>
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
                    <v-btn to="../" color="primary" class="btn-back text">Back to Games</v-btn>
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
        // console.log('Tx', tx)
        const title = tx.tags.find(t => t.name === 'Title')?.value || 'Untitled Game'
        const description = tx.tags.find(t => t.name === 'Description')?.value
        const manifestId = tx.tags.find(t => t.name === 'Manifest-ID')?.value
        const license = tx.tags.find(t => t.name === 'License')?.value
        const isUdl = config.public.UDLTxID === license
        // console.log('ManifestId', manifestId)
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
    width: 75%;
    height: 84%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border: 0.5em solid red;
}

.header {
    margin: 30px;
    padding: 15px;
    margin-right: auto;
    color: white;
    line-height: 40px;
    letter-spacing: 25px;   
}

.title {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 72px;
    text-shadow: -2px 0 0 #fdff2a,
        -4px 0 0 #df4a42,
        2px 0 0 #91fcfe,
        4px 0 0 #4405fc;
}

p {
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
    top: 0;
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