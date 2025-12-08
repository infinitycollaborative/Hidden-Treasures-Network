'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Calendar, MapPin, Radio, Users } from 'lucide-react'

import { EventCard } from '@/components/events/EventCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createRegistration,
  getEventById,
  getRegistrationsForEvent,
  getUpcomingEvents,
  updateRegistration,
} from '@/lib/db-events'
import { sendEventConfirmationEmail } from '@/lib/email'
import { useAuth } from '@/hooks/use-auth'
import { Event, EventRegistration } from '@/types/event'

export default function EventDetailPage() {
  const params = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [related, setRelated] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    volunteer: false,
  })
  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      const evt = await getEventById(params.eventId)
      setEvent(evt)
      if (evt) {
        const regs = await getRegistrationsForEvent(evt.id)
        setRegistrations(regs)
        const rel = await getUpcomingEvents({ type: evt.type })
        setRelated(rel.filter((r) => r.id !== evt.id).slice(0, 3))
        if (user?.displayName || user?.email) {
          setForm((prev) => ({
            ...prev,
            name: user.displayName || prev.name,
            email: user.email || prev.email,
          }))
        }
      }
      setLoading(false)
    }
    load()
  }, [params.eventId, user])

  const capacityFull = useMemo(() => {
    if (!event?.capacity) return false
    return (event.registeredCount || 0) >= event.capacity
  }, [event])

  const handleSubmit = async () => {
    if (!event || !event.registrationOpen) return
    setSubmitting(true)
    try {
      const registration = await createRegistration(event.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.volunteer ? 'volunteer' : (form.role as EventRegistration['role']),
        userId: user?.uid,
        status: capacityFull ? 'waitlisted' : 'registered',
      })
      await sendEventConfirmationEmail(registration)
      const refreshed = await getRegistrationsForEvent(event.id)
      setRegistrations(refreshed)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto py-10 px-4">Loading event...</div>
  }

  if (!event) {
    return <div className="max-w-4xl mx-auto py-10 px-4">Event not found.</div>
  }

  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : undefined

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="capitalize">
              {event.type.replace('_', ' ')}
            </Badge>
            {event.isHiddenTreasuresTourStop ? <Badge>Hidden Treasures Tour</Badge> : null}
            {event.audience.map((aud) => (
              <Badge key={aud} variant="secondary" className="capitalize">
                {aud}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-aviation-navy">{event.title}</h1>
          <p className="text-gray-700 text-lg">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Calendar className="mt-1" size={18} />
              <div>
                <div className="font-semibold">Date & time</div>
                <div>
                  {startDate.toLocaleString()} {endDate ? `to ${endDate.toLocaleString()}` : ''}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              {event.location.virtual ? <Radio className="mt-1" size={18} /> : <MapPin className="mt-1" size={18} />}
              <div>
                <div className="font-semibold">Location</div>
                {event.location.virtual ? (
                  <Link href={event.location.meetingUrl || '#'} className="text-aviation-sky underline">
                    Join virtual session
                  </Link>
                ) : (
                  <div>
                    <div>{event.location.address}</div>
                    <div>
                      {event.location.city}, {event.location.state ? `${event.location.state}, ` : ''}
                      {event.location.country}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-aviation-navy">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {!event.tags?.length ? <p className="text-sm text-gray-500">No tags added yet.</p> : null}
            </div>
          </div>
        </div>

        <Card className="self-start">
          <CardHeader>
            <CardTitle className="text-xl">Register</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Secure your spot. If the event is full, we will place you on the waitlist and confirm via email.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="w-full border rounded-md p-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="w-full border rounded-md p-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                Phone (optional)
              </label>
              <input
                id="phone"
                className="w-full border rounded-md p-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full border rounded-md p-2"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="mentor">Mentor</option>
                <option value="volunteer">Volunteer</option>
                <option value="other">Other</option>
              </select>
              {event.volunteerSignupOpen ? (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.volunteer}
                    onChange={(e) => setForm({ ...form, volunteer: e.target.checked })}
                  />
                  I want to volunteer at this event
                </label>
              ) : null}
            </div>
            {!event.registrationOpen ? (
              <p className="text-sm text-red-500">Registration for this event is closed.</p>
            ) : (
              <Button disabled={submitting || capacityFull || !event.registrationOpen} className="w-full" onClick={handleSubmit}>
                {capacityFull ? 'Join waitlist' : 'Register now'}
              </Button>
            )}
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Users size={14} /> {event.registeredCount} registered
              {event.capacity ? ` / ${event.capacity}` : ''}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-aviation-navy">Related events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {related.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
          {related.length === 0 ? <p className="text-sm text-gray-600">No related events available.</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-aviation-navy">Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Name</th>
                <th>Status</th>
                <th>Role</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="border-t">
                  <td className="py-2 font-medium">{reg.name}</td>
                  <td className="capitalize">{reg.status.replace('_', ' ')}</td>
                  <td className="capitalize">{reg.role}</td>
                  <td>{new Date(reg.createdAt).toLocaleString()}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await updateRegistration(reg.id, { status: 'checked_in' })
                        const refreshed = await getRegistrationsForEvent(event.id)
                        setRegistrations(refreshed)
                      }}
                    >
                      Check-in
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!registrations.length ? <p className="text-sm text-gray-600">No registrations yet.</p> : null}
        </div>
      </div>
    </div>
  )
}
