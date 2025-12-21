'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/use-auth'
import { getFirebaseDb } from '@/lib/firebase'
import { NotificationPreferences } from '@/types'

const schema = z.object({
  email: z.boolean(),
  inApp: z.boolean(),
  eventReminders: z.boolean(),
  resourceUpdates: z.boolean(),
  mentorMessages: z.boolean(),
  systemAnnouncements: z.boolean(),
})

export default function NotificationSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const form = useForm<NotificationPreferences>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: true,
      inApp: true,
      eventReminders: true,
      resourceUpdates: true,
      mentorMessages: true,
      systemAnnouncements: true,
    },
  })

  const values = form.watch()
  const canSave = useMemo(() => Object.keys(schema.shape).length > 0, [])

  useEffect(() => {
    const loadPreferences = async () => {
      const db = getFirebaseDb()
      if (!user?.uid || !db) return
      const snapshot = await getDoc(doc(db, 'users', user.uid))
      const prefs = snapshot.data()?.notificationPreferences as NotificationPreferences | undefined
      if (prefs) {
        form.reset(prefs)
      }
    }
    loadPreferences()
  }, [user?.uid, form])

  const onSubmit = async (data: NotificationPreferences) => {
    const db = getFirebaseDb()
    if (!user?.uid || !db) return
    setLoading(true)
    setSaved(false)
    await updateDoc(doc(db, 'users', user.uid), { notificationPreferences: data })
    setSaved(true)
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <div>
        <p className="text-sm uppercase text-aviation-gold font-semibold">Settings</p>
        <h1 className="text-3xl font-bold text-aviation-navy">Notification preferences</h1>
        <p className="text-gray-600">Choose how you want to stay informed about events, resources, and announcements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Channels & topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email', label: 'Email alerts', description: 'Receive confirmation and reminder emails.' },
            { key: 'inApp', label: 'In-app notifications', description: 'Show alerts in the notification bell and inbox.' },
            { key: 'eventReminders', label: 'Event reminders', description: 'Reminders before your upcoming events.' },
            { key: 'resourceUpdates', label: 'Resource updates', description: 'Uploads, approvals, and featured resources.' },
            { key: 'mentorMessages', label: 'Messages', description: 'New mentor messages and replies.' },
            { key: 'systemAnnouncements', label: 'System announcements', description: 'Broadcasts about the network and tour.' },
          ].map((pref) => (
            <div key={pref.key} className="flex items-start justify-between gap-3 py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium text-aviation-navy">{pref.label}</p>
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
              <Switch
                checked={values[pref.key as keyof NotificationPreferences] as boolean}
                onChange={(event) =>
                  form.setValue(pref.key as keyof NotificationPreferences, event.target.checked)
                }
                aria-label={`Toggle ${pref.label}`}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            {saved ? <span className="text-sm text-green-600">Preferences saved</span> : null}
            <Button onClick={form.handleSubmit(onSubmit)} disabled={!canSave || loading}>
              Save preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
