import { createWallet } from "arweavekit/wallet";

const wallet = await createWallet({
    seedPhrase: true,
    environment: 'local'
})