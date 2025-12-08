'use client'

import { BookOpen, Download, Star, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

interface ResourceStatsStripProps {
  totalResources: number
  totalDownloads: number
  featuredCount: number
  audiencesServed?: number
}

export function ResourceStatsStrip({
  totalResources,
  totalDownloads,
  featuredCount,
  audiencesServed,
}: ResourceStatsStripProps) {
  const stats = [
    { label: 'Resources', value: totalResources, icon: BookOpen },
    { label: 'Downloads', value: totalDownloads, icon: Download },
    { label: 'Featured', value: featuredCount, icon: Star },
    { label: 'Audiences', value: audiencesServed, icon: Users },
  ].filter((stat) => stat.value !== undefined)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" role="list">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} role="listitem" className="bg-aviation-navy text-white">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <p className="text-sm text-white/80">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
