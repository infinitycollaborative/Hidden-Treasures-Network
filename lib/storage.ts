import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

import { storage } from './firebase'

export async function uploadResourceFile(file: File, path: string): Promise<string> {
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

export async function deleteResourceFile(path: string): Promise<void> {
  const fileRef = ref(storage, path)
  await deleteObject(fileRef)
}
