<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="text-red-darken-4 text-center">Godot Arcade</h1>
            </v-col>
        </v-row>
        
        <v-row v-if="data">
            <v-col v-for="{tx, title} in data" :key="tx.id" cols="12">
                <NuxtLink :to="`/game/${tx.id}`">{{ title }}</NuxtLink> 
                by 
                <NuxtLink :to="`/creator/${tx.owner.address}`">
                    {{ tx.owner.address }}
                </NuxtLink>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn color="primary" to="publish">Publish Game</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ArdbTransaction from 'ardb/lib/models/transaction'

const arweave = useArweave()
const ardb = useArdb()

const {
    pending, refresh, data
} = useLazyAsyncData(async () => {
    const txs = await ardb
        .search('transactions')
        .tag('Type', 'game-bundle')
        .tag('Engine', 'godot')
        .limit(10)
        .sort("HEIGHT_DESC")
        .find() as ArdbTransaction[]

    console.log('TXs', txs)
    return txs.map(tx => {
        const title = tx.tags.find(t => t.name === 'Title')?.value || 'Untitled Game'
        return {tx, title}
    })
})

</script>

<style scoped>

</style>