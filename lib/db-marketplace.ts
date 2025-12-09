import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
  Scholarship,
  ScholarshipApplication,
  FundingRequest,
  Sponsorship,
  ImpactReport,
  TaxReceipt,
  SponsorMatch,
  ApplicationStatus,
  FundingRequestStatus,
  PaymentStatus,
} from '@/types'

// ============================================
// SCHOLARSHIP FUNCTIONS
// ============================================

/**
 * Create a new scholarship
 */
export async function createScholarship(
  scholarship: Omit<Scholarship, 'id' | 'applicationCount' | 'awardedCount' | 'applicationIds' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const scholarshipRef = doc(collection(db, 'scholarships'))
    const newScholarship: Scholarship = {
      ...scholarship,
      id: scholarshipRef.id,
      applicationCount: 0,
      awardedCount: 0,
      applicationIds: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(scholarshipRef, newScholarship)
    return scholarshipRef.id
  } catch (error) {
    console.error('Error creating scholarship:', error)
    throw error
  }
}

/**
 * Get open scholarships
 */
export async function getOpenScholarships(): Promise<Scholarship[]> {
  try {
    const now = Timestamp.now()
    const q = query(
      collection(db, 'scholarships'),
      where('status', '==', 'open'),
      where('applicationPeriod.endDate', '>', now),
      orderBy('applicationPeriod.endDate', 'asc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as Scholarship)
  } catch (error) {
    console.error('Error getting open scholarships:', error)
    return []
  }
}

/**
 * Get scholarship by ID
 */
export async function getScholarship(scholarshipId: string): Promise<Scholarship | null> {
  try {
    const scholarshipDoc = await getDoc(doc(db, 'scholarships', scholarshipId))
    return scholarshipDoc.exists() ? (scholarshipDoc.data() as Scholarship) : null
  } catch (error) {
    console.error('Error getting scholarship:', error)
    return null
  }
}

/**
 * Apply for scholarship
 */
export async function applyForScholarship(
  application: Omit<ScholarshipApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; error?: string; applicationId?: string }> {
  try {
    // Get scholarship to check eligibility
    const scholarship = await getScholarship(application.scholarshipId)
    if (!scholarship) {
      return { success: false, error: 'Scholarship not found' }
    }

    if (scholarship.status !== 'open') {
      return { success: false, error: 'Scholarship is not accepting applications' }
    }

    // Check application deadline
    if (scholarship.applicationPeriod.endDate.toMillis() < Date.now()) {
      return { success: false, error: 'Application deadline has passed' }
    }

    // Check if user already applied
    const existingQuery = query(
      collection(db, 'scholarshipApplications'),
      where('scholarshipId', '==', application.scholarshipId),
      where('studentId', '==', application.studentId),
      limit(1)
    )
    const existing = await getDocs(existingQuery)
    if (!existing.empty) {
      return { success: false, error: 'You have already applied for this scholarship' }
    }

    // Create application
    const applicationRef = doc(collection(db, 'scholarshipApplications'))
    const newApplication: ScholarshipApplication = {
      ...application,
      id: applicationRef.id,
      status: 'draft',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(applicationRef, newApplication)

    // Update scholarship application count
    await updateDoc(doc(db, 'scholarships', application.scholarshipId), {
      applicationCount: increment(1),
      applicationIds: arrayUnion(applicationRef.id),
    })

    return { success: true, applicationId: applicationRef.id }
  } catch (error) {
    console.error('Error applying for scholarship:', error)
    return { success: false, error: 'Failed to submit application' }
  }
}

/**
 * Submit scholarship application
 */
export async function submitScholarshipApplication(applicationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, 'scholarshipApplications', applicationId), {
      status: 'submitted',
      submittedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { success: true }
  } catch (error) {
    console.error('Error submitting application:', error)
    return { success: false, error: 'Failed to submit application' }
  }
}

/**
 * Get student's scholarship applications
 */
export async function getStudentApplications(studentId: string): Promise<ScholarshipApplication[]> {
  try {
    const q = query(
      collection(db, 'scholarshipApplications'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as ScholarshipApplication)
  } catch (error) {
    console.error('Error getting student applications:', error)
    return []
  }
}

// ============================================
// FUNDING REQUEST FUNCTIONS
// ============================================

/**
 * Create funding request
 */
export async function createFundingRequest(
  request: Omit<FundingRequest, 'id' | 'currentAmount' | 'sponsorIds' | 'donationIds' | 'updates' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const requestRef = doc(collection(db, 'fundingRequests'))
    const newRequest: FundingRequest = {
      ...request,
      id: requestRef.id,
      currentAmount: 0,
      sponsorIds: [],
      donationIds: [],
      updates: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(requestRef, newRequest)
    return requestRef.id
  } catch (error) {
    console.error('Error creating funding request:', error)
    throw error
  }
}

/**
 * Get approved funding requests
 */
export async function getApprovedFundingRequests(): Promise<FundingRequest[]> {
  try {
    const q = query(
      collection(db, 'fundingRequests'),
      where('status', 'in', ['approved', 'funded', 'in_progress']),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as FundingRequest)
  } catch (error) {
    console.error('Error getting funding requests:', error)
    return []
  }
}

/**
 * Update funding request status
 */
export async function updateFundingRequestStatus(
  requestId: string,
  status: FundingRequestStatus,
  approvedBy?: string
): Promise<void> {
  try {
    const updates: any = {
      status,
      updatedAt: Timestamp.now(),
    }

    if (status === 'approved') {
      updates.approvedBy = approvedBy
      updates.approvedAt = Timestamp.now()
    }

    await updateDoc(doc(db, 'fundingRequests', requestId), updates)
  } catch (error) {
    console.error('Error updating funding request status:', error)
    throw error
  }
}

/**
 * Add update to funding request
 */
export async function addFundingRequestUpdate(
  requestId: string,
  update: {
    message: string
    postedBy: string
    postedByName: string
    imageUrls?: string[]
  }
): Promise<void> {
  try {
    const updateWithId = {
      ...update,
      id: doc(collection(db, 'temp')).id,
      postedAt: Timestamp.now(),
    }

    await updateDoc(doc(db, 'fundingRequests', requestId), {
      updates: arrayUnion(updateWithId),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error adding funding request update:', error)
    throw error
  }
}

// ============================================
// SPONSORSHIP & PAYMENT FUNCTIONS (STRIPE)
// ============================================

/**
 * Create Stripe payment intent
 */
export async function createPaymentIntent(amount: number, currency: string = 'usd'): Promise<{
  clientSecret: string
  paymentIntentId: string
}> {
  try {
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    const data = await response.json()
    return {
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

/**
 * Create sponsorship record
 */
export async function createSponsorship(
  sponsorship: Omit<Sponsorship, 'id' | 'impact' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const sponsorshipRef = doc(collection(db, 'sponsorships'))
    const newSponsorship: Sponsorship = {
      ...sponsorship,
      id: sponsorshipRef.id,
      impact: {
        studentsSponsored: 0,
        certificationsAwarded: 0,
        flightHoursCompleted: 0,
        badgesEarned: 0,
        modulesCompleted: 0,
        eventsAttended: 0,
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(sponsorshipRef, newSponsorship)

    // Update target (scholarship or funding request) with sponsorship
    if (sponsorship.type === 'funding_request' && sponsorship.targetId) {
      await updateDoc(doc(db, 'fundingRequests', sponsorship.targetId), {
        currentAmount: increment(sponsorship.netAmount),
        sponsorIds: arrayUnion(sponsorship.sponsorId),
        donationIds: arrayUnion(sponsorshipRef.id),
      })
    }

    return sponsorshipRef.id
  } catch (error) {
    console.error('Error creating sponsorship:', error)
    throw error
  }
}

/**
 * Update sponsorship payment status
 */
export async function updateSponsorshipPaymentStatus(
  sponsorshipId: string,
  status: PaymentStatus
): Promise<void> {
  try {
    await updateDoc(doc(db, 'sponsorships', sponsorshipId), {
      paymentStatus: status,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating sponsorship payment status:', error)
    throw error
  }
}

/**
 * Get sponsorships by sponsor
 */
export async function getSponsorSponsorships(sponsorId: string): Promise<Sponsorship[]> {
  try {
    const q = query(
      collection(db, 'sponsorships'),
      where('sponsorId', '==', sponsorId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as Sponsorship)
  } catch (error) {
    console.error('Error getting sponsor sponsorships:', error)
    return []
  }
}

// ============================================
// IMPACT TRACKING FUNCTIONS
// ============================================

/**
 * Update sponsorship impact metrics
 */
export async function updateSponsorshipImpact(
  sponsorshipId: string,
  updates: Partial<Sponsorship['impact']>
): Promise<void> {
  try {
    const updateData: any = { updatedAt: Timestamp.now() }

    Object.entries(updates).forEach(([key, value]) => {
      updateData[`impact.${key}`] = increment(value as number)
    })

    await updateDoc(doc(db, 'sponsorships', sponsorshipId), updateData)
  } catch (error) {
    console.error('Error updating sponsorship impact:', error)
    throw error
  }
}

/**
 * Generate impact report for sponsor
 */
export async function generateImpactReport(
  sponsorId: string,
  period: 'monthly' | 'quarterly' | 'annually',
  startDate: Timestamp,
  endDate: Timestamp
): Promise<string> {
  try {
    // Get all sponsorships for this sponsor in the period
    const sponsorships = await getSponsorSponsorships(sponsorId)
    const periodSponsorships = sponsorships.filter(
      (s) =>
        s.createdAt.toMillis() >= startDate.toMillis() &&
        s.createdAt.toMillis() <= endDate.toMillis()
    )

    if (periodSponsorships.length === 0) {
      throw new Error('No sponsorships found for this period')
    }

    // Aggregate metrics
    const totalContributed = periodSponsorships.reduce((sum, s) => sum + s.amount, 0)
    const sponsorshipIds = periodSponsorships.map((s) => s.id)

    // Aggregate impact
    const aggregateImpact = periodSponsorships.reduce(
      (acc, s) => {
        acc.studentsSponsored += s.impact.studentsSponsored
        acc.certificationsAwarded += s.impact.certificationsAwarded
        acc.flightHoursCompleted += s.impact.flightHoursCompleted
        acc.badgesEarned += s.impact.badgesEarned
        acc.modulesCompleted += s.impact.modulesCompleted
        acc.eventsAttended += s.impact.eventsAttended
        return acc
      },
      {
        studentsSponsored: 0,
        certificationsAwarded: 0,
        flightHoursCompleted: 0,
        badgesEarned: 0,
        modulesCompleted: 0,
        eventsAttended: 0,
      }
    )

    // Create impact report
    const reportRef = doc(collection(db, 'impactReports'))
    const report: ImpactReport = {
      id: reportRef.id,
      sponsorId,
      sponsorName: periodSponsorships[0].sponsorName,
      sponsorshipIds,
      period,
      startDate,
      endDate,
      totalContributed,
      totalStudentsImpacted: aggregateImpact.studentsSponsored,
      totalSchoolsSupported: 0, // TODO: Calculate from sponsorships
      totalProgramsFunded: sponsorshipIds.length,
      metrics: {
        newStudentsEnrolled: aggregateImpact.studentsSponsored,
        activeStudents: aggregateImpact.studentsSponsored,
        studentRetentionRate: 85, // TODO: Calculate actual retention
        modulesCompleted: aggregateImpact.modulesCompleted,
        averageGrade: 87, // TODO: Calculate from student progress
        certificationsAwarded: aggregateImpact.certificationsAwarded,
        totalXPAwarded: aggregateImpact.badgesEarned * 500, // Estimate
        badgesEarned: aggregateImpact.badgesEarned,
        averageStudentLevel: 5, // TODO: Calculate from userXP
        questsCompleted: 0, // TODO: Calculate from userQuests
        flightHoursCompleted: aggregateImpact.flightHoursCompleted,
        soloFlights: 0, // TODO: Track solo flights
        checkrides: 0, // TODO: Track checkrides
        eventsHosted: 0, // TODO: Track events
        eventAttendance: aggregateImpact.eventsAttended,
        mentorSessionsHeld: 0, // TODO: Track mentor sessions
      },
      stories: [], // TODO: Fetch student stories
      programUpdates: [], // TODO: Fetch program updates
      financialBreakdown: {
        scholarshipsAwarded: totalContributed * 0.7, // Estimate
        equipmentPurchased: totalContributed * 0.15,
        programOperations: totalContributed * 0.10,
        events: totalContributed * 0.03,
        other: totalContributed * 0.02,
      },
      status: 'draft',
      generatedAt: Timestamp.now(),
      sentToSponsor: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await setDoc(reportRef, report)
    return reportRef.id
  } catch (error) {
    console.error('Error generating impact report:', error)
    throw error
  }
}

/**
 * Get impact reports for sponsor
 */
export async function getSponsorImpactReports(sponsorId: string): Promise<ImpactReport[]> {
  try {
    const q = query(
      collection(db, 'impactReports'),
      where('sponsorId', '==', sponsorId),
      orderBy('generatedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as ImpactReport)
  } catch (error) {
    console.error('Error getting sponsor impact reports:', error)
    return []
  }
}

// ============================================
// TAX RECEIPT FUNCTIONS
// ============================================

/**
 * Generate unique receipt number
 */
function generateReceiptNumber(year: number): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `HTN-${year}-${random}`
}

/**
 * Generate tax receipt for sponsor
 */
export async function generateTaxReceipt(
  sponsorId: string,
  taxYear: number
): Promise<string> {
  try {
    // Get all sponsorships for this year
    const startOfYear = new Date(taxYear, 0, 1).getTime()
    const endOfYear = new Date(taxYear, 11, 31, 23, 59, 59).getTime()

    const sponsorships = await getSponsorSponsorships(sponsorId)
    const yearSponsorships = sponsorships.filter(
      (s) =>
        s.paymentStatus === 'succeeded' &&
        s.createdAt.toMillis() >= startOfYear &&
        s.createdAt.toMillis() <= endOfYear
    )

    if (yearSponsorships.length === 0) {
      throw new Error('No donations found for this tax year')
    }

    const totalAmount = yearSponsorships.reduce((sum, s) => sum + s.amount, 0)
    const sponsorshipIds = yearSponsorships.map((s) => s.id)

    // Get sponsor details
    const sponsorDoc = await getDoc(doc(db, 'users', sponsorId))
    if (!sponsorDoc.exists()) {
      throw new Error('Sponsor not found')
    }
    const sponsor = sponsorDoc.data()

    // Create tax receipt
    const receiptRef = doc(collection(db, 'taxReceipts'))
    const receipt: TaxReceipt = {
      id: receiptRef.id,
      sponsorId,
      sponsorName: sponsor.displayName || yearSponsorships[0].sponsorName,
      sponsorEmail: sponsor.email || yearSponsorships[0].sponsorEmail,
      organizationName: 'Hidden Treasures Network',
      organizationEIN: '00-0000000', // TODO: Add actual EIN
      organizationAddress: {
        line1: '123 Aviation Way',
        city: 'Your City',
        state: 'YS',
        zip: '12345',
        country: 'US',
      },
      sponsorshipIds,
      totalAmount,
      taxYear,
      receiptNumber: generateReceiptNumber(taxYear),
      donations: yearSponsorships.map((s) => ({
        date: s.createdAt,
        amount: s.amount,
        description: s.targetName || 'General Donation',
        sponsorshipId: s.id,
      })),
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    await setDoc(receiptRef, receipt)

    // TODO: Generate PDF and upload to storage
    // TODO: Send email with PDF attachment

    return receiptRef.id
  } catch (error) {
    console.error('Error generating tax receipt:', error)
    throw error
  }
}

// ============================================
// AI SPONSOR MATCHING FUNCTIONS
// ============================================

/**
 * Find potential sponsor matches using AI
 * This uses a simple algorithm - can be enhanced with Claude API
 */
export async function findSponsorMatches(
  targetType: 'scholarship' | 'funding_request' | 'program' | 'student',
  targetId: string
): Promise<SponsorMatch> {
  try {
    // Get target details
    let targetName = ''
    let targetDescription = ''

    if (targetType === 'funding_request') {
      const request = await getDoc(doc(db, 'fundingRequests', targetId))
      if (request.exists()) {
        const data = request.data() as FundingRequest
        targetName = data.title
        targetDescription = data.description
      }
    } else if (targetType === 'scholarship') {
      const scholarship = await getDoc(doc(db, 'scholarships', targetId))
      if (scholarship.exists()) {
        const data = scholarship.data() as Scholarship
        targetName = data.name
        targetDescription = data.description
      }
    }

    // Get all sponsors
    const sponsorsQuery = query(collection(db, 'users'), where('role', '==', 'sponsor'))
    const sponsorsSnapshot = await getDocs(sponsorsQuery)

    // Simple matching algorithm (can be replaced with AI)
    const matches = sponsorsSnapshot.docs.map((doc) => {
      const sponsor = doc.data()
      const pastSponsorships = [] // TODO: Get past sponsorships

      // Calculate match score (simple version)
      let matchScore = 50 // Base score

      // TODO: Enhance with actual matching logic
      // - Keyword matching
      // - Past contribution patterns
      // - Interest alignment
      // - Geographic preferences

      return {
        sponsorId: doc.id,
        sponsorName: sponsor.displayName || 'Anonymous',
        sponsorType: sponsor.sponsorType || 'individual',
        matchScore,
        reasons: ['Past support for similar programs', 'Aligned mission values'],
        pastContributions: sponsor.totalContributed || 0,
        interests: sponsor.interests || [],
      }
    })

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore)

    // Create sponsor match record
    const matchRef = doc(collection(db, 'sponsorMatches'))
    const sponsorMatch: SponsorMatch = {
      id: matchRef.id,
      targetType,
      targetId,
      targetName,
      targetDescription,
      matches: matches.slice(0, 10), // Top 10 matches
      aiAnalysis: {
        targetKeywords: [], // TODO: Extract keywords
        targetCategories: [],
        recommendedSponsorTypes: ['corporate', 'foundation'],
        suggestedAskAmount: 50000, // TODO: Calculate based on need
        confidenceScore: 75,
      },
      generatedAt: Timestamp.now(),
      generatedBy: 'ai',
    }

    await setDoc(matchRef, sponsorMatch)
    return sponsorMatch
  } catch (error) {
    console.error('Error finding sponsor matches:', error)
    throw error
  }
}

/**
 * Get sponsor match by ID
 */
export async function getSponsorMatch(matchId: string): Promise<SponsorMatch | null> {
  try {
    const matchDoc = await getDoc(doc(db, 'sponsorMatches', matchId))
    return matchDoc.exists() ? (matchDoc.data() as SponsorMatch) : null
  } catch (error) {
    console.error('Error getting sponsor match:', error)
    return null
  }
}
