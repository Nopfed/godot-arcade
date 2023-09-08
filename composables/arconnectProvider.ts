import { PermissionType } from "arconnect";
import { Buffer } from "buffer";

const permissions: PermissionType[] = ['ACCESS_ADDRESS', 'SIGN_TRANSACTION',
 "ACCESS_PUBLIC_KEY", "SIGNATURE"]

class ArconnectWalletProvider {
    address: string | null = null
    publicKey: Buffer | null = null
    
    async connect() {
        try {
            // Try to see if we're already connected
            this.address = await window.arweaveWallet.getActiveAddress()
        } catch (error) {}

        if (!this.address) {
            await window.arweaveWallet.connect(permissions)
            this.address = await window.arweaveWallet.getActiveAddress()
        }

        this.publicKey = Buffer.from(
            await window.arweaveWallet.getActivePublicKey(),
            "base64"
        )
        return this.address
    }
}

const arconnectWalletProvider = new ArconnectWalletProvider()
export const useArconnectProvider = () => arconnectWalletProvider
