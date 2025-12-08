'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { EventForm, EventFormValues } from '@/components/events/EventForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createEvent,
  deleteEvent,
  getUpcomingEvents,
  updateEvent,
} from '@/lib/db-events'
import { uploadResourceFile } from '@/lib/storage'
import { useAuth } from '@/hooks/use-auth'
import { Event } from '@/types/event'

export default function AdminEventsPage() {
  const { role, user } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [editing, setEditing] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string>('')

  useEffect(() => {
    if (role && role !== 'admin') {
      router.push('/login')
    }
  }, [role, router])

  useEffect(() => {
    const load = async () => {
      const data = await getUpcomingEvents(typeFilter ? { type: typeFilter as Event['type'] } : undefined)
      setEvents(data)
    }
    load()
  }, [typeFilter])

  const totalRegistrations = useMemo(
    () => events.reduce((sum, ev) => sum + (ev.registeredCount || 0), 0),
    [events]
  )

  const handleSubmit = async (values: EventFormValues, files: File[]) => {
    setLoading(true)
    try {
      const payload = {
        title: values.title,
        description: values.description,
        type: values.type,
        audience: values.audience,
        startDate: new Date(values.startDate),
        endDate: values.endDate ? new Date(values.endDate) : undefined,
        location: values.virtual
          ? {
              address: 'Virtual',
              city: 'Online',
              country: values.country || 'Online',
              virtual: true,
              meetingUrl: values.meetingUrl,
            }
          : {
              address: values.locationAddress,
              city: values.city,
              state: values.state,
              country: values.country,
            },
        organizerId: values.isHiddenTreasuresTourStop ? 'admin' : user?.uid || 'admin',
        organizerName: user?.email || undefined,
        capacity: values.capacity,
        volunteerSlots: values.volunteerSlots,
        registrationOpen: values.registrationOpen,
        volunteerSignupOpen: values.volunteerSignupOpen,
        isHiddenTreasuresTourStop: values.isHiddenTreasuresTourStop,
        tags: values.tags || [],
      }

      let imageUrls = editing?.imageUrls || []
      if (files.length) {
        const uploads = await Promise.all(
          files.map((file) => uploadResourceFile(file, `events/${editing?.id || crypto.randomUUID()}/${file.name}`))
        )
        imageUrls = uploads
      }

      if (editing) {
        await updateEvent(editing.id, { ...payload, imageUrls })
      } else {
        await createEvent({
          ...payload,
          imageUrls,
          registeredCount: 0,
          volunteerCount: 0,
        })
      }

      const refreshed = await getUpcomingEvents(typeFilter ? { type: typeFilter as Event['type'] } : undefined)
      setEvents(refreshed)
      setEditing(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteEvent(id)
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Admin</p>
        <h1 className="text-3xl font-bold text-aviation-navy">Global events management</h1>
        <p className="text-gray-600">Curate tour stops, approve organizer events, and oversee registrations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit event' : 'Create event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm defaultValues={editing || undefined} onSubmit={handleSubmit} submitting={loading} isAdmin />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All events ({events.length})</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Total registrations: {totalRegistrations}</span>
            <select
              className="border rounded-md p-2"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All types</option>
              <option value="tour">Tour</option>
              <option value="discovery_flight">Discovery flight</option>
              <option value="workshop">Workshop</option>
              <option value="webinar">Webinar</option>
              <option value="merit_badge">Merit badge</option>
              <option value="volunteer">Volunteer</option>
              <option value="other">Other</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Title</th>
                <th>Type</th>
                <th>Organizer</th>
                <th>Date</th>
                <th>Tour</th>
                <th>Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-t">
                  <td className="py-2 font-medium">{ev.title}</td>
                  <td className="capitalize">{ev.type.replace('_', ' ')}</td>
                  <td>{ev.organizerName || 'Unknown'}</td>
                  <td>{new Date(ev.startDate).toLocaleDateString()}</td>
                  <td>{ev.isHiddenTreasuresTourStop ? 'Yes' : 'No'}</td>
                  <td>
                    {ev.registeredCount}
                    {ev.capacity ? ` / ${ev.capacity}` : ''}
                  </td>
                  <td className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing(ev)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(ev.id)}>
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={async () => {
                        await updateEvent(ev.id, { isHiddenTreasuresTourStop: !ev.isHiddenTreasuresTourStop })
                        const refreshed = await getUpcomingEvents(
                          typeFilter ? { type: typeFilter as Event['type'] } : undefined
                        )
                        setEvents(refreshed)
                      }}
                    >
                      {ev.isHiddenTreasuresTourStop ? 'Unflag Tour' : 'Flag Tour'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await updateEvent(ev.id, { registrationOpen: !ev.registrationOpen })
                        const refreshed = await getUpcomingEvents(
                          typeFilter ? { type: typeFilter as Event['type'] } : undefined
                        )
                        setEvents(refreshed)
                      }}
                    >
                      {ev.registrationOpen ? 'Close Reg' : 'Open Reg'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!events.length ? <p className="text-sm text-gray-600">No events scheduled.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}
