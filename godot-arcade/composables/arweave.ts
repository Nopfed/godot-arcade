import Arweave from "arweave";

const arweave = Arweave.init({
    port: 1984,
    host: 'localhost',
    protocol: 'http'
})

export const useArweave = () => arweave