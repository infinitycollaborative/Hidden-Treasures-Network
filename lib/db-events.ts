import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { db } from './firebase'
import { Event, EventRegistration } from '@/types/event'

export interface EventFilters {
  type?: Event['type']
  audience?: Event['audience'][number]
  country?: string
  state?: string
  isHiddenTreasuresTourStop?: boolean
}

const eventsCollection = collection(db, 'events')
const registrationsCollection = collection(db, 'eventRegistrations')

function mapEvent(snapshot: any): Event {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    title: data.title || '',
    type: data.type,
    audience: data.audience || [],
    description: data.description || '',
    startDate: (data.startDate?.toDate?.() as Date) || new Date(),
    endDate: data.endDate?.toDate?.() as Date,
    location: data.location || {
      address: '',
      city: '',
      country: '',
    },
    isHiddenTreasuresTourStop: data.isHiddenTreasuresTourStop || false,
    organizerId: data.organizerId || '',
    organizerName: data.organizerName,
    capacity: data.capacity,
    registeredCount: data.registeredCount || 0,
    volunteerSlots: data.volunteerSlots,
    volunteerCount: data.volunteerCount || 0,
    registrationOpen: data.registrationOpen ?? true,
    volunteerSignupOpen: data.volunteerSignupOpen ?? false,
    imageUrls: data.imageUrls || [],
    tags: data.tags || [],
    createdAt: (data.createdAt?.toDate?.() as Date) || new Date(),
    updatedAt: (data.updatedAt?.toDate?.() as Date) || new Date(),
  }
}

function mapRegistration(snapshot: any): EventRegistration {
  const data = snapshot.data() || {}
  return {
    id: snapshot.id,
    eventId: data.eventId,
    userId: data.userId,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone,
    role: data.role || 'other',
    status: data.status || 'registered',
    createdAt: (data.createdAt?.toDate?.() as Date) || new Date(),
    updatedAt: (data.updatedAt?.toDate?.() as Date) || new Date(),
  }
}

export async function getUpcomingEvents(filters?: EventFilters): Promise<Event[]> {
  const constraints = [orderBy('startDate', 'asc')] as any[]

  if (filters?.type) constraints.push(where('type', '==', filters.type))
  if (filters?.audience) constraints.push(where('audience', 'array-contains', filters.audience))
  if (filters?.country) constraints.push(where('location.country', '==', filters.country))
  if (filters?.state) constraints.push(where('location.state', '==', filters.state))
  if (filters?.isHiddenTreasuresTourStop !== undefined) {
    constraints.push(where('isHiddenTreasuresTourStop', '==', filters.isHiddenTreasuresTourStop))
  }

  const snapshot = await getDocs(query(eventsCollection, ...constraints))
  return snapshot.docs.map(mapEvent)
}

export async function getEventsByMonth(month: string, year: number): Promise<Event[]> {
  const start = new Date(year, Number(month) - 1, 1)
  const end = new Date(year, Number(month), 1)
  const constraints = [where('startDate', '>=', start), where('startDate', '<', end), orderBy('startDate', 'asc')]
  const snapshot = await getDocs(query(eventsCollection, ...constraints))
  return snapshot.docs.map(mapEvent)
}

export async function getEventsByOrganizer(organizerId: string): Promise<Event[]> {
  const snapshot = await getDocs(query(eventsCollection, where('organizerId', '==', organizerId), orderBy('startDate', 'desc')))
  return snapshot.docs.map(mapEvent)
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const snapshot = await getDoc(doc(db, 'events', eventId))
  if (!snapshot.exists()) return null
  return mapEvent(snapshot)
}

export async function createEvent(data: Partial<Event>): Promise<Event> {
  const docRef = data.id ? doc(eventsCollection, data.id) : doc(eventsCollection)
  await setDoc(docRef, {
    ...data,
    registeredCount: data.registeredCount ?? 0,
    volunteerCount: data.volunteerCount ?? 0,
    isHiddenTreasuresTourStop: data.isHiddenTreasuresTourStop ?? false,
    registrationOpen: data.registrationOpen ?? true,
    volunteerSignupOpen: data.volunteerSignupOpen ?? false,
    imageUrls: data.imageUrls || [],
    tags: data.tags || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const snapshot = await getDoc(docRef)
  return mapEvent(snapshot)
}

export async function updateEvent(eventId: string, data: Partial<Event>): Promise<void> {
  await setDoc(
    doc(db, 'events', eventId),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(db, 'events', eventId))
}

export async function getRegistrationsForEvent(eventId: string): Promise<EventRegistration[]> {
  const snapshot = await getDocs(
    query(registrationsCollection, where('eventId', '==', eventId), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(mapRegistration)
}

export async function createRegistration(
  eventId: string,
  data: Partial<EventRegistration>
): Promise<EventRegistration> {
  const event = await getEventById(eventId)
  const isVolunteer = data.role === 'volunteer'
  const isAtCapacity = event?.capacity !== undefined && (event.registeredCount || 0) >= event.capacity
  const status = isAtCapacity ? 'waitlisted' : data.status || 'registered'
  const docRef = data.id ? doc(registrationsCollection, data.id) : doc(registrationsCollection)

  await setDoc(docRef, {
    ...data,
    eventId,
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  if (!isAtCapacity) {
    await updateDoc(doc(db, 'events', eventId), {
      registeredCount: increment(1),
      volunteerCount: isVolunteer ? increment(1) : increment(0),
    })
  }

  const snapshot = await getDoc(docRef)
  return mapRegistration(snapshot)
}

export async function updateRegistration(
  registrationId: string,
  data: Partial<EventRegistration>
): Promise<void> {
  await setDoc(
    doc(db, 'eventRegistrations', registrationId),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function cancelRegistration(registrationId: string): Promise<void> {
  await updateDoc(doc(db, 'eventRegistrations', registrationId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  })
}

export async function checkInRegistration(registrationId: string): Promise<void> {
  await updateDoc(doc(db, 'eventRegistrations', registrationId), {
    status: 'checked_in',
    updatedAt: serverTimestamp(),
  })
}

export async function getUserRegistrations(userId: string): Promise<EventRegistration[]> {
  const snapshot = await getDocs(
    query(registrationsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(mapRegistration)
}

export const eventIndexes = {
  indexes: [
    { field: 'startDate' },
    { field: 'eventId' },
    { field: 'organizerId' },
    { field: 'userId' },
    { field: 'isHiddenTreasuresTourStop' },
  ],
}
