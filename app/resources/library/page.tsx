'use client'

import { useEffect, useMemo, useState } from 'react'

import { ResourceCard } from '@/components/resources/ResourceCard'
import { ResourceFilters, LibraryFilters } from '@/components/resources/ResourceFilters'
import { ResourceStatsStrip } from '@/components/resources/ResourceStatsStrip'
import { Button } from '@/components/ui/button'
import { Resource } from '@/types/resource'
import { getFeaturedResources, getResources, searchResources } from '@/lib/db-resources'

export default function ResourceLibraryPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [featured, setFeatured] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<LibraryFilters>({ search: '', sortBy: 'newest' })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { search, ...filterValues } = filters
        const data = search
          ? await searchResources(search, filterValues)
          : await getResources(filterValues)
        setResources(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filters])

  useEffect(() => {
    const loadFeatured = async () => {
      const featuredResources = await getFeaturedResources()
      setFeatured(featuredResources)
    }
    loadFeatured()
  }, [])

  const stats = useMemo(
    () => ({
      total: resources.length,
      downloads: resources.reduce((sum, r) => sum + (r.downloads || 0), 0),
      featuredCount: featured.length,
    }),
    [featured.length, resources]
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10" aria-label="Resource library">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Resource Hub</p>
          <h1 className="text-4xl font-bold text-aviation-navy">Resource Library</h1>
          <p className="text-lg text-gray-700 max-w-3xl">
            Proven tools, curriculum, and best practices for aviation and STEM programs worldwide.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button className="bg-aviation-navy">Browse all</Button>
            <a href="/login">
              <Button variant="outline">Contribute a resource</Button>
            </a>
          </div>
        </header>

        <ResourceStatsStrip
          totalResources={stats.total}
          totalDownloads={stats.downloads}
          featuredCount={stats.featuredCount}
          audiencesServed={5}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ResourceFilters value={filters} onChange={setFilters} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-aviation-navy">Resources</h2>
                <p className="text-sm text-gray-600">{loading ? 'Loading...' : `${resources.length} results`}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" aria-live="polite">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
              {!loading && resources.length === 0 ? (
                <div className="col-span-full text-center text-gray-600">No resources found.</div>
              ) : null}
            </div>

            {featured.length ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Featured</span>
                  <div className="h-px flex-1 bg-aviation-sky/30" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {featured.slice(0, 3).map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
