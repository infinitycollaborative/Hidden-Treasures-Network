'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, DollarSign, Users, TrendingUp, Award, Calendar, Download } from 'lucide-react'
import { getDonationsByUser, calculateUserTotalDonations } from '@/lib/db-donations'
import { getSponsorMetrics } from '@/lib/db-sponsors'
import type { Donation } from '@/types/donation'
import type { SponsorImpactMetrics } from '@/types/sponsor'

export default function SponsorDashboard() {
  const { profile } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [metrics, setMetrics] = useState<SponsorImpactMetrics | null>(null)
  const [totalDonated, setTotalDonated] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if ((profile as any)?.uid) {
      loadDashboardData()
    }
  }, [profile])

  const loadDashboardData = async () => {
    if (!(profile as any)?.uid) return

    try {
      const [userDonations, total, userMetrics] = await Promise.all([
        getDonationsByUser((profile as any).uid),
        calculateUserTotalDonations((profile as any).uid),
        getSponsorMetrics((profile as any).uid),
      ])

      setDonations(userDonations)
      setTotalDonated(total)
      setMetrics(userMetrics)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const monthlyDonations = donations.filter((d) => d.type === 'monthly' && d.status === 'succeeded')
  const oneTimeDonations = donations.filter((d) => d.type === 'one-time' && d.status === 'succeeded')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-aviation-navy">
              Welcome, {profile?.displayName}
            </h1>
            <p className="text-gray-600 mt-2">Thank you for supporting our mission</p>
          </div>

          <Link href="/donate">
            <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
              <Heart className="h-4 w-4 mr-2" />
              Make a Donation
            </Button>
          </Link>
        </div>

        {/* Contribution Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Contributed</CardDescription>
              <CardTitle className="text-3xl text-aviation-gold">
                ${(totalDonated / 100).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>All-time contributions</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Youth Reached</CardDescription>
              <CardTitle className="text-3xl text-aviation-sky">
                {metrics?.youthReached || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Students impacted</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Discovery Flights</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {metrics?.discoveryFlightsFunded || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>Flights funded</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Events Supported</CardDescription>
              <CardTitle className="text-3xl text-aviation-navy">
                {metrics?.eventsSupported || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>Community events</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="activity">
            <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="impact">Impact Report</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest contributions and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No donations yet</p>
                    <Link href="/donate">
                      <Button>Make Your First Donation</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations.slice(0, 5).map((donation) => (
                      <div
                        key={donation.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-aviation-navy">
                            ${(donation.amount / 100).toFixed(2)} Donation
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(
                              (donation.createdAt as any).seconds * 1000
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={donation.status === 'succeeded' ? 'default' : 'secondary'}
                          >
                            {donation.status}
                          </Badge>
                          <Badge variant="outline">{donation.type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-aviation-gold" />
                    Donation Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">One-Time Donations:</span>
                    <span className="font-semibold">{oneTimeDonations.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Donations:</span>
                    <span className="font-semibold">{monthlyDonations.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Donations:</span>
                    <span className="font-semibold">{donations.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-aviation-sky" />
                    Member Since
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-aviation-navy">
                    {new Date((profile?.createdAt as any)?.seconds * 1000).getFullYear()}
                  </div>
                  <p className="text-gray-600 mt-2">
                    Thank you for being a valued supporter of the Hidden Treasures Network
                  </p>
                </CardContent>
              </Card>
            </div>
            </div>
          </TabsContent>

          {/* Impact Report Tab */}
          <TabsContent value="impact">
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Impact Report</CardTitle>
                <CardDescription>
                  See the difference your contributions are making
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {metrics ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-aviation-navy mb-2">
                          Programs Funded
                        </h3>
                        <div className="text-3xl font-bold text-aviation-gold">
                          {metrics.programsFunded.length}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-aviation-navy mb-2">
                          Certifications Sponsored
                        </h3>
                        <div className="text-3xl font-bold text-green-600">
                          {metrics.certificationsSponsored}
                        </div>
                      </div>
                    </div>

                    {metrics.regionsImpacted.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-aviation-navy mb-3">
                          Regions Impacted
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {metrics.regionsImpacted.map((region, index) => (
                            <Badge key={index} variant="secondary">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Impact Report (PDF)
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Impact metrics will be available after your first contribution
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
                <CardDescription>Complete history of your contributions</CardDescription>
              </CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No donations yet</p>
                    <Link href="/donate">
                      <Button>Make Your First Donation</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-aviation-navy">
                            ${(donation.amount / 100).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(
                              (donation.createdAt as any).seconds * 1000
                            ).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={donation.status === 'succeeded' ? 'default' : 'secondary'}
                          >
                            {donation.status}
                          </Badge>
                          <Badge variant="outline">{donation.type}</Badge>
                          {donation.receiptUrl && (
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Increase Your Impact</CardTitle>
            <CardDescription className="text-gray-300">
              Consider upgrading to a sponsorship tier for additional benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sponsors/apply">
                <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                  Become a Sponsor
                </Button>
              </Link>
              <Link href="/sponsors">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn About Sponsorship
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
