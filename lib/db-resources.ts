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
import { Resource, ResourceAudience, ResourceCategory } from '@/types/resource'

export interface ResourceFilters {
  category?: ResourceCategory
  audience?: ResourceAudience
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isFeatured?: boolean
  sortBy?: 'newest' | 'downloads' | 'featured'
  organizationId?: string
}

const resourcesCollection = collection(db, 'resources')

function mapResource(docSnapshot: any): Resource {
  const data = docSnapshot.data() || {}

  return {
    id: docSnapshot.id,
    title: data.title || '',
    category: data.category,
    audience: data.audience || [],
    description: data.description || '',
    fileUrl: data.fileUrl || '',
    fileType: data.fileType || 'other',
    thumbnailUrl: data.thumbnailUrl,
    uploadedBy: data.uploadedBy,
    uploadedByName: data.uploadedByName,
    organizationId: data.organizationId,
    tags: data.tags || [],
    difficulty: data.difficulty,
    durationMinutes: data.durationMinutes,
    language: data.language,
    downloads: data.downloads || 0,
    views: data.views || 0,
    rating: data.rating,
    isFeatured: data.isFeatured || false,
    createdAt: (data.createdAt?.toDate?.() as Date) || new Date(),
    updatedAt: (data.updatedAt?.toDate?.() as Date) || new Date(),
  }
}

export async function getResources(filters?: ResourceFilters): Promise<Resource[]> {
  const constraints = [] as any[]

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category))
  }

  if (filters?.audience) {
    constraints.push(where('audience', 'array-contains', filters.audience))
  }

  if (filters?.difficulty) {
    constraints.push(where('difficulty', '==', filters.difficulty))
  }

  if (filters?.isFeatured !== undefined) {
    constraints.push(where('isFeatured', '==', filters.isFeatured))
  }

  if (filters?.organizationId) {
    constraints.push(where('organizationId', '==', filters.organizationId))
  }

  if (filters?.sortBy === 'downloads') {
    constraints.push(orderBy('downloads', 'desc'))
  } else if (filters?.sortBy === 'featured') {
    constraints.push(orderBy('isFeatured', 'desc'), orderBy('createdAt', 'desc'))
  } else {
    constraints.push(orderBy('createdAt', 'desc'))
  }

  const snapshot = await getDocs(query(resourcesCollection, ...constraints))
  return snapshot.docs.map(mapResource)
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const snapshot = await getDoc(doc(db, 'resources', id))
  if (!snapshot.exists()) return null
  return mapResource(snapshot)
}

export async function createResource(data: Partial<Resource>): Promise<Resource> {
  const docRef = data.id ? doc(resourcesCollection, data.id) : doc(resourcesCollection)

  await setDoc(docRef, {
    ...data,
    downloads: data.downloads ?? 0,
    views: data.views ?? 0,
    isFeatured: data.isFeatured ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const snapshot = await getDoc(docRef)
  return mapResource(snapshot)
}

export async function updateResource(id: string, data: Partial<Resource>): Promise<void> {
  await setDoc(
    doc(db, 'resources', id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function deleteResource(id: string): Promise<void> {
  await deleteDoc(doc(db, 'resources', id))
}

export async function incrementResourceView(id: string): Promise<void> {
  await updateDoc(doc(db, 'resources', id), {
    views: increment(1),
  })
}

export async function incrementResourceDownload(id: string): Promise<void> {
  await updateDoc(doc(db, 'resources', id), {
    downloads: increment(1),
  })
}

export async function getFeaturedResources(): Promise<Resource[]> {
  const snapshot = await getDocs(
    query(resourcesCollection, where('isFeatured', '==', true), orderBy('createdAt', 'desc'))
  )
  return snapshot.docs.map(mapResource)
}

export async function searchResources(queryText: string, filters?: ResourceFilters): Promise<Resource[]> {
  const resources = await getResources(filters)
  const normalizedQuery = queryText.toLowerCase()

  return resources.filter((resource) => {
    const haystack = `${resource.title} ${resource.description} ${resource.tags?.join(' ')}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })
}

export const resourceIndexes = {
  indexes: [
    { field: 'category' },
    { field: 'audience' },
    { field: 'tags' },
    { field: 'isFeatured' },
    { field: 'createdAt' },
  ],
}
