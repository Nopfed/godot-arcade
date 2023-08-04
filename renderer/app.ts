import { createWallet } from "arweavekit/wallet"
import { createTransaction } from "arweavekit/transaction"
import { readFileSync } from 'fs'

const wallet = await createWallet({
    seedPhrase: true,
    environment: 'local'
})

// const key = JSON.parse(readFileSync('wallet.json').toString());

// const transaction = await createTransaction({
//     key: { key. },
//     type: 'data',
//     target: 'TARGET_WALLET_ADDRESS',
//     options: {
//         tags: [{ 'name': key_name, 'value': some_value}],
//         useBundlr: true,
//         environment: 'mainnet',
//     },
// })

//console.log(key)