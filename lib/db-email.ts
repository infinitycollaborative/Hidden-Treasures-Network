import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface EmailSubscriber {
  id: string
  email: string
  source: string // 'homepage', 'footer', 'blog', etc.
  subscribedAt: Timestamp
  active: boolean
}

/**
 * Add a new email subscriber
 */
export async function addEmailSubscriber(
  email: string,
  source: string = 'unknown'
): Promise<void> {
  // Check if email already exists
  const existingQuery = query(
    collection(db, 'emailSubscribers'),
    where('email', '==', email.toLowerCase())
  )
  const existingDocs = await getDocs(existingQuery)

  if (!existingDocs.empty) {
    throw new Error('This email is already subscribed')
  }

  await addDoc(collection(db, 'emailSubscribers'), {
    email: email.toLowerCase(),
    source,
    subscribedAt: serverTimestamp(),
    active: true,
  })
}

/**
 * Get all active email subscribers
 */
export async function getActiveSubscribers(): Promise<EmailSubscriber[]> {
  const q = query(
    collection(db, 'emailSubscribers'),
    where('active', '==', true)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as EmailSubscriber[]
}
