/**
 * Database helpers for Mentor Sessions
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
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { MentorSession, SessionStatus, TimeSlot } from '@/types/session'

const SESSIONS_COLLECTION = 'mentorSessions'

/**
 * Create a new mentor session request
 */
export async function createMentorSessionRequest(data: {
  studentId: string
  mentorId: string
  requestedBy: 'student' | 'mentor'
  requestedTimeSlots: TimeSlot[]
  topic?: string
  notes?: string
}): Promise<string> {
  if (!db) throw new Error('Firebase not configured')
  try {
    const sessionData = {
      ...data,
      status: 'requested' as SessionStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData)
    return docRef.id
  } catch (error) {
    console.error('Error creating session request:', error)
    throw new Error('Failed to create session request')
  }
}

/**
 * Get all sessions for a specific user (as student or mentor)
 */
export async function getSessionsForUser(userId: string): Promise<MentorSession[]> {
  if (!db) return []
  try {
    // Query for sessions where user is either student or mentor
    const studentQuery = query(
      collection(db, SESSIONS_COLLECTION),
      where('studentId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const mentorQuery = query(
      collection(db, SESSIONS_COLLECTION),
      where('mentorId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const [studentSnapshot, mentorSnapshot] = await Promise.all([
      getDocs(studentQuery),
      getDocs(mentorQuery)
    ])

    const sessions: MentorSession[] = []
    
    studentSnapshot.forEach(doc => {
      sessions.push({ id: doc.id, ...doc.data() } as MentorSession)
    })
    
    mentorSnapshot.forEach(doc => {
      sessions.push({ id: doc.id, ...doc.data() } as MentorSession)
    })

    // Sort by createdAt descending
    return sessions.sort((a, b) => {
      const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0
      const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0
      return bTime - aTime
    })
  } catch (error) {
    console.error('Error fetching user sessions:', error)
    throw new Error('Failed to fetch sessions')
  }
}

/**
 * Get all sessions for a specific mentor
 */
export async function getSessionsForMentor(mentorId: string): Promise<MentorSession[]> {
  if (!db) return []
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('mentorId', '==', mentorId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    const sessions: MentorSession[] = []
    
    snapshot.forEach(doc => {
      sessions.push({ id: doc.id, ...doc.data() } as MentorSession)
    })

    return sessions
  } catch (error) {
    console.error('Error fetching mentor sessions:', error)
    throw new Error('Failed to fetch mentor sessions')
  }
}

/**
 * Get a single session by ID
 */
export async function getSessionById(sessionId: string): Promise<MentorSession | null> {
  if (!db) return null
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MentorSession
    }
    
    return null
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

/**
 * Update session status and optionally other fields
 */
export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus,
  updates?: Partial<MentorSession>
): Promise<void> {
  if (!db) throw new Error('Firebase not configured')
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId)
    
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
      ...updates
    })
  } catch (error) {
    console.error('Error updating session status:', error)
    throw new Error('Failed to update session')
  }
}

/**
 * Approve a session and set the chosen time slot
 */
export async function approveSession(
  sessionId: string,
  chosenSlot: TimeSlot,
  meetingUrl?: string
): Promise<void> {
  const updates: Partial<MentorSession> = {
    chosenSlot,
  }
  
  if (meetingUrl) {
    updates.meetingUrl = meetingUrl
  }

  await updateSessionStatus(sessionId, 'approved', updates)
}

/**
 * Decline a session
 */
export async function declineSession(sessionId: string): Promise<void> {
  await updateSessionStatus(sessionId, 'declined')
}

/**
 * Cancel a session
 */
export async function cancelSession(sessionId: string): Promise<void> {
  await updateSessionStatus(sessionId, 'cancelled')
}

/**
 * Mark a session as completed
 */
export async function completeSession(sessionId: string): Promise<void> {
  await updateSessionStatus(sessionId, 'completed')
}
