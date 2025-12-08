'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { EventForm, EventFormValues } from '@/components/events/EventForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteEvent, getEventsByOrganizer, createEvent, updateEvent } from '@/lib/db-events'
import { uploadResourceFile } from '@/lib/storage'
import { useAuth } from '@/hooks/use-auth'
import { Event } from '@/types/event'

export default function OrganizationEventsPage() {
  const { user, role } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [editing, setEditing] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role && role !== 'organization' && role !== 'admin') {
      router.push('/login')
    }
  }, [role, router])

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      const data = await getEventsByOrganizer(user.uid)
      setEvents(data)
    }
    load()
  }, [user])

  const handleSubmit = async (values: EventFormValues, files: File[]) => {
    setLoading(true)
    try {
      const basePayload = {
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
        organizerId: user?.uid || 'org',
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
        await updateEvent(editing.id, { ...basePayload, imageUrls })
      } else {
        await createEvent({
          ...basePayload,
          imageUrls,
          registeredCount: 0,
          volunteerCount: 0,
        })
      }

      if (user?.uid) {
        const refreshed = await getEventsByOrganizer(user.uid)
        setEvents(refreshed)
      }
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
        <p className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Organization</p>
        <h1 className="text-3xl font-bold text-aviation-navy">Manage your events</h1>
        <p className="text-gray-600">Create Discovery Flights, workshops, and community events for your organization.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit event' : 'Create event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm defaultValues={editing || undefined} onSubmit={handleSubmit} submitting={loading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-t">
                  <td className="py-2 font-medium">{ev.title}</td>
                  <td>{new Date(ev.startDate).toLocaleDateString()}</td>
                  <td className="capitalize">{ev.location.virtual ? 'Virtual' : `${ev.location.city}, ${ev.location.country}`}</td>
                  <td>
                    {ev.registeredCount}
                    {ev.capacity ? ` / ${ev.capacity}` : ''}
                  </td>
                  <td>{ev.registrationOpen ? 'Open' : 'Closed'}</td>
                  <td className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(ev)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(ev.id)}>
                      Delete
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                      <a href={`/dashboard/organization/events/${ev.id}/registrations`}>Registrations</a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!events.length ? <p className="text-sm text-gray-600">No events created yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}
