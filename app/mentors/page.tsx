'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { getFirebaseDb } from '@/lib/firebase'
import { UserProfile } from '@/types/user'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MapPin, Languages, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function MentorsPage() {
  const [mentors, setMentors] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')

  useEffect(() => {
    fetchMentors()
  }, [])

  async function fetchMentors() {
    const db = getFirebaseDb()
    if (!db) {
      setLoading(false)
      return
    }

    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'mentor')
      )
      
      const snapshot = await getDocs(q)
      const mentorList: UserProfile[] = []
      
      snapshot.forEach(doc => {
        mentorList.push({ uid: doc.id, ...doc.data() } as UserProfile)
      })
      
      setMentors(mentorList)
    } catch (error) {
      console.error('Error fetching mentors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const profile = mentor.mentorProfile
    if (!profile) return false

    // Search filter
    const searchMatch = searchTerm === '' || 
      `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchTerm.toLowerCase())

    // Specialty filter
    const specialtyMatch = specialtyFilter === '' || 
      profile.specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase()))

    // Location filter
    const locationMatch = locationFilter === '' ||
      (profile.virtualOnly && locationFilter.toLowerCase() === 'virtual') ||
      mentor.location?.state?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      mentor.location?.country?.toLowerCase().includes(locationFilter.toLowerCase())

    return searchMatch && specialtyMatch && locationMatch
  })

  const allSpecialties = Array.from(
    new Set(mentors.flatMap(m => m.mentorProfile?.specialties || []))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-2">
            Mentor Directory
          </h1>
          <p className="text-gray-600">
            Connect with experienced mentors in aviation and STEM
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <Input
                  type="text"
                  placeholder="Search by name or bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-gray-300"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {allSpecialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="State, country, or 'virtual'"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSpecialtyFilter('')
                  setLocationFilter('')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mentor Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => {
            const profile = mentor.mentorProfile
            if (!profile) return null

            const displayName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || mentor.displayName || 'Mentor'
            const location = profile.virtualOnly 
              ? 'Virtual Only' 
              : `${mentor.location?.city || ''}${mentor.location?.city && mentor.location?.state ? ', ' : ''}${mentor.location?.state || mentor.location?.country || 'Location not specified'}`

            return (
              <Card key={mentor.uid} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{displayName}</span>
                    {profile.acceptsNewMentees && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
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
                            +{profile.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    {profile.languages && profile.languages.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Languages className="h-4 w-4" />
                        <span>{profile.languages.join(', ')}</span>
                      </div>
                    )}

                    {/* Experience */}
                    {profile.experienceYears && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4" />
                        <span>{profile.experienceYears} years experience</span>
                      </div>
                    )}

                    {/* Status */}
                    <div className="pt-2">
                      {profile.acceptsNewMentees ? (
                        <p className="text-sm text-green-600 font-medium">
                          Accepting new mentees
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Not accepting new mentees
                        </p>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <Link href={`/mentors/${mentor.uid}`}>
                      <Button className="w-full mt-4 bg-aviation-navy hover:bg-aviation-navy/90">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredMentors.length === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No mentors found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('')
                  setSpecialtyFilter('')
                  setLocationFilter('')
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
