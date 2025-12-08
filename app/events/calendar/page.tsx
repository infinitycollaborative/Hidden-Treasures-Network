'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { EventCard } from '@/components/events/EventCard'
import { EventFilterState, EventFilters } from '@/components/events/EventFilters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEventsByMonth } from '@/lib/db-events'
import { Event } from '@/types/event'

function getMonthLabel(date: Date) {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' })
}

export default function EventsCalendarPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [filters, setFilters] = useState<EventFilterState>({})

  useEffect(() => {
    const load = async () => {
      const month = `${currentMonth.getMonth() + 1}`
      const data = await getEventsByMonth(month, currentMonth.getFullYear())
      setEvents(data)
    }
    load()
  }, [currentMonth])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filters.type && event.type !== filters.type) return false
      if (filters.audience && !event.audience?.includes(filters.audience)) return false
      if (filters.country && event.location?.country?.toLowerCase() !== filters.country.toLowerCase()) return false
      if (filters.state && event.location?.state?.toLowerCase() !== filters.state.toLowerCase()) return false
      if (filters.tourOnly && !event.isHiddenTreasuresTourStop) return false
      return true
    })
  }, [events, filters])

  const groupedByDate = useMemo(() => {
    return filteredEvents.reduce<Record<string, Event[]>>((acc, ev) => {
      const key = new Date(ev.startDate).toDateString()
      acc[key] = acc[key] ? [...acc[key], ev] : [ev]
      return acc
    }, {})
  }, [filteredEvents])

  const daysInGrid = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const startDay = start.getDay()
    const totalDays = end.getDate()
    const cells = [] as Date[]
    for (let i = 0; i < startDay; i++) {
      cells.push(new Date(start.getFullYear(), start.getMonth(), i - startDay + 1))
    }
    for (let day = 1; day <= totalDays; day++) {
      cells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
    }
    const remaining = 42 - cells.length
    for (let i = 1; i <= remaining; i++) {
      cells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i))
    }
    return cells
  }, [currentMonth])

  const nextMonth = () => {
    const next = new Date(currentMonth)
    next.setMonth(currentMonth.getMonth() + 1)
    setCurrentMonth(next)
  }

  const prevMonth = () => {
    const prev = new Date(currentMonth)
    prev.setMonth(currentMonth.getMonth() - 1)
    setCurrentMonth(prev)
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Events</p>
        <h1 className="text-4xl font-bold text-aviation-navy">Mission-ready events calendar</h1>
        <p className="text-gray-600">
          Track Discovery Flights, workshops, webinars, and Hidden Treasures Tour stops all in one place.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        <EventFilters filters={filters} onChange={setFilters} />
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft />
              </Button>
              <div className="text-lg font-semibold text-aviation-navy">{getMonthLabel(currentMonth)}</div>
              <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
                <ChevronRight />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant={view === 'calendar' ? 'default' : 'outline'} onClick={() => setView('calendar')}>
                Calendar
              </Button>
              <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>
                List
              </Button>
            </div>
          </div>

          {view === 'calendar' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Month overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 text-center text-xs uppercase text-gray-500 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-sm" aria-label="Calendar month grid">
                  {daysInGrid.map((day, idx) => {
                    const key = day.toDateString()
                    const dayEvents = groupedByDate[key] || []
                    const inMonth = day.getMonth() === currentMonth.getMonth()
                    return (
                      <div
                        key={`${key}-${idx}`}
                        className={`border rounded-md p-2 min-h-[90px] ${inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}`}
                      >
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{day.getDate()}</span>
                          {dayEvents.length ? <span className="text-aviation-sky font-semibold">● {dayEvents.length}</span> : null}
                        </div>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 3).map((ev) => (
                            <Link key={ev.id} href={`/events/${ev.id}`} className="block text-xs text-aviation-navy underline">
                              {ev.title}
                            </Link>
                          ))}
                          {dayEvents.length > 3 ? (
                            <div className="text-[11px] text-gray-500">+ {dayEvents.length - 3} more</div>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-aviation-navy">Upcoming events</h2>
              <span className="text-sm text-gray-600">{filteredEvents.length} events</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-aviation-navy text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">Bring the Hidden Treasures Tour to your city</h3>
          <p className="text-sm text-aviation-sky max-w-xl">
            Invite the flying tribute and our aviation mentors to your community. Partner with us to host a stop or
            volunteer at the next event.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/contact">Request a tour stop</Link>
        </Button>
      </div>
    </div>
  )
}
