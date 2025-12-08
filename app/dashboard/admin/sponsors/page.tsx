'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  Settings,
  DollarSign,
  Download,
  Mail
} from 'lucide-react'
import {
  getAllSponsors,
  getAllSponsorApplications,
  updateSponsorApplication,
  approveSponsorApplication,
  updateSponsor,
  getSponsorTier,
} from '@/lib/db-sponsors'
import { getAllDonations } from '@/lib/db-donations'
import type { Sponsor, SponsorApplication } from '@/types/sponsor'
import type { Donation } from '@/types/donation'

export default function AdminSponsorsPage() {
  const [activeTab, setActiveTab] = useState('applications')
  const [applications, setApplications] = useState<SponsorApplication[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [allApplications, allSponsors, allDonations] = await Promise.all([
        getAllSponsorApplications(),
        getAllSponsors(),
        getAllDonations(500),
      ])

      setApplications(allApplications)
      setSponsors(allSponsors)
      setDonations(allDonations)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveApplication = async (applicationId: string) => {
    if (!confirm('Approve this sponsorship application?')) return

    try {
      await approveSponsorApplication(applicationId, 'admin') // Replace with actual admin user ID
      alert('Application approved successfully!')
      loadData()
    } catch (error) {
      console.error('Error approving application:', error)
      alert('Failed to approve application')
    }
  }

  const handleRejectApplication = async (applicationId: string) => {
    const reason = prompt('Enter rejection reason (optional):')
    if (reason === null) return

    try {
      await updateSponsorApplication(applicationId, {
        status: 'rejected',
        reviewedBy: 'admin',
        reviewNotes: reason,
      })
      alert('Application rejected')
      loadData()
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('Failed to reject application')
    }
  }

  const handleUpdateSponsorStatus = async (sponsorId: string, status: Sponsor['status']) => {
    try {
      await updateSponsor(sponsorId, { status })
      loadData()
    } catch (error) {
      console.error('Error updating sponsor status:', error)
    }
  }

  const handleTogglePublished = async (sponsorId: string, isPublished: boolean) => {
    try {
      await updateSponsor(sponsorId, { isPublished })
      loadData()
    } catch (error) {
      console.error('Error toggling published status:', error)
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredSponsors = sponsors.filter((sponsor) => {
    const matchesSearch =
      sponsor.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsor.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sponsor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.metadata?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const totalDonations = donations
    .filter((d) => d.status === 'succeeded')
    .reduce((sum, d) => sum + d.amount, 0)

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-aviation-navy">Sponsor Management</h1>
            <p className="text-gray-600 mt-2">Manage sponsor applications, active sponsors, and donations</p>
          </div>

          <Link href="/dashboard/admin/sponsors/tiers">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Manage Tiers
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Applications</CardDescription>
              <CardTitle className="text-3xl text-orange-600">
                {applications.filter((a) => a.status === 'pending').length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Sponsors</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {sponsors.filter((s) => s.status === 'active').length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Donations</CardDescription>
              <CardTitle className="text-3xl text-aviation-sky">
                {donations.filter((d) => d.status === 'succeeded').length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Raised</CardDescription>
              <CardTitle className="text-3xl text-aviation-gold">
                ${(totalDonations / 100).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">
              Applications ({applications.filter((a) => a.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="sponsors">Sponsors ({sponsors.length})</TabsTrigger>
            <TabsTrigger value="donations">Donations ({donations.length})</TabsTrigger>
          </TabsList>

          {/* Search and Filter */}
          <div className="flex gap-4 my-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Tab */}
          <TabsContent value="applications">
            {filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No applications found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {app.orgName}
                            <Badge
                              variant={
                                app.status === 'approved'
                                  ? 'default'
                                  : app.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {app.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            <div className="space-y-1">
                              <div>Contact: {app.contactName} ({app.contactEmail})</div>
                              {app.contactPhone && <div>Phone: {app.contactPhone}</div>}
                              {app.website && (
                                <div>
                                  Website:{' '}
                                  <a
                                    href={app.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-aviation-sky hover:underline"
                                  >
                                    {app.website}
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardDescription>
                        </div>

                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveApplication(app.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectApplication(app.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {app.region && (
                          <div>
                            <span className="font-medium">Region:</span> {app.region}
                          </div>
                        )}
                        {app.programSupport && (
                          <div>
                            <span className="font-medium">Programs:</span> {app.programSupport}
                          </div>
                        )}
                        {app.message && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Message:</span>
                            <p className="mt-1 text-gray-600">{app.message}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors">
            {filteredSponsors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No sponsors found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSponsors.map((sponsor) => (
                  <Card key={sponsor.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {sponsor.orgName}
                            <Badge
                              variant={
                                sponsor.status === 'active'
                                  ? 'default'
                                  : sponsor.status === 'inactive'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {sponsor.status}
                            </Badge>
                            {sponsor.isPublished && <Badge variant="outline">Published</Badge>}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {sponsor.contactName} • {sponsor.contactEmail}
                          </CardDescription>
                        </div>

                        <div className="flex gap-2">
                          <Select
                            value={sponsor.status}
                            onValueChange={(value) =>
                              handleUpdateSponsorStatus(sponsor.id, value as Sponsor['status'])
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            onClick={() => handleTogglePublished(sponsor.id, !sponsor.isPublished)}
                            size="sm"
                            variant={sponsor.isPublished ? 'secondary' : 'default'}
                          >
                            {sponsor.isPublished ? 'Unpublish' : 'Publish'}
                          </Button>

                          <Link href={`/sponsors/${sponsor.id}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total Contributions:</span>
                          <div className="text-xl font-bold text-aviation-gold mt-1">
                            ${(sponsor.totalContributions / 100).toLocaleString()}
                          </div>
                        </div>
                        {sponsor.region && (
                          <div>
                            <span className="font-medium">Region:</span>
                            <div className="mt-1">{sponsor.region}</div>
                          </div>
                        )}
                        {sponsor.website && (
                          <div>
                            <span className="font-medium">Website:</span>
                            <div className="mt-1">
                              <a
                                href={sponsor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-aviation-sky hover:underline"
                              >
                                Visit
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations">
            {filteredDonations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No donations found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDonations.map((donation) => (
                  <Card key={donation.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            ${(donation.amount / 100).toFixed(2)}
                            <Badge
                              variant={
                                donation.status === 'succeeded'
                                  ? 'default'
                                  : donation.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {donation.status}
                            </Badge>
                            <Badge variant="outline">{donation.type}</Badge>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {donation.metadata?.name || 'Anonymous'} •{' '}
                            {donation.metadata?.email || 'No email'}
                          </CardDescription>
                        </div>

                        <div className="text-sm text-gray-600">
                          {new Date((donation.createdAt as any).seconds * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    {donation.sponsorTier && (
                      <CardContent>
                        <div className="text-sm">
                          <span className="font-medium">Sponsor Tier:</span> {donation.sponsorTier}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
