/**
 * Phase 11: Admin Communications Database Operations
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
  limit,
  Timestamp,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore'
import { db } from './firebase'
import { AdminMessage, MessageAudience, UserRole } from '@/types'

/**
 * Create a new admin message
 */
export async function createAdminMessage(
  data: Omit<AdminMessage, 'id' | 'createdAt' | 'readBy'>
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not configured')
  }
  const adminMessagesCollection = collection(db, 'adminMessages')
  const docRef = await addDoc(adminMessagesCollection, {
    ...data,
    readBy: [],
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Get message by ID
 */
export async function getAdminMessageById(id: string): Promise<AdminMessage | null> {
  if (!db) {
    return null
  }
  const docRef = doc(db, 'adminMessages', id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return null
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as AdminMessage
}

/**
 * Get all admin messages
 */
export async function getAdminMessages(filters?: {
  audience?: MessageAudience
  sent?: boolean
  limitCount?: number
}): Promise<AdminMessage[]> {
  if (!db) {
    return []
  }
  const adminMessagesCollection = collection(db, 'adminMessages')
  const constraints = []
  
  if (filters?.audience) {
    constraints.push(where('audience', '==', filters.audience))
  }
  
  if (filters?.sent !== undefined) {
    if (filters.sent) {
      constraints.push(where('sentAt', '!=', null))
    } else {
      constraints.push(where('sentAt', '==', null))
    }
  }
  
  constraints.push(orderBy('createdAt', 'desc'))
  
  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount))
  }
  
  const q = query(adminMessagesCollection, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AdminMessage))
}

/**
 * Get messages for a specific user based on their profile
 */
export async function getMessagesForUser(
  userId: string,
  userRole: UserRole,
  country?: string,
  region?: string,
  organizationId?: string
): Promise<AdminMessage[]> {
  const allMessages = await getAdminMessages({ sent: true })
  
  return allMessages.filter(msg => {
    if (msg.audience === 'network_wide') {
      return true
    }
    
    if (msg.audience === 'country' && country) {
      return msg.targetCountries?.includes(country)
    }
    
    if (msg.audience === 'region' && region) {
      return msg.targetRegions?.includes(region)
    }
    
    if (msg.audience === 'organization' && organizationId) {
      return msg.targetOrganizations?.includes(organizationId)
    }
    
    if (msg.audience === 'role_specific') {
      return msg.targetRoles?.includes(userRole)
    }
    
    return false
  })
}

/**
 * Mark message as read by a user
 */
export async function markMessageAsRead(
  messageId: string,
  userId: string
): Promise<void> {
  if (!db) {
    return
  }
  const docRef = doc(db, 'adminMessages', messageId)
  await updateDoc(docRef, {
    readBy: arrayUnion(userId),
  })
}

/**
 * Send scheduled message (mark as sent)
 */
export async function sendAdminMessage(messageId: string): Promise<void> {
  if (!db) {
    return
  }
  const docRef = doc(db, 'adminMessages', messageId)
  await updateDoc(docRef, {
    sentAt: serverTimestamp(),
  })
}

/**
 * Update admin message
 */
export async function updateAdminMessage(
  id: string,
  data: Partial<AdminMessage>
): Promise<void> {
  if (!db) {
    return
  }
  const docRef = doc(db, 'adminMessages', id)
  await updateDoc(docRef, data)
}

/**
 * Get unread messages for a user
 */
export async function getUnreadMessagesForUser(
  userId: string,
  userRole: UserRole,
  country?: string,
  region?: string,
  organizationId?: string
): Promise<AdminMessage[]> {
  const messages = await getMessagesForUser(userId, userRole, country, region, organizationId)
  return messages.filter(msg => !msg.readBy?.includes(userId))
}

/**
 * Get pending scheduled messages
 */
export async function getPendingScheduledMessages(): Promise<AdminMessage[]> {
  if (!db) {
    return []
  }
  const adminMessagesCollection = collection(db, 'adminMessages')
  const now = Timestamp.now()
  const q = query(
    adminMessagesCollection,
    where('sentAt', '==', null),
    where('scheduledFor', '<=', now),
    orderBy('scheduledFor', 'asc')
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AdminMessage))
}
