/**
 * Phase 11: Audit Log Database Operations
 */

import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { AuditLog, AuditAction, UserRole } from '@/types'

/**
 * Create a new audit log entry
 */
export async function createAuditLog(
  data: Omit<AuditLog, 'id' | 'timestamp'>
): Promise<string> {
  if (!db) {
    throw new Error('Firebase not configured')
  }
  const auditLogsCollection = collection(db, 'auditLogs')
  const docRef = await addDoc(auditLogsCollection, {
    ...data,
    timestamp: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Helper function to log an action
 */
export async function logAction(
  userId: string,
  userName: string,
  userRole: UserRole,
  action: AuditAction,
  options?: {
    targetId?: string
    targetType?: 'organization' | 'event' | 'session' | 'user' | 'compliance' | 'incident'
    targetName?: string
    metadata?: Record<string, any>
    ipAddress?: string
    userAgent?: string
  }
): Promise<string> {
  return createAuditLog({
    userId,
    userName,
    userRole,
    action,
    ...options,
  })
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(filters?: {
  userId?: string
  action?: AuditAction
  targetId?: string
  targetType?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}): Promise<AuditLog[]> {
  if (!db) {
    return []
  }
  const auditLogsCollection = collection(db, 'auditLogs')
  const constraints = []
  
  if (filters?.userId) {
    constraints.push(where('userId', '==', filters.userId))
  }
  
  if (filters?.action) {
    constraints.push(where('action', '==', filters.action))
  }
  
  if (filters?.targetId) {
    constraints.push(where('targetId', '==', filters.targetId))
  }
  
  if (filters?.targetType) {
    constraints.push(where('targetType', '==', filters.targetType))
  }
  
  if (filters?.startDate) {
    constraints.push(where('timestamp', '>=', Timestamp.fromDate(filters.startDate)))
  }
  
  if (filters?.endDate) {
    constraints.push(where('timestamp', '<=', Timestamp.fromDate(filters.endDate)))
  }
  
  constraints.push(orderBy('timestamp', 'desc'))
  
  if (filters?.limit) {
    constraints.push(limit(filters.limit))
  }
  
  const q = query(auditLogsCollection, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AuditLog))
}

/**
 * Get audit logs for a specific organization
 */
export async function getOrganizationAuditLogs(
  organizationId: string,
  limitCount: number = 50
): Promise<AuditLog[]> {
  if (!db) {
    return []
  }
  const auditLogsCollection = collection(db, 'auditLogs')
  const q = query(
    auditLogsCollection,
    where('targetType', '==', 'organization'),
    where('targetId', '==', organizationId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AuditLog))
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLogs(
  userId: string,
  limitCount: number = 50
): Promise<AuditLog[]> {
  if (!db) {
    return []
  }
  const auditLogsCollection = collection(db, 'auditLogs')
  const q = query(
    auditLogsCollection,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AuditLog))
}

/**
 * Get recent audit logs (for dashboard)
 */
export async function getRecentAuditLogs(limitCount: number = 100): Promise<AuditLog[]> {
  if (!db) {
    return []
  }
  const auditLogsCollection = collection(db, 'auditLogs')
  const q = query(
    auditLogsCollection,
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AuditLog))
}

/**
 * Get critical action logs (security-relevant actions)
 */
export async function getCriticalAuditLogs(limitCount: number = 50): Promise<AuditLog[]> {
  if (!db) {
    return []
  }
  const auditLogsCollection = collection(db, 'auditLogs')
  const criticalActions: AuditAction[] = [
    'admin_role_changed',
    'organization_suspended',
    'user_suspended',
    'settings_changed',
  ]
  
  const q = query(
    auditLogsCollection,
    where('action', 'in', criticalActions),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AuditLog))
}
