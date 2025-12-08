import Link from 'next/link'
import { Calendar, MapPin, Radio, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Event } from '@/types/event'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : undefined

  return (
    <Card className="h-full" aria-label={`Event card for ${event.title}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg text-aviation-navy">{event.title}</CardTitle>
          {event.isHiddenTreasuresTourStop ? <Badge>Hidden Treasures Tour</Badge> : null}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          <span className="flex items-center gap-1"><Calendar size={14} />{startDate.toLocaleDateString()}</span>
          {event.location.virtual ? (
            <span className="flex items-center gap-1"><Radio size={14} />Virtual</span>
          ) : (
            <span className="flex items-center gap-1"><MapPin size={14} />{event.location.city}, {event.location.country}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="capitalize">{event.type.replace('_', ' ')}</Badge>
          {event.audience?.map((aud) => (
            <Badge key={aud} variant="secondary" className="capitalize">
              {aud}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
        <div className="text-sm text-gray-700 flex items-center gap-1">
          <Users size={16} /> {event.registeredCount} registered
          {event.capacity ? ` / ${event.capacity}` : ''}
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
        {endDate ? (
          <p className="text-xs text-gray-500">Runs until {endDate.toLocaleDateString()}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
