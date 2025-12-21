'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { UserProfile } from '@/types/user'
import { useAuth } from '@/hooks/use-auth'
import { 
  computeMentorMatchScores, 
  MentorMatchResult,
  getMentorDisplayName,
  formatAvailabilitySummary
} from '@/lib/matching'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Languages, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function FindMentorPage() {
  const { profile: currentProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [mentorMatches, setMentorMatches] = useState<MentorMatchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!currentProfile) {
        router.push('/login')
        return
      }
      if (currentProfile.role !== 'student') {
        router.push('/dashboard')
        return
      }
      fetchAndMatchMentors()
    }
  }, [currentProfile, authLoading])

  async function fetchAndMatchMentors() {
    const db = getFirebaseDb()
    if (!db) {
      setLoading(false)
      return
    }

    try {
      // Fetch all mentors who accept new mentees
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'mentor')
      )
      
      const snapshot = await getDocs(q)
      const mentorList: UserProfile[] = []
      
      snapshot.forEach(doc => {
        const mentorData = { uid: doc.id, ...doc.data() } as UserProfile
        // Only include mentors with complete profiles and accepting new mentees
        if (mentorData.mentorProfile?.acceptsNewMentees) {
          mentorList.push(mentorData)
        }
      })

      // Compute match scores
      if (currentProfile) {
        // Convert auth profile to match profile format
        const studentForMatching: UserProfile = {
          uid: currentProfile.uid,
          email: currentProfile.email,
          role: currentProfile.role as UserProfile['role'],
          firstName: currentProfile.displayName?.split(' ')[0] || '',
          lastName: currentProfile.displayName?.split(' ')[1] || '',
          displayName: currentProfile.displayName,
          location: currentProfile.location,
          createdAt: currentProfile.createdAt,
          updatedAt: currentProfile.createdAt,
          profileComplete: true,
        }
        const matches = await computeMentorMatchScores({
          student: studentForMatching,
          mentors: mentorList
        })
        setMentorMatches(matches)
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your perfect mentors...</p>
        </div>
      </div>
    )
  }

  const topMatches = mentorMatches.filter(m => m.score >= 50)
  const otherMatches = mentorMatches.filter(m => m.score < 50 && m.score > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-2">
            Find Your Mentor
          </h1>
          <p className="text-gray-600">
            We've matched you with mentors based on your interests and goals
          </p>
        </div>

        {/* Profile Notice */}
        {currentProfile && !(currentProfile as unknown as Record<string, unknown>)?.studentProfile && (
          <Card className="mb-6 border-aviation-gold">
            <CardContent className="py-4">
              <p className="text-gray-700">
                <strong>Tip:</strong> Complete your student profile with your interests and goals to get better mentor matches!
              </p>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="mt-3">
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Top Matches */}
        {topMatches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Top Matches ({topMatches.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {topMatches.map(match => {
                const mentor = match.mentor
                const profile = mentor.mentorProfile
                if (!profile) return null

                const displayName = getMentorDisplayName(mentor)
                const location = profile.virtualOnly 
                  ? 'Virtual Only' 
                  : `${mentor.location?.city || ''}${mentor.location?.city && mentor.location?.state ? ', ' : ''}${mentor.location?.state || mentor.location?.country || ''}`

                return (
                  <Card key={mentor.uid} className="hover:shadow-lg transition-shadow border-2 border-green-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{displayName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-4 w-4" />
                            {location}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-600 text-white">
                          {match.score}% Match
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {/* Match Reasons */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Why this match?</p>
                          <ul className="space-y-1">
                            {match.reasons.slice(0, 3).map((reason, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start gap-1">
                                <span className="text-green-600 mt-0.5">&#10003;</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Specialties */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
                          <div className="flex flex-wrap gap-1">
                            {profile.specialties.slice(0, 3).map(specialty => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {profile.specialties.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{profile.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {profile.experienceYears && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {profile.experienceYears} yrs
                            </span>
                          )}
                          {profile.languages && profile.languages.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Languages className="h-4 w-4" />
                              {profile.languages.slice(0, 2).join(', ')}
                            </span>
                          )}
                        </div>

                        {/* Availability */}
                        {profile.availability && profile.availability.length > 0 && (
                          <p className="text-sm text-gray-600">
                            {formatAvailabilitySummary(mentor)}
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Link href={`/mentors/${mentor.uid}`}>
                            <Button variant="outline" className="w-full">
                              View Profile
                            </Button>
                          </Link>
                          <Link href={`/dashboard/student/sessions/request?mentorId=${mentor.uid}`}>
                            <Button className="w-full bg-aviation-navy hover:bg-aviation-navy/90">
                              Request Session
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Other Available Mentors */}
        {otherMatches.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Other Available Mentors ({otherMatches.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherMatches.map(match => {
                const mentor = match.mentor
                const profile = mentor.mentorProfile
                if (!profile) return null

                const displayName = getMentorDisplayName(mentor)
                const location = profile.virtualOnly 
                  ? 'Virtual Only' 
                  : `${mentor.location?.city || ''}${mentor.location?.city && mentor.location?.state ? ', ' : ''}${mentor.location?.state || mentor.location?.country || ''}`

                return (
                  <Card key={mentor.uid} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{displayName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                            <MapPin className="h-3 w-3" />
                            {location}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {match.score}%
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-2">
                        {/* Specialties */}
                        <div className="flex flex-wrap gap-1">
                          {profile.specialties.slice(0, 2).map(specialty => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {profile.specialties.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{profile.specialties.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Action Button */}
                        <Link href={`/mentors/${mentor.uid}`}>
                          <Button variant="outline" className="w-full mt-2" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* No Matches */}
        {mentorMatches.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">
                No mentors are currently accepting new mentees.
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Check back soon or browse our mentor directory.
              </p>
              <Link href="/mentors">
                <Button variant="outline">
                  Browse All Mentors
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Browse All Link */}
        {mentorMatches.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/mentors">
              <Button variant="outline">
                Browse All Mentors
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
