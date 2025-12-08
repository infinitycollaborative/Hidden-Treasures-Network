'use client'

import Link from 'next/link'
import { FileText, Image as ImageIcon, Link as LinkIcon, PlayCircle, Presentation, Download } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Resource } from '@/types/resource'

interface ResourceCardProps {
  resource: Resource
}

function getIcon(fileType: Resource['fileType']) {
  switch (fileType) {
    case 'video':
      return PlayCircle
    case 'pptx':
      return Presentation
    case 'image':
      return ImageIcon
    case 'link':
      return LinkIcon
    default:
      return FileText
  }
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = getIcon(resource.fileType)

  return (
    <Card className="h-full flex flex-col" aria-label={`${resource.title} resource card`}>
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="bg-aviation-sky/10 text-aviation-sky p-3 rounded-lg">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{resource.category}</Badge>
            {resource.audience?.slice(0, 3).map((aud) => (
              <Badge key={aud} variant="outline" className="capitalize">
                {aud}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-xl leading-tight">{resource.title}</CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Download className="h-4 w-4" />
          <span>{resource.downloads || 0} downloads</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-gray-500">Updated {resource.updatedAt?.toLocaleDateString?.() || ''}</div>
        <Link href={`/resources/${resource.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
