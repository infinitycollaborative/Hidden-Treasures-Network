/**
 * Phase 11: Incident Reporting Database Operations
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
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { Incident, IncidentNote, IncidentStatus, IncidentType, IncidentPriority } from '@/types'

const incidentsCollection = collection(db, 'incidents')

/**
 * Create a new incident report
 */
export async function createIncident(
  data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await addDoc(incidentsCollection, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Get incident by ID
 */
export async function getIncidentById(id: string): Promise<Incident | null> {
  const docRef = doc(db, 'incidents', id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) {
    return null
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Incident
}

/**
 * Get all incidents (with optional filters)
 */
export async function getIncidents(filters?: {
  status?: IncidentStatus
  priority?: IncidentPriority
  organizationId?: string
  type?: IncidentType
  minorsInvolved?: boolean
}): Promise<Incident[]> {
  const constraints = []
  
  if (filters?.status) {
    constraints.push(where('status', '==', filters.status))
  }
  
  if (filters?.priority) {
    constraints.push(where('priority', '==', filters.priority))
  }
  
  if (filters?.organizationId) {
    constraints.push(where('organizationId', '==', filters.organizationId))
  }
  
  if (filters?.type) {
    constraints.push(where('type', '==', filters.type))
  }
  
  if (filters?.minorsInvolved !== undefined) {
    constraints.push(where('minorsInvolved', '==', filters.minorsInvolved))
  }
  
  constraints.push(orderBy('createdAt', 'desc'))
  
  const q = query(incidentsCollection, ...constraints)
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Incident))
}

/**
 * Get open incidents
 */
export async function getOpenIncidents(): Promise<Incident[]> {
  const q = query(
    incidentsCollection,
    where('status', 'in', ['open', 'under_review']),
    orderBy('priority', 'desc'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Incident))
}

/**
 * Get high priority incidents
 */
export async function getHighPriorityIncidents(): Promise<Incident[]> {
  const q = query(
    incidentsCollection,
    where('priority', 'in', ['high', 'critical']),
    where('status', '!=', 'closed'),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Incident))
}

/**
 * Get incidents involving minors
 */
export async function getIncidentsWithMinors(): Promise<Incident[]> {
  const q = query(
    incidentsCollection,
    where('minorsInvolved', '==', true),
    where('status', '!=', 'closed'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Incident))
}

/**
 * Update incident
 */
export async function updateIncident(
  id: string,
  data: Partial<Incident>
): Promise<void> {
  const docRef = doc(db, 'incidents', id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Assign incident to an admin
 */
export async function assignIncident(
  incidentId: string,
  assignedTo: string,
  assignedToName: string
): Promise<void> {
  const docRef = doc(db, 'incidents', incidentId)
  await updateDoc(docRef, {
    assignedTo,
    assignedToName,
    status: 'under_review',
    updatedAt: serverTimestamp(),
  })
}

/**
 * Update incident status
 */
export async function updateIncidentStatus(
  incidentId: string,
  status: IncidentStatus
): Promise<void> {
  const docRef = doc(db, 'incidents', incidentId)
  const updateData: any = {
    status,
    updatedAt: serverTimestamp(),
  }
  
  if (status === 'resolved' || status === 'closed') {
    updateData.resolvedAt = serverTimestamp()
  }
  
  await updateDoc(docRef, updateData)
}

/**
 * Add note to incident
 */
export async function addIncidentNote(
  incidentId: string,
  note: Omit<IncidentNote, 'id' | 'timestamp'>
): Promise<void> {
  const incident = await getIncidentById(incidentId)
  if (!incident) {
    throw new Error('Incident not found')
  }
  
  const newNote: IncidentNote = {
    id: Date.now().toString(),
    ...note,
    timestamp: serverTimestamp() as any,
  }
  
  const notes = incident.notes || []
  notes.push(newNote)
  
  const docRef = doc(db, 'incidents', incidentId)
  await updateDoc(docRef, {
    notes,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Update incident priority
 */
export async function updateIncidentPriority(
  incidentId: string,
  priority: IncidentPriority
): Promise<void> {
  const docRef = doc(db, 'incidents', incidentId)
  await updateDoc(docRef, {
    priority,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Get incidents by organization
 */
export async function getIncidentsByOrganization(
  organizationId: string
): Promise<Incident[]> {
  const q = query(
    incidentsCollection,
    where('organizationId', '==', organizationId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Incident))
}

/**
 * Calculate incident stats for an organization
 */
export async function getOrganizationIncidentStats(organizationId: string): Promise<{
  total: number
  open: number
  highPriority: number
  withMinors: number
}> {
  const incidents = await getIncidentsByOrganization(organizationId)
  
  return {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open' || i.status === 'under_review').length,
    highPriority: incidents.filter(i => i.priority === 'high' || i.priority === 'critical').length,
    withMinors: incidents.filter(i => i.minorsInvolved).length,
  }
}
