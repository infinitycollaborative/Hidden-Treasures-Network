'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GraduationCap, BookOpen, Users, Award, Calendar, TrendingUp, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function StudentDashboard() {
  const { profile, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {profile?.displayName}!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Programs Enrolled</CardDescription>
              <CardTitle className="text-3xl text-aviation-sky">3</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Hours Completed</CardDescription>
              <CardTitle className="text-3xl text-aviation-gold">24</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Achievements</CardDescription>
              <CardTitle className="text-3xl text-green-600">5</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Connect with your mentors.</p>
              <Link href="/messages">
                <Button className="mt-4 bg-aviation-navy">View Messages</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                My Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Your enrolled programs will appear here.</p>
              <Button className="mt-4 bg-aviation-navy">Browse Programs</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Mentors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Connect with your assigned mentors.</p>
              <Button className="mt-4 bg-aviation-navy">Find Mentors</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No upcoming events.</p>
              <Link href="/events">
                <Button variant="outline" className="mt-4">View All Events</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track your progress and earn badges.</p>
              <Button variant="outline" className="mt-4">View Achievements</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
