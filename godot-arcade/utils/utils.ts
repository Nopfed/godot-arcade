export const readFileAsArrayBufferAsync = (blob: Blob):
  Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = async (error) => {
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
