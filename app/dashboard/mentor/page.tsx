'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, MessageSquare, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function MentorDashboard() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-8">
          Mentor Dashboard - {profile?.displayName}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card><CardHeader><CardDescription>Active Students</CardDescription><CardTitle className="text-3xl text-aviation-sky">5</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Total Hours</CardDescription><CardTitle className="text-3xl text-aviation-gold">120</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Impact Score</CardDescription><CardTitle className="text-3xl text-green-600">95</CardTitle></CardHeader></Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Messages</CardTitle></CardHeader><CardContent><p className="text-gray-600">Connect with your students.</p><Link href="/messages"><Button className="mt-4 bg-aviation-navy">View Messages</Button></Link></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />My Students</CardTitle></CardHeader><CardContent><p className="text-gray-600">Manage your mentees and track their progress.</p><Button className="mt-4 bg-aviation-navy">View Students</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Schedule</CardTitle></CardHeader><CardContent><p className="text-gray-600">Manage your availability and sessions.</p><Button className="mt-4 bg-aviation-navy">View Schedule</Button></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
