'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Filter, MapPin, SlidersHorizontal } from 'lucide-react'
import NetworkMap from '@/components/map/NetworkMap'
import {
  ProgramType,
  OrganizationStatus,
  getAllOrganizations,
  getOrganizationsByFilters,
  OrganizationRecord,
} from '@/lib/db-organizations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const PROGRAM_TYPES: ProgramType[] = ['Flight', 'STEM', 'Aircraft Maintenance', 'Drone', 'Entrepreneurship']
const STATUSES: OrganizationStatus[] = ['approved', 'pending', 'active']

export default function NetworkMapPage() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [allOrganizations, setAllOrganizations] = useState<OrganizationRecord[]>([])
  const [filters, setFilters] = useState({
    country: '',
    search: '',
    programTypes: [] as ProgramType[],
    statuses: [] as OrganizationStatus[],
  })
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrgs = async () => {
      setLoading(true)
      const data = await getAllOrganizations()
      setOrganizations(data)
      setAllOrganizations(data)
      setLoading(false)
    }
    loadOrgs()
  }, [])

  const availableCountries = useMemo(() => {
    const countries = new Set<string>()
    allOrganizations.forEach((org) => {
      if (org.location?.country) countries.add(org.location.country)
    })
    return Array.from(countries)
  }, [allOrganizations])

  const handleFilterChange = async (key: string, value: any) => {
    const updated = { ...filters, [key]: value }
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

  const toggleArrayValue = async (field: 'programTypes' | 'statuses', value: any) => {
    const current = filters[field]
    const updated = current.includes(value) ? current.filter((item: any) => item !== value) : [...current, value]
    await handleFilterChange(field, updated)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase text-aviation-gold font-semibold">The Network</p>
            <h1 className="text-4xl font-heading font-bold text-aviation-navy">Global Network Map</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Explore partner organizations empowering youth through aviation and STEM.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/network/directory">
              <Button variant="outline" className="border-aviation-navy text-aviation-navy">
                Show List View
              </Button>
            </Link>
            <Button onClick={() => setShowFilters((prev) => !prev)} className="bg-aviation-navy text-white">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-4">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5 text-aviation-navy" /> Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Search</label>
                  <Input
                    placeholder="Search by name, city, keywords"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="mt-2 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">All Countries</option>
                    {availableCountries.map((country) => (
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
                          onChange={() => toggleArrayValue('programTypes', type)}
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
                          onChange={() => toggleArrayValue('statuses', status)}
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

          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-aviation-navy" /> Network Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NetworkMap organizations={organizations} heightClass="h-[520px]" />
                {loading && <p className="mt-4 text-sm text-gray-500">Loading organizations...</p>}
                {!loading && organizations.length === 0 && (
                  <p className="mt-4 text-sm text-gray-500">No organizations match the selected filters.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
