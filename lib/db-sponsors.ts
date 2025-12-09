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
} from 'firebase/firestore'
import type {
  Sponsor,
  SponsorTier,
  SponsorApplication,
  SponsorImpactMetrics,
  SponsorImpactReport,
} from '@/types/sponsor'

/**
 * Sponsor Tier Operations
 */

export async function createSponsorTier(
  data: Omit<SponsorTier, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  const tierData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'sponsorTiers'), tierData)
  return docRef.id
}

export async function getSponsorTier(tierId: string): Promise<SponsorTier | null> {
  if (!db) return null
  const docRef = doc(db, 'sponsorTiers', tierId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as SponsorTier
  }
  return null
}

export async function getAllSponsorTiers(activeOnly: boolean = false): Promise<SponsorTier[]> {
  if (!db) return []
  let q = query(collection(db, 'sponsorTiers'), orderBy('displayOrder', 'asc'))

  if (activeOnly) {
    q = query(
      collection(db, 'sponsorTiers'),
      where('isActive', '==', true),
      orderBy('displayOrder', 'asc')
    )
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SponsorTier))
}

export async function updateSponsorTier(
  tierId: string,
  data: Partial<Omit<SponsorTier, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  const docRef = doc(db, 'sponsorTiers', tierId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Sponsor Operations
 */

export async function createSponsor(
  data: Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  const sponsorData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'sponsors'), sponsorData)
  return docRef.id
}

export async function getSponsor(sponsorId: string): Promise<Sponsor | null> {
  if (!db) return null
  const docRef = doc(db, 'sponsors', sponsorId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Sponsor
  }
  return null
}

export async function getAllSponsors(statusFilter?: Sponsor['status']): Promise<Sponsor[]> {
  if (!db) return []
  let q = query(collection(db, 'sponsors'), orderBy('joinedAt', 'desc'))

  if (statusFilter) {
    q = query(collection(db, 'sponsors'), where('status', '==', statusFilter), orderBy('joinedAt', 'desc'))
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor))
}

export async function getPublishedSponsors(): Promise<Sponsor[]> {
  if (!db) return []
  const q = query(
    collection(db, 'sponsors'),
    where('isPublished', '==', true),
    where('status', '==', 'active'),
    orderBy('joinedAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor))
}

export async function getSponsorsByTier(tierId: string): Promise<Sponsor[]> {
  if (!db) return []
  const q = query(
    collection(db, 'sponsors'),
    where('tierId', '==', tierId),
    where('status', '==', 'active'),
    orderBy('joinedAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sponsor))
}

export async function updateSponsor(
  sponsorId: string,
  data: Partial<Omit<Sponsor, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  const docRef = doc(db, 'sponsors', sponsorId)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function updateSponsorContributions(
  sponsorId: string,
  amount: number
): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  const sponsor = await getSponsor(sponsorId)
  if (!sponsor) return

  const newTotal = sponsor.totalContributions + amount

  await updateDoc(doc(db, 'sponsors', sponsorId), {
    totalContributions: newTotal,
    lastContributionAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Sponsor Application Operations
 */

export async function createSponsorApplication(
  data: Omit<SponsorApplication, 'id' | 'status' | 'submittedAt'>
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  const applicationData = {
    ...data,
    status: 'pending' as const,
    submittedAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'sponsorApplications'), applicationData)
  return docRef.id
}

export async function getSponsorApplication(
  applicationId: string
): Promise<SponsorApplication | null> {
  if (!db) return null
  const docRef = doc(db, 'sponsorApplications', applicationId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as SponsorApplication
  }
  return null
}

export async function getAllSponsorApplications(
  statusFilter?: SponsorApplication['status']
): Promise<SponsorApplication[]> {
  if (!db) return []
  let q = query(collection(db, 'sponsorApplications'), orderBy('submittedAt', 'desc'))

  if (statusFilter) {
    q = query(
      collection(db, 'sponsorApplications'),
      where('status', '==', statusFilter),
      orderBy('submittedAt', 'desc')
    )
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as SponsorApplication)
  )
}

export async function updateSponsorApplication(
  applicationId: string,
  data: Partial<Pick<SponsorApplication, 'status' | 'reviewedBy' | 'reviewNotes'>>
): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  const docRef = doc(db, 'sponsorApplications', applicationId)
  await updateDoc(docRef, {
    ...data,
    reviewedAt: serverTimestamp(),
  })
}

export async function approveSponsorApplication(
  applicationId: string,
  reviewedBy: string
): Promise<string> {
  const application = await getSponsorApplication(applicationId)
  if (!application) throw new Error('Application not found')

  // Update application status
  await updateSponsorApplication(applicationId, {
    status: 'approved',
    reviewedBy,
  })

  // Create sponsor record
  const sponsorId = await createSponsor({
    orgName: application.orgName,
    contactEmail: application.contactEmail,
    contactName: application.contactName,
    contactPhone: application.contactPhone,
    tierId: application.tierId,
    website: application.website,
    status: 'approved',
    totalContributions: 0,
    joinedAt: serverTimestamp() as any,
    region: application.region,
    programSupport: application.programSupport,
    isPublished: false,
  })

  return sponsorId
}

/**
 * Sponsor Impact Metrics Operations
 */

export async function createOrUpdateSponsorMetrics(
  data: Omit<SponsorImpactMetrics, 'lastCalculated'>
): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  const metricsData = {
    ...data,
    lastCalculated: serverTimestamp(),
  }

  const docRef = doc(db, 'sponsorMetrics', data.sponsorId)
  await updateDoc(docRef, metricsData).catch(async () => {
    // If document doesn't exist, create it
    if (db) await addDoc(collection(db, 'sponsorMetrics'), metricsData)
  })
}

export async function getSponsorMetrics(
  sponsorId: string
): Promise<SponsorImpactMetrics | null> {
  if (!db) return null
  const docRef = doc(db, 'sponsorMetrics', sponsorId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { sponsorId, ...docSnap.data() } as SponsorImpactMetrics
  }
  return null
}

/**
 * Sponsor Impact Report Operations
 */

export async function createSponsorImpactReport(
  data: Omit<SponsorImpactReport, 'id' | 'createdAt'>
): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  const reportData = {
    ...data,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(collection(db, 'sponsorReports'), reportData)
  return docRef.id
}

export async function getSponsorReports(sponsorId: string): Promise<SponsorImpactReport[]> {
  if (!db) return []
  const q = query(
    collection(db, 'sponsorReports'),
    where('sponsorId', '==', sponsorId),
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as SponsorImpactReport)
  )
}
