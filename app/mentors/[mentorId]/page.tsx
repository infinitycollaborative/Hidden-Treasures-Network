'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { UserProfile } from '@/types/user'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Languages, 
  Star, 
  CheckCircle, 
  Award, 
  Clock,
  MessageSquare,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatAvailabilitySummary } from '@/lib/matching'

export default function MentorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { profile: currentUserProfile } = useAuth()
  const [mentor, setMentor] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const mentorId = params.mentorId as string

  useEffect(() => {
    if (mentorId) {
      fetchMentor()
    }
  }, [mentorId])

  async function fetchMentor() {
    const db = getFirebaseDb()
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const docRef = doc(db, 'users', mentorId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const mentorData = { uid: docSnap.id, ...docSnap.data() } as UserProfile
        if (mentorData.role === 'mentor') {
          setMentor(mentorData)
        }
      }
    } catch (error) {
      console.error('Error fetching mentor:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSession = () => {
    if (!currentUserProfile) {
      router.push('/login')
      return
    }
    router.push(`/dashboard/student/sessions/request?mentorId=${mentorId}`)
  }

  const handleSendMessage = () => {
    if (!currentUserProfile) {
      router.push('/login')
      return
    }
    router.push(`/messages?with=${mentorId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    )
  }

  if (!mentor || !mentor.mentorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">Mentor not found</p>
            <Link href="/mentors">
              <Button>Back to Directory</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = mentor.mentorProfile
  const displayName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || mentor.displayName || 'Mentor'
  const location = profile.virtualOnly 
    ? 'Virtual Only' 
    : `${mentor.location?.city || ''}${mentor.location?.city && mentor.location?.state ? ', ' : ''}${mentor.location?.state || ''}${mentor.location?.state && mentor.location?.country ? ', ' : ''}${mentor.location?.country || ''}`

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/mentors">
            <Button variant="outline">Back to Directory</Button>
          </Link>
        </div>

        {/* Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {displayName}
                  {profile.acceptsNewMentees && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">Mentor</Badge>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Bio */}
              {profile.bio && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}

              {/* Specialties */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map(specialty => (
                    <Badge key={specialty} className="bg-aviation-sky text-white">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience & Certifications */}
              <div className="grid md:grid-cols-2 gap-4">
                {profile.experienceYears && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-aviation-gold" />
                    <span className="text-gray-700">
                      {profile.experienceYears} years of experience
                    </span>
                  </div>
                )}
                
                {profile.languages && profile.languages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-aviation-navy" />
                    <span className="text-gray-700">
                      Speaks: {profile.languages.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Certifications */}
              {profile.certifications && profile.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map(cert => (
                      <Badge key={cert} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Availability
                </h3>
                {profile.availability && profile.availability.length > 0 ? (
                  <div className="space-y-2">
                    {profile.availability.map((slot, idx) => (
                      <div key={idx} className="text-gray-700">
                        <span className="font-medium">{days[slot.dayOfWeek]}</span>: {slot.startTime} - {slot.endTime}
                        {profile.availabilityTimezone && ` (${profile.availabilityTimezone})`}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Contact mentor for availability</p>
                )}
              </div>

              {/* Age Range & Preferences */}
              {(profile.preferredAgeRanges && profile.preferredAgeRanges.length > 0) && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Preferred Age Ranges</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredAgeRanges.map(range => (
                      <Badge key={range} variant="secondary">
                        {range} years
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Type */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Session Type</h3>
                <p className="text-gray-700">
                  {profile.virtualOnly ? 'Virtual sessions only' : 'Virtual and in-person sessions'}
                </p>
                {profile.inPersonRegions && profile.inPersonRegions.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    In-person available in: {profile.inPersonRegions.join(', ')}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="pt-4 border-t">
                {profile.acceptsNewMentees ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">
                      Currently accepting new mentees
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      Not currently accepting new mentees
                    </span>
                  </div>
                )}
                {profile.maxMentees && profile.currentMenteeCount !== undefined && (
                  <p className="text-sm text-gray-600 mt-1">
                    Current mentees: {profile.currentMenteeCount} / {profile.maxMentees}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          {currentUserProfile?.role === 'student' && (
            <Button 
              className="w-full bg-aviation-navy hover:bg-aviation-navy/90 flex items-center justify-center gap-2"
              onClick={handleRequestSession}
              disabled={!profile.acceptsNewMentees}
            >
              <Calendar className="h-5 w-5" />
              Request Mentorship Session
            </Button>
          )}
          
          {currentUserProfile && (
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleSendMessage}
            >
              <MessageSquare className="h-5 w-5" />
              Send Message
            </Button>
          )}

          {!currentUserProfile && (
            <Card className="md:col-span-2">
              <CardContent className="py-6 text-center">
                <p className="text-gray-600 mb-4">Sign in to connect with this mentor</p>
                <Link href="/login">
                  <Button className="bg-aviation-navy hover:bg-aviation-navy/90">
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
