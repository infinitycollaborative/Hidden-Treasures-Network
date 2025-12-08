"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  Settings
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // In production, fetch user data from Firestore
  const userData = {
    name: "John Doe",
    organizationName: "Sample Aviation Academy",
    role: "Organization Admin",
    studentsImpacted: 45,
    activeMentors: 8,
    resourcesShared: 12,
  }

  const recentActivity = [
    { type: "resource", title: "Added new curriculum: Introduction to Flight", time: "2 hours ago" },
    { type: "mentor", title: "New mentor joined: Sarah Johnson", time: "1 day ago" },
    { type: "student", title: "5 new students enrolled", time: "2 days ago" },
  ]

  const upcomingEvents = [
    { title: "Network Quarterly Meeting", date: "Dec 15, 2024", type: "Virtual" },
    { title: "Mentor Training Workshop", date: "Jan 10, 2025", type: "In-Person" },
    { title: "Annual Impact Summit", date: "Mar 20, 2025", type: "Virtual" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-aviation-navy mb-2">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-gray-600">
            {userData.organizationName} • {userData.role}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Students Impacted</CardDescription>
              <CardTitle className="text-3xl text-aviation-sky">
                {userData.studentsImpacted}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Mentors</CardDescription>
              <CardTitle className="text-3xl text-aviation-gold">
                {userData.activeMentors}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resources Shared</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {userData.resourcesShared}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Network Reach</CardDescription>
              <CardTitle className="text-3xl text-purple-600">
                Global
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="p-2 bg-aviation-sky/10 rounded-lg">
                        {activity.type === "resource" && <BookOpen className="h-4 w-4 text-aviation-sky" />}
                        {activity.type === "mentor" && <Users className="h-4 w-4 text-aviation-gold" />}
                        {activity.type === "student" && <Award className="h-4 w-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/resources">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Resources
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/organizations">
                      <Users className="h-4 w-4 mr-2" />
                      Find Partners
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Share Resource
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="pb-3 border-b last:border-0">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profile Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Organization Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
