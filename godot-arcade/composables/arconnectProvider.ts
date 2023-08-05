import { PermissionType } from "arconnect";
import Arweave from "arweave";

const arweave = useArweave()

const permissions: PermissionType[] = ['ACCESS_ADDRESS', 'SIGN_TRANSACTION']

class ArconnectWalletProvider {
    address: string | null = null
    constructor (private customArweave: Arweave) {}
    
    async connect() {
        await window.arweaveWallet.connect(permissions)
        this.address = await window.arweaveWallet.getActiveAddress()
        return this.address
    }
}
const arconnectWalletProvider = new ArconnectWalletProvider(arweave)
export const useArconnectProvider = () => arconnectWalletProvider