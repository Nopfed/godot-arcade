import { PermissionType } from "arconnect";
import Arweave from "arweave";
import { Buffer } from "buffer";

const arweave = useArweave()

const permissions: PermissionType[] = ['ACCESS_ADDRESS', 'SIGN_TRANSACTION',
 "ACCESS_PUBLIC_KEY", "SIGNATURE"]

class ArconnectWalletProvider {
    address: string | null = null
    publicKey: Buffer | null = null
    constructor (private customArweave: Arweave) {}
    
    async connect() {
        await window.arweaveWallet.connect(permissions)
        this.address = await window.arweaveWallet.getActiveAddress()
        this.publicKey = Buffer.from(await window.arweaveWallet.getActivePublicKey(), "base64")
        return this.address
    }
}

const arconnectWalletProvider = new ArconnectWalletProvider(arweave)
export const useArconnectProvider = () => arconnectWalletProvider
