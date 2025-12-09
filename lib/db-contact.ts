import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
  where,
  limit as firestoreLimit,
} from 'firebase/firestore'
import { db } from './firebase'

export interface ContactMessage {
  id: string
  name: string
  email: string
  organization?: string
  role?: string // 'Student', 'Mentor', 'Organization', 'Sponsor', 'Media', 'Other'
  message: string
  createdAt: Timestamp
  status: 'new' | 'read' | 'replied'
}

/**
 * Submit a new contact message
 */
export async function submitContactMessage(data: {
  name: string
  email: string
  organization?: string
  role?: string
  message: string
}): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  await addDoc(collection(db, 'contactMessages'), {
    ...data,
    createdAt: serverTimestamp(),
    status: 'new',
  })
}

/**
 * Get all contact messages (admin only)
 */
export async function getContactMessages(
  limitCount: number = 50
): Promise<ContactMessage[]> {
  if (!db) return []
  const q = query(
    collection(db, 'contactMessages'),
    orderBy('createdAt', 'desc'),
    firestoreLimit(limitCount)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ContactMessage[]
}

/**
 * Get unread contact messages count
 */
export async function getUnreadMessagesCount(): Promise<number> {
  if (!db) return 0
  const q = query(
    collection(db, 'contactMessages'),
    where('status', '==', 'new')
  )

  const snapshot = await getDocs(q)
  return snapshot.size
}
