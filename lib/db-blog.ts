import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  coverImageUrl?: string
  tags: string[]
  publishedAt: Timestamp
  authorName?: string
  authorId?: string
  published: boolean
  views?: number
}

/**
 * Get all published blog posts
 */
export async function getPublishedPosts(
  limitCount: number = 20
): Promise<BlogPost[]> {
  const q = query(
    collection(db, 'blogPosts'),
    where('published', '==', true),
    orderBy('publishedAt', 'desc'),
    firestoreLimit(limitCount)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[]
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const q = query(
    collection(db, 'blogPosts'),
    where('slug', '==', slug),
    where('published', '==', true),
    firestoreLimit(1)
  )

  const snapshot = await getDocs(q)
  if (snapshot.empty) return null

  const docSnap = snapshot.docs[0]
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as BlogPost
}

/**
 * Get a single blog post by ID
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, 'blogPosts', id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) return null

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as BlogPost
}

/**
 * Increment post view count
 */
export async function incrementPostViews(postId: string): Promise<void> {
  const postRef = doc(db, 'blogPosts', postId)
  const postSnap = await getDoc(postRef)

  if (postSnap.exists()) {
    const currentViews = postSnap.data()?.views || 0
    await updateDoc(postRef, {
      views: currentViews + 1,
    })
  }
}

/**
 * Create a new blog post (admin only)
 */
export async function createBlogPost(data: Omit<BlogPost, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'blogPosts'), {
    ...data,
    publishedAt: serverTimestamp(),
    views: 0,
  })

  return docRef.id
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(
  tag: string,
  limitCount: number = 20
): Promise<BlogPost[]> {
  const q = query(
    collection(db, 'blogPosts'),
    where('tags', 'array-contains', tag),
    where('published', '==', true),
    orderBy('publishedAt', 'desc'),
    firestoreLimit(limitCount)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[]
}
