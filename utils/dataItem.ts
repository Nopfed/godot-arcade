import Arweave from 'arweave'
import { createData, DataItem } from 'arbundles'
import { Signer } from 'arbundles'
import getSignatureData from 'arbundles/build/web/esm/src/ar-data-base'

export default class DataItemFactory {
  static async create(
    data: string | Uint8Array,
    signer: Signer,
    tags?: { name: string, value: string }[]
  ): Promise<DataItem> {
    // const dataItem = createData(data, signer, { tags })

    // await signDataItem(dataItem, signer)
    console.log('dataitemfactory', data.length, data[0], data[1], data[2], data[3])
    try {
      const buffair = await window.arweaveWallet.signDataItem({ data, tags })
      console.log('dataitemfactory buffair', buffair.byteLength)
      return new DataItem(Buffer.from(buffair))
    } catch (error) {
      console.error('error in dataitemfactory', error)
      throw error
    }

    // return dataItem
  }
}

async function signDataItem(item: DataItem, signer: Signer): Promise<Buffer> {
  const { signature, id } = await getSignatureAndId(item, signer)

  item.getRaw().set(signature, 2)

  return id
}

async function getSignatureAndId(
  item: DataItem,
  signer: Signer,
): Promise<{ signature: Buffer; id: Buffer }> {
    // @ts-ignore
  const signatureData = await getSignatureData(item)
  const signatureBytes = await signer.sign(signatureData)
  const idBytes = await Arweave.crypto.hash(signatureBytes)

  return { signature: Buffer.from(signatureBytes), id: Buffer.from(idBytes) }
}
