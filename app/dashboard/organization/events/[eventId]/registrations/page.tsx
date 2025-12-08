'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  checkInRegistration,
  getEventById,
  getRegistrationsForEvent,
  updateRegistration,
} from '@/lib/db-events'
import { useAuth } from '@/hooks/use-auth'
import { Event, EventRegistration } from '@/types/event'

export default function EventRegistrationsPage() {
  const params = useParams<{ eventId: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])

  useEffect(() => {
    const load = async () => {
      const evt = await getEventById(params.eventId)
      if (!evt) return
      if (evt.organizerId !== user?.uid) {
        router.push('/login')
        return
      }
      setEvent(evt)
      const regs = await getRegistrationsForEvent(evt.id)
      setRegistrations(regs)
    }
    load()
  }, [params.eventId, router, user])

  const updateStatus = async (id: string, status: EventRegistration['status']) => {
    await updateRegistration(id, { status })
    if (event) {
      const refreshed = await getRegistrationsForEvent(event.id)
      setRegistrations(refreshed)
    }
  }

  const handleCheckIn = async (id: string) => {
    await checkInRegistration(id)
    if (event) {
      const refreshed = await getRegistrationsForEvent(event.id)
      setRegistrations(refreshed)
    }
  }

  if (!event) {
    return <div className="max-w-4xl mx-auto py-10 px-4">Loading registrations...</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Registrations</p>
        <h1 className="text-3xl font-bold text-aviation-navy">{event.title}</h1>
        <p className="text-gray-600">Manage attendee and volunteer signups. Use check-in to mark arrivals.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendees ({registrations.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="border-t">
                  <td className="py-2 font-medium">{reg.name}</td>
                  <td>{reg.email}</td>
                  <td className="capitalize">{reg.role}</td>
                  <td className="capitalize">{reg.status.replace('_', ' ')}</td>
                  <td>{new Date(reg.createdAt).toLocaleString()}</td>
                  <td className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => updateStatus(reg.id, 'registered')}>
                      Set Registered
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateStatus(reg.id, 'waitlisted')}>
                      Waitlist
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleCheckIn(reg.id)}>
                      Check-in
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!registrations.length ? <p className="text-sm text-gray-600">No registrations yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}
