<template>
    <v-container>
        <v-row v-if="data">
            <v-col v-for="{tx, title} in data" :key="tx.id" cols="12">
                <NuxtLink :to="`/game/${tx.id}`">{{ title }}</NuxtLink> by {{ tx.owner.address }}
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ArdbTransaction from 'ardb/lib/models/transaction'

const ardb = useArdb()
const route = useRoute()
const arweave = useArweave()

const {api: {host, port, protocol}} = arweave.getConfig()
const gateway = `${protocol}://${host}:${port}`

const {
    pending, refresh, data
} = useLazyAsyncData(async () => {
    try {
        const txs = await ardb
            .search('transactions')
            .tag('Type', 'game-bundle')
            .tag('Engine', 'godot')
            .limit(100)
            .from(route.params.address.toString())
            .sort("HEIGHT_DESC")
            .find() as ArdbTransaction[]
        

        return txs.map(tx => {
            const title = tx.tags.find(t => t.name === 'Title')?.value || 'Untitled Game'
            const description = tx.tags.find(t => t.name === 'Description')?.value
            return {tx, title, description}
        })
    } catch (error) {
        console.error("Error fetching transaction.", error)
    }
})
</script>