import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

export type ProgramType = 'Flight' | 'STEM' | 'Aircraft Maintenance' | 'Drone' | 'Entrepreneurship'
export type OrganizationStatus = 'approved' | 'pending' | 'active'

export interface OrganizationLocation {
  country?: string
  state?: string
  city?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface OrganizationImpact {
  studentsServed?: number
  certificationsAwarded?: number
  volunteerHours?: number
  eventsHosted?: number
}

export interface OrganizationMedia {
  logoUrl?: string
  gallery?: string[]
}

export interface OrganizationRecord {
  id?: string
  name: string
  description?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  location?: OrganizationLocation
  programTypes?: ProgramType[]
  status?: OrganizationStatus
  keywords?: string[]
  media?: OrganizationMedia
  impact?: OrganizationImpact
  social?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
}

export interface OrganizationFilters {
  country?: string
  programTypes?: ProgramType[]
  statuses?: OrganizationStatus[]
  search?: string
  city?: string
}

const organizationsCollection = collection(db, 'organizations')

function mapOrganization(docSnapshot: any): OrganizationRecord {
  const data = docSnapshot.data() || {}
  return {
    id: docSnapshot.id,
    ...data,
  } as OrganizationRecord
}

export async function getAllOrganizations(): Promise<OrganizationRecord[]> {
  const snapshot = await getDocs(organizationsCollection)
  return snapshot.docs.map(mapOrganization)
}

export async function getOrganizationsByFilters(
  filters: OrganizationFilters
): Promise<OrganizationRecord[]> {
  const constraints = [] as any[]

  if (filters.country) {
    constraints.push(where('location.country', '==', filters.country))
  }

  if (filters.statuses && filters.statuses.length > 0) {
    constraints.push(where('status', 'in', filters.statuses))
  }

  if (filters.programTypes && filters.programTypes.length > 0) {
    if (filters.programTypes.length === 1) {
      constraints.push(where('programTypes', 'array-contains', filters.programTypes[0]))
    } else {
      constraints.push(where('programTypes', 'array-contains-any', filters.programTypes))
    }
  }

  const q = constraints.length > 0 ? query(organizationsCollection, ...constraints) : organizationsCollection
  const snapshot = await getDocs(q)

  const searchTerm = filters.search?.toLowerCase()
  const cityTerm = filters.city?.toLowerCase()

  return snapshot.docs
    .map(mapOrganization)
    .filter((org) => {
      const matchesSearch = searchTerm
        ? [org.name, org.location?.city, org.description, ...(org.keywords || [])]
            .filter(Boolean)
            .some((value) => value!.toString().toLowerCase().includes(searchTerm))
        : true

      const matchesCity = cityTerm ? org.location?.city?.toLowerCase().includes(cityTerm) : true

      return matchesSearch && matchesCity
    })
}

export async function getOrganizationById(id: string): Promise<OrganizationRecord | null> {
  const snapshot = await getDoc(doc(db, 'organizations', id))
  if (!snapshot.exists()) return null
  return mapOrganization(snapshot)
}

export async function createOrganization(data: OrganizationRecord): Promise<string> {
  const docRef = await addDoc(organizationsCollection, data)
  return docRef.id
}

export async function updateOrganization(id: string, data: Partial<OrganizationRecord>): Promise<void> {
  await updateDoc(doc(db, 'organizations', id), data)
}

export async function deleteOrganization(id: string): Promise<void> {
  await deleteDoc(doc(db, 'organizations', id))
}
