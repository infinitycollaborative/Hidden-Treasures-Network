'use client'

import { useState, useEffect } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from '@/lib/firebase'
import { UserProfile } from '@/lib/auth'

interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  role: string | null
}

/**
 * Custom hook to manage Firebase authentication state and user profile
 * Listens to both Auth state and Firestore profile changes
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Get Firebase instances lazily - only initializes in browser
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()

    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    // Subscribe to auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setIsAuthenticated(!!user)

      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      if (!db) {
        setLoading(false)
        return
      }

      // Subscribe to user profile changes in Firestore
      const unsubscribeProfile = onSnapshot(
        doc(db, 'users', user.uid),
        (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile)
          } else {
            setProfile(null)
          }
          setLoading(false)
        },
        (error) => {
          console.error('Error fetching user profile:', error)
          setProfile(null)
          setLoading(false)
        }
      )

      // Return cleanup function for profile subscription
      return () => unsubscribeProfile()
    })

    // Cleanup auth subscription on unmount
    return () => unsubscribeAuth()
  }, [])

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    role: profile?.role || null,
  }
}
