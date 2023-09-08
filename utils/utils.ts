import { DataItem } from "arbundles"
import { stringToBuffer } from "arweave/web/lib/utils"
import  deepHash  from "arweave/web/lib/deepHash"

export const readFileAsArrayBufferAsync = (blob: Blob):
  Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = (error) => {
      reject(error)
    }
    reader.onload = (evt) => {
      if (!evt.target || !evt.target.result) {
        reject('Error reading file')
      }

      resolve(reader.result as ArrayBuffer)
    }
    reader.readAsArrayBuffer(blob)
  })
}

export function longTo32ByteArray(long: number): Uint8Array {
  // we want to represent the input as a 8-bytes array
  const byteArray = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ];

  for (let index = 0; index < byteArray.length; index++) {
    const byte = long & 0xff;
    byteArray[index] = byte;
    long = (long - byte) / 256;
  }

  return Buffer.from(byteArray);
}

export async function getSignatureData(item: DataItem): Promise<Uint8Array> {
  return deepHash([
    stringToBuffer("dataitem"),
    stringToBuffer("1"),
    stringToBuffer(item.signatureType.toString()),
    item.rawOwner,
    item.rawTarget,
    item.rawAnchor,
    item.rawTags,
    item.rawData,
  ]);
}
