'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Building2, Globe2, Mail, MapPin, Phone, Rocket, ShieldCheck, Users } from 'lucide-react'
import NetworkMap from '@/components/map/NetworkMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getOrganizationById, OrganizationRecord } from '@/lib/db-organizations'

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
]

export default function OrganizationProfilePage() {
  const params = useParams<{ organizationId: string }>()
  const [organization, setOrganization] = useState<OrganizationRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.organizationId) return
    const load = async () => {
      setLoading(true)
      const data = await getOrganizationById(params.organizationId)
      setOrganization(data)
      setLoading(false)
    }
    load()
  }, [params?.organizationId])

  if (!loading && !organization)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-heading font-bold text-aviation-navy">Organization not found</h1>
          <p className="text-gray-600">We couldn\'t locate that organization profile.</p>
        </div>
      </div>
    )

  const images = organization?.media?.gallery?.length ? organization.media.gallery : PLACEHOLDER_IMAGES

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-aviation-navy text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            {organization?.media?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={organization.media.logoUrl} alt={organization.name} className="w-full h-full object-contain" />
            ) : (
              <Building2 className="h-10 w-10" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm uppercase tracking-wide text-aviation-gold">Partner Organization</p>
            <h1 className="text-4xl font-heading font-bold">{organization?.name || 'Loading...'}</h1>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                <MapPin className="h-4 w-4" />
                {organization?.location?.city || 'City'}, {organization?.location?.country || 'Country'}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 capitalize">
                <ShieldCheck className="h-4 w-4" />
                {organization?.status || 'pending'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {organization?.programTypes?.map((type) => (
                <span key={type} className="px-3 py-1 bg-white text-aviation-navy rounded-full text-xs font-semibold">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-8">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-gray-500 uppercase">
                <Rocket className="h-4 w-4 text-aviation-navy" /> Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {organization?.description || 'This organization is preparing its mission statement.'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-gray-500 uppercase">
                <Users className="h-4 w-4 text-aviation-navy" /> Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">
              {organization?.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-aviation-navy" />
                  <a href={`mailto:${organization.contactEmail}`} className="text-aviation-navy">
                    {organization.contactEmail}
                  </a>
                </div>
              )}
              {organization?.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-aviation-navy" />
                  <a href={`tel:${organization.contactPhone}`} className="text-aviation-navy">
                    {organization.contactPhone}
                  </a>
                </div>
              )}
              {organization?.website && (
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-aviation-navy" />
                  <a href={organization.website} className="text-aviation-navy" target="_blank" rel="noreferrer">
                    {organization.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-gray-500 uppercase">
                <ShieldCheck className="h-4 w-4 text-aviation-navy" /> Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-aviation-navy/10 text-aviation-navy capitalize">
                {organization?.status || 'pending'}
              </span>
              <p className="text-gray-700 text-sm">Status reflects verification and engagement level.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Impact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ImpactStat label="Students Served" value={organization?.impact?.studentsServed ?? 0} />
            <ImpactStat label="Certifications Awarded" value={organization?.impact?.certificationsAwarded ?? 0} />
            <ImpactStat label="Volunteer Hours" value={organization?.impact?.volunteerHours ?? 0} />
            <ImpactStat label="Events Hosted" value={organization?.impact?.eventsHosted ?? 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Media Gallery</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((src, idx) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={idx} src={src} alt="Gallery" className="w-full h-44 object-cover rounded-lg" />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent>
            {organization && organization.location?.coordinates ? (
              <NetworkMap organizations={[organization]} heightClass="h-80" />
            ) : (
              <p className="text-gray-600">Location coordinates are not available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ImpactStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-aviation-navy mt-1">{value.toLocaleString()}</p>
    </div>
  )
}
