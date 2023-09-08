<template>
  <v-container>
    <v-row v-if="data">
      <v-col cols="12">
        <div class="header title">
          {{ data[0].tx.owner.address }}
        </div>
      </v-col>
      <v-col v-for="{tx, title} in data" :key="tx.id" class="col" cols="12">
        <NuxtLink class="gamelink" :to="`/game/${tx.id}`">
          {{ title }}
        </NuxtLink>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn class="publish-btn text" color="primary" to="../..">
          Back to Arcade
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.header {
    display: block;
    margin: 30px;
    margin-left: auto;
    margin-right: auto;
    color: white;
    line-height: 40px;
    letter-spacing: 2px;
}

.title {
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    font-size: 48px;
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

<script setup lang="ts">
import ArdbTransaction from 'ardb/lib/models/transaction'

const ardb = useArdb()
const route = useRoute()
// const arweave = useArweave()
// const {api: {host, port, protocol}} = arweave.getConfig()
// const gateway = `${protocol}://${host}:${port}`

const { data } = useLazyAsyncData(async () => {
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
      const title = tx
        .tags
        .find(t => t.name === 'Title')?.value || 'Untitled Game'
      const description = tx.tags.find(t => t.name === 'Description')?.value
      return {tx, title, description}
    })
  } catch (error) {
    console.error("Error fetching transaction.", error)
  }
})
</script>