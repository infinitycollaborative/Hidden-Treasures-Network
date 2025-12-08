'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Building2, Filter, MapPin, Search } from 'lucide-react'
import {
  ProgramType,
  OrganizationStatus,
  OrganizationRecord,
  getAllOrganizations,
  getOrganizationsByFilters,
} from '@/lib/db-organizations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const PROGRAM_TYPES: ProgramType[] = ['Flight', 'STEM', 'Aircraft Maintenance', 'Drone', 'Entrepreneurship']
const STATUSES: OrganizationStatus[] = ['approved', 'pending', 'active']

export default function DirectoryPage() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [allOrganizations, setAllOrganizations] = useState<OrganizationRecord[]>([])
  const [filters, setFilters] = useState({
    country: '',
    search: '',
    programTypes: [] as ProgramType[],
    statuses: [] as OrganizationStatus[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await getAllOrganizations()
      setOrganizations(data)
      setAllOrganizations(data)
      setLoading(false)
    }
    load()
  }, [])

  const countries = useMemo(() => {
    const options = new Set<string>()
    allOrganizations.forEach((org) => org.location?.country && options.add(org.location.country))
    return Array.from(options)
  }, [allOrganizations])

  const applyFilters = async (updated: typeof filters) => {
    setFilters(updated)
    setLoading(true)
    const results = await getOrganizationsByFilters({
      country: updated.country || undefined,
      programTypes: updated.programTypes,
      statuses: updated.statuses,
      search: updated.search,
    })
    setOrganizations(results)
    setLoading(false)
  }

  const toggleArray = async (field: 'programTypes' | 'statuses', value: any) => {
    const next = filters[field].includes(value)
      ? filters[field].filter((item: any) => item !== value)
      : [...filters[field], value]
    await applyFilters({ ...filters, [field]: next })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-3 mb-8">
          <p className="text-sm uppercase text-aviation-gold font-semibold">The Network</p>
          <h1 className="text-4xl font-heading font-bold text-aviation-navy">Partner Directory</h1>
          <p className="text-gray-600 max-w-3xl">
            Browse aviation and STEM organizations. Filter by program types, status, or search by name and location.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/network/map">
              <Button variant="outline" className="border-aviation-navy text-aviation-navy">
                <MapPin className="h-4 w-4 mr-2" /> View Map
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5 text-aviation-navy" /> Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Search</label>
                  <div className="relative mt-2">
                    <Search className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
                    <Input
                      className="pl-9"
                      placeholder="Search by name, city, keywords"
                      value={filters.search}
                      onChange={(e) => applyFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => applyFilters({ ...filters, country: e.target.value })}
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Program Types</p>
                  <div className="mt-2 space-y-2">
                    {PROGRAM_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={filters.programTypes.includes(type)}
                          onChange={() => toggleArray('programTypes', type)}
                          className="rounded border-gray-300 text-aviation-navy focus:ring-aviation-navy"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Status</p>
                  <div className="mt-2 space-y-2">
                    {STATUSES.map((status) => (
                      <label key={status} className="flex items-center gap-2 text-sm capitalize text-gray-700">
                        <input
                          type="checkbox"
                          checked={filters.statuses.includes(status)}
                          onChange={() => toggleArray('statuses', status)}
                          className="rounded border-gray-300 text-aviation-navy focus:ring-aviation-navy"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {loading && <p className="text-gray-500">Loading organizations...</p>}
            {!loading && organizations.length === 0 && (
              <p className="text-gray-500">No organizations found for the selected filters.</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {organizations.map((org) => (
                <Card key={org.id} className="h-full flex flex-col">
                  <CardHeader className="flex flex-row items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-aviation-sky/10 flex items-center justify-center overflow-hidden">
                      {org.media?.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={org.media.logoUrl} alt={org.name} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="h-6 w-6 text-aviation-navy" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">{org.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {org.location?.city ? `${org.location.city}, ` : ''}
                        {org.location?.country}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {org.programTypes?.map((type) => (
                          <span key={type} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">{org.description || 'No description provided yet.'}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {org.status || 'pending'}
                      </span>
                      <Link href={`/network/${org.id}`} className="text-aviation-navy text-sm font-semibold">
                        View Profile →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
