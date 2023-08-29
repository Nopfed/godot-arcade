<template>
    <v-container>
        <v-row class="header">
            <v-col cols="12">
                <div class="title">Godot Arcade</div>
            </v-col>
        </v-row>
        <v-row v-if="data">
            <v-col class="col" v-for="{tx, title} in data" :key="tx.id"
            cols="12">
                <NuxtLink class="gamelink" :to="`/game/${tx.id}`">
                    {{ title }}
                </NuxtLink>
                <br/> <br/> <br/>
                <p class="text">published by:</p>
                <br/>
                <NuxtLink :to="`/creator/${tx.owner.address}`">
                    {{ tx.owner.address }}
                </NuxtLink>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn class="publish-btn text" color="primary" to="publish">
                    Publish Game
                </v-btn>
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

    // console.log('TXs', txs)
    return txs.map(tx => {
        const title = tx.tags.find(
            t => t.name === 'Title'
        )?.value || 'Untitled Game'
        
        return {tx, title}
    })
})

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
    font-size: 96px;
    text-shadow: -2px 0 0 #fdff2a,
        -4px 0 0 #df4a42,
        2px 0 0 #91fcfe,
        4px 0 0 #4405fc;
}

.publish-btn {
    display: block;
    margin: 30px;
    padding: 7px;
    margin-left: auto;
    margin-right: auto;
    max-width: 250px;
    font-size: 24px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}

.text {
    text-shadow: -1px 0 0 #fdff2a,
        -2px 0 0 #df4a42,
        1px 0 0 #91fcfe,
        2px 0 0 #4405fc;
}

.col {
    display: block;
    max-width: 500px;
    margin: 30px;
    border: 3px solid #B71C1C;
    padding: 15px;
}

.gamelink {
    display: block;
    margin: 30px;
    border: 3px solid #B71C1C;
    padding: 15px;
    text-align: center;
    text-transform: uppercase;
    font-size: 48px;
    font-weight: bold;
    text-shadow: #4405fc;
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