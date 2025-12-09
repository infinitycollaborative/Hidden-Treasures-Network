import { db } from './firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import type { Donation, DonationReceipt } from '@/types/donation'

/**
 * Create a new donation
 */
export async function createDonation(
  data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  const donationData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'donations'), donationData)
  return docRef.id
}

/**
 * Get donation by ID
 */
export async function getDonation(donationId: string): Promise<Donation | null> {
  if (!db) return null
  const docRef = doc(db, 'donations', donationId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Donation
  }
  return null
}

/**
 * Update donation status
 */
export async function updateDonationStatus(
  donationId: string,
  status: Donation['status']
): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  const docRef = doc(db, 'donations', donationId)
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Get donations by user ID
 */
export async function getDonationsByUser(userId: string): Promise<Donation[]> {
  if (!db) return []
  const q = query(
    collection(db, 'donations'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Donation)
  )
}

/**
 * Get all donations (for admin)
 */
export async function getAllDonations(
  limitCount: number = 100
): Promise<Donation[]> {
  if (!db) return []
  const q = query(
    collection(db, 'donations'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Donation)
  )
}

/**
 * Get donations by sponsor tier
 */
export async function getDonationsByTier(tierId: string): Promise<Donation[]> {
  if (!db) return []
  const q = query(
    collection(db, 'donations'),
    where('sponsorTier', '==', tierId),
    where('status', '==', 'succeeded'),
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Donation)
  )
}

/**
 * Create donation receipt
 */
export async function createDonationReceipt(
  data: Omit<DonationReceipt, 'id' | 'createdAt'>
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  const receiptData = {
    ...data,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'donationReceipts'), receiptData)
  return docRef.id
}

/**
 * Get receipt by donation ID
 */
export async function getReceiptByDonationId(
  donationId: string
): Promise<DonationReceipt | null> {
  if (!db) return null
  const q = query(
    collection(db, 'donationReceipts'),
    where('donationId', '==', donationId),
    limit(1)
  )

  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as DonationReceipt
  }
  return null
}

/**
 * Get receipts by user ID
 */
export async function getReceiptsByUser(userId: string): Promise<DonationReceipt[]> {
  if (!db) return []
  const q = query(
    collection(db, 'donationReceipts'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as DonationReceipt)
  )
}

/**
 * Calculate total donations for a user
 */
export async function calculateUserTotalDonations(userId: string): Promise<number> {
  const donations = await getDonationsByUser(userId)
  return donations
    .filter((d) => d.status === 'succeeded')
    .reduce((total, d) => total + d.amount, 0)
}

/**
 * Get donation statistics
 */
export async function getDonationStats(): Promise<{
  totalAmount: number
  totalDonations: number
  monthlyDonors: number
  oneTimeDonors: number
}> {
  const allDonations = await getAllDonations(1000)
  const succeededDonations = allDonations.filter((d) => d.status === 'succeeded')

  const totalAmount = succeededDonations.reduce((sum, d) => sum + d.amount, 0)
  const totalDonations = succeededDonations.length
  const monthlyDonors = succeededDonations.filter((d) => d.type === 'monthly').length
  const oneTimeDonors = succeededDonations.filter((d) => d.type === 'one-time').length

  return {
    totalAmount,
    totalDonations,
    monthlyDonors,
    oneTimeDonors,
  }
}
