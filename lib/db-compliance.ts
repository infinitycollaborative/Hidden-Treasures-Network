/**
 * Phase 11: Compliance System Database Operations
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { ComplianceRequirement, ComplianceSubmission } from '@/types'

/**
 * Compliance Requirements Operations
 */

export async function createComplianceRequirement(
  data: Omit<ComplianceRequirement, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not configured')
  }
  const complianceRequirementsCollection = collection(db, 'complianceRequirements')
  const docRef = await addDoc(complianceRequirementsCollection, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getComplianceRequirements(): Promise<ComplianceRequirement[]> {
  if (!db) {
    return []
  }
  const complianceRequirementsCollection = collection(db, 'complianceRequirements')
  const snapshot = await getDocs(complianceRequirementsCollection)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as ComplianceRequirement))
}

export async function getComplianceRequirementById(
  id: string
): Promise<ComplianceRequirement | null> {
  if (!db) {
    return null
  }
  const docRef = doc(db, 'complianceRequirements', id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return null
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as ComplianceRequirement
}

export async function updateComplianceRequirement(
  id: string,
  data: Partial<ComplianceRequirement>
): Promise<void> {
  if (!db) {
    return
  }
  const docRef = doc(db, 'complianceRequirements', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Compliance Submissions Operations
 */

export async function createComplianceSubmission(
  data: Omit<ComplianceSubmission, 'id' | 'submittedAt'>
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not configured')
  }
  const complianceSubmissionsCollection = collection(db, 'complianceSubmissions')
  const docRef = await addDoc(complianceSubmissionsCollection, {
    ...data,
    submittedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function getComplianceSubmissionsByOrg(
  orgId: string
): Promise<ComplianceSubmission[]> {
  if (!db) {
    return []
  }
  const complianceSubmissionsCollection = collection(db, 'complianceSubmissions')
  const q = query(
    complianceSubmissionsCollection,
    where('orgId', '==', orgId),
    orderBy('submittedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as ComplianceSubmission))
}

export async function getComplianceSubmissionById(
  id: string
): Promise<ComplianceSubmission | null> {
  if (!db) {
    return null
  }
  const docRef = doc(db, 'complianceSubmissions', id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return null
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as ComplianceSubmission
}

export async function updateComplianceSubmission(
  id: string,
  data: Partial<ComplianceSubmission>
): Promise<void> {
  if (!db) {
    return
  }
  const docRef = doc(db, 'complianceSubmissions', id)
  await updateDoc(docRef, {
    ...data,
    ...(data.status && data.status !== 'submitted' ? { reviewedAt: serverTimestamp() } : {}),
  })
}

export async function approveComplianceSubmission(
  id: string,
  reviewerId: string,
  reviewerName: string,
  comments?: string,
  expirationDate?: Date
): Promise<void> {
  if (!db) {
    return
  }
  const docRef = doc(db, 'complianceSubmissions', id)
  await updateDoc(docRef, {
    status: 'approved',
    adminReviewerId: reviewerId,
    adminReviewerName: reviewerName,
    reviewComments: comments,
    expirationDate: expirationDate ? Timestamp.fromDate(expirationDate) : null,
    reviewedAt: serverTimestamp(),
  })
}

export async function rejectComplianceSubmission(
  id: string,
  reviewerId: string,
  reviewerName: string,
  comments: string
): Promise<void> {
  if (!db) {
    return
  }
  const docRef = doc(db, 'complianceSubmissions', id)
  await updateDoc(docRef, {
    status: 'rejected',
    adminReviewerId: reviewerId,
    adminReviewerName: reviewerName,
    reviewComments: comments,
    reviewedAt: serverTimestamp(),
  })
}

export async function getPendingComplianceSubmissions(): Promise<ComplianceSubmission[]> {
  if (!db) {
    return []
  }
  const complianceSubmissionsCollection = collection(db, 'complianceSubmissions')
  const q = query(
    complianceSubmissionsCollection,
    where('status', '==', 'submitted'),
    orderBy('submittedAt', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as ComplianceSubmission))
}

export async function getExpiringComplianceSubmissions(
  daysAhead: number = 30
): Promise<ComplianceSubmission[]> {
  if (!db) {
    return []
  }
  const complianceSubmissionsCollection = collection(db, 'complianceSubmissions')
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + daysAhead)
  
  const q = query(
    complianceSubmissionsCollection,
    where('status', '==', 'approved'),
    where('expirationDate', '<=', Timestamp.fromDate(futureDate)),
    orderBy('expirationDate', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as ComplianceSubmission))
}

/**
 * Calculate compliance score for an organization
 */
export async function calculateComplianceScore(orgId: string): Promise<number> {
  const requirements = await getComplianceRequirements()
  const orgRequirements = requirements.filter(req => 
    req.appliesTo.includes('organization')
  )
  
  if (orgRequirements.length === 0) {
    return 100
  }
  
  const submissions = await getComplianceSubmissionsByOrg(orgId)
  
  let approvedCount = 0
  const now = new Date()
  
  for (const req of orgRequirements) {
    const reqSubmissions = submissions.filter(
      sub => sub.requirementId === req.id && sub.status === 'approved'
    )
    
    const hasCurrentSubmission = reqSubmissions.some(sub => {
      if (!sub.expirationDate) return true
      const expDate = (sub.expirationDate as any).toDate()
      return expDate > now
    })
    
    if (hasCurrentSubmission) {
      approvedCount++
    }
  }
  
  return Math.round((approvedCount / orgRequirements.length) * 100)
}
