import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase'
import { UserRole } from '@/types'

export interface SignUpData {
  email: string
  password: string
  displayName: string
  role: UserRole
  organizationName?: string
  location?: {
    city?: string
    state?: string
    country?: string
  }
}

export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  displayName: string
  firstName?: string
  lastName?: string
  organizationName?: string
  location?: {
    city?: string
    state?: string
    country?: string
  }
  profileComplete: boolean
  createdAt: any
  lastLoginAt?: any
}

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(data: SignUpData): Promise<User> {
  if (!auth || !db) {
    throw new Error('Firebase is not configured')
  }
  
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )
    const user = userCredential.user

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: data.email,
      role: data.role,
      displayName: data.displayName,
      organizationName: data.organizationName,
      location: data.location,
      profileComplete: false,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'users', user.uid), userProfile)

    return user
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up')
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  if (!auth || !db) {
    throw new Error('Firebase is not configured')
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)

    // Update last login
    await setDoc(
      doc(db, 'users', userCredential.user.uid),
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    )

    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in')
  }
}

/**
 * Sign in with Google (placeholder for future implementation)
 */
export async function signInWithGoogle(): Promise<User> {
  if (!auth || !db) {
    throw new Error('Firebase is not configured')
  }
  
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid))

    if (!userDoc.exists()) {
      // Create new user profile for Google sign-in users
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        role: 'student', // Default role, can be updated later
        displayName: user.displayName || 'User',
        profileComplete: false,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      }
      await setDoc(doc(db, 'users', user.uid), userProfile)
    } else {
      // Update last login
      await setDoc(
        doc(db, 'users', user.uid),
        { lastLoginAt: serverTimestamp() },
        { merge: true }
      )
    }

    return user
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google')
  }
}

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured')
  }
  
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out')
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured')
  }
  
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email')
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) {
    return null
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error: any) {
    console.error('Error fetching user profile:', error)
    return null
  }
}
