import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if Firebase is properly configured
const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

// Singleton instances
let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

// Initialize Firebase only once
function initializeFirebase(): void {
  if (!isFirebaseConfigured) {
    if (typeof window !== 'undefined') {
      console.warn('Firebase is not configured. Please set environment variables.')
    }
    return
  }

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error('Firebase initialization failed:', error)
    // Reset to null on failure to prevent partial initialization
    app = null
    auth = null
    db = null
    storage = null
  }
}

// Initialize immediately
initializeFirebase()

// Helper function to check Firebase availability
export function isFirebaseAvailable(): boolean {
  return isFirebaseConfigured && app !== null && db !== null
}

// Getter functions for lazy access with null checks
export function getFirebaseApp(): FirebaseApp | null {
  return app
}

export function getFirebaseAuth(): Auth | null {
  return auth
}

export function getFirebaseDb(): Firestore | null {
  return db
}

export function getFirebaseStorage(): FirebaseStorage | null {
  return storage
}

export { app, auth, db, storage, isFirebaseConfigured }
