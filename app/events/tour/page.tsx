'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Plane } from 'lucide-react'

import { EventCard } from '@/components/events/EventCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getUpcomingEvents } from '@/lib/db-events'
import { Event } from '@/types/event'

export default function HiddenTreasuresTourPage() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await getUpcomingEvents({ isHiddenTreasuresTourStop: true })
      setEvents(data)
    }
    load()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <div className="bg-gradient-to-r from-aviation-navy to-aviation-sky text-white rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3 text-sm uppercase tracking-wide">
          <Plane />
          <span>Hidden Treasures Tour</span>
        </div>
        <h1 className="text-4xl font-bold">The Flying Tribute’s next stops</h1>
        <p className="text-white/80 max-w-2xl">
          Follow the Hidden Treasures Tour as it honors aviators of color and brings hands-on aviation inspiration to
          communities worldwide.
        </p>
        <Button asChild variant="secondary">
          <Link href="/events/calendar">View full calendar</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-aviation-navy">Upcoming tour stops</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              Curated for tour-tagged events
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {events.length === 0 ? (
              <p className="text-sm text-gray-600">Tour schedule is being finalized. Check back soon!</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
