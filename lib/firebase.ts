import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

// Lazy-initialized singletons
let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null
let _initialized = false

function ensureInitialized(): boolean {
  // Skip initialization on server-side to prevent build errors
  if (typeof window === 'undefined') return false
  if (_initialized) return true
  if (!isFirebaseConfigured) return false

  try {
    if (!getApps().length) {
      _app = initializeApp(firebaseConfig)
    } else {
      _app = getApps()[0]
    }
    _auth = getAuth(_app)
    _db = getFirestore(_app)
    _storage = getStorage(_app)
    _initialized = true
    return true
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
    return false
  }
}

// Getter functions for lazy initialization
export function getFirebaseApp(): FirebaseApp | null {
  ensureInitialized()
  return _app
}

export function getFirebaseAuth(): Auth | null {
  ensureInitialized()
  return _auth
}

export function getFirebaseDb(): Firestore | null {
  ensureInitialized()
  return _db
}

export function getFirebaseStorage(): FirebaseStorage | null {
  ensureInitialized()
  return _storage
}

// For backwards compatibility - these will be null during SSR
// Components should check for null or use the getter functions
export const app: FirebaseApp | null = null
export const auth: Auth | null = null
export const db: Firestore | null = null
export const storage: FirebaseStorage | null = null
