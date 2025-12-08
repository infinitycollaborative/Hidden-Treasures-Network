'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResourceCard } from '@/components/resources/ResourceCard'
import {
  getResourceById,
  getResources,
  incrementResourceDownload,
  incrementResourceView,
} from '@/lib/db-resources'
import { Resource } from '@/types/resource'

export default function ResourceDetailPage() {
  const params = useParams()
  const resourceId = params?.resourceId as string

  const [resource, setResource] = useState<Resource | null>(null)
  const [related, setRelated] = useState<Resource[]>([])

  useEffect(() => {
    if (!resourceId) return
    const load = async () => {
      const data = await getResourceById(resourceId)
      if (data) {
        setResource(data)
        await incrementResourceView(resourceId)
        const siblings = await getResources({ category: data.category })
        setRelated(siblings.filter((item) => item.id !== resourceId).slice(0, 4))
      }
    }
    load()
  }, [resourceId])

  const handleDownload = async () => {
    if (!resource) return
    await incrementResourceDownload(resource.id)
    if (resource.fileType === 'link') {
      window.open(resource.fileUrl, '_blank')
    } else {
      const anchor = document.createElement('a')
      anchor.href = resource.fileUrl
      anchor.download = resource.title
      anchor.target = '_blank'
      anchor.rel = 'noopener noreferrer'
      anchor.click()
    }
  }

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <p className="text-gray-600">Loading resource...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="uppercase tracking-wide">
              {resource.category}
            </Badge>
            {resource.audience.map((aud) => (
              <Badge key={aud} variant="outline" className="capitalize">
                {aud}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-aviation-navy">{resource.title}</h1>
          <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
            {resource.difficulty ? <span>Difficulty: {resource.difficulty}</span> : null}
            {resource.durationMinutes ? <span>Duration: {resource.durationMinutes} min</span> : null}
            {resource.uploadedByName ? <span>Uploaded by {resource.uploadedByName}</span> : null}
            <span>Created {resource.createdAt?.toLocaleDateString?.()}</span>
          </div>
          <Button className="bg-aviation-navy" onClick={handleDownload} aria-label="Download resource">
            {resource.fileType === 'link' ? 'Open resource' : 'Download resource'}
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 whitespace-pre-line">{resource.description}</p>
            <div className="flex flex-wrap gap-2">
              {resource.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {related.length ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-aviation-navy">Related resources</h2>
              <Link href="/resources/library" className="text-aviation-sky text-sm">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((item) => (
                <ResourceCard key={item.id} resource={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
