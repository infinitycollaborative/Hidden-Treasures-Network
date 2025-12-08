"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, Globe, Award, TrendingUp, Target, BookOpen } from "lucide-react"

export default function ImpactPage() {
  // Sample data - in production, fetch from Firestore
  const monthlyImpact = [
    { month: "Jan", students: 1200, mentors: 45, organizations: 12 },
    { month: "Feb", students: 1800, mentors: 58, organizations: 15 },
    { month: "Mar", students: 2400, mentors: 72, organizations: 18 },
    { month: "Apr", students: 3100, mentors: 89, organizations: 22 },
    { month: "May", students: 4200, mentors: 105, organizations: 28 },
    { month: "Jun", students: 5500, mentors: 134, organizations: 35 },
  ]

  const programDistribution = [
    { name: "Aviation", value: 45, color: "#0EA5E9" },
    { name: "STEM", value: 35, color: "#F59E0B" },
    { name: "Entrepreneurship", value: 20, color: "#10B981" },
  ]

  const regionalData = [
    { region: "North America", students: 8500, organizations: 45 },
    { region: "Europe", students: 4200, organizations: 28 },
    { region: "Asia", students: 6800, organizations: 35 },
    { region: "South America", students: 2100, organizations: 15 },
    { region: "Africa", students: 3400, organizations: 22 },
    { region: "Oceania", students: 1200, organizations: 8 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Impact Dashboard
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Track our collective progress toward impacting one million lives by 2030.
            Real-time metrics showcase the power of our unified network.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-aviation-sky to-blue-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-blue-100">Total Students Impacted</CardDescription>
                  <CardTitle className="text-4xl font-bold mt-2">26,200</CardTitle>
                </div>
                <Users className="h-12 w-12 opacity-80" />
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-aviation-gold to-orange-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-orange-100">Network Organizations</CardDescription>
                  <CardTitle className="text-4xl font-bold mt-2">153</CardTitle>
                </div>
                <Globe className="h-12 w-12 opacity-80" />
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-green-100">Active Mentors</CardDescription>
                  <CardTitle className="text-4xl font-bold mt-2">503</CardTitle>
                </div>
                <Award className="h-12 w-12 opacity-80" />
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-purple-100">Progress to 1M Goal</CardDescription>
                  <CardTitle className="text-4xl font-bold mt-2">2.62%</CardTitle>
                </div>
                <Target className="h-12 w-12 opacity-80" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Monthly Growth Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-aviation-sky" />
                Monthly Growth Trends
              </CardTitle>
              <CardDescription>Students, mentors, and organizations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#0EA5E9" strokeWidth={2} />
                  <Line type="monotone" dataKey="mentors" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="organizations" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-aviation-sky" />
                Program Distribution
              </CardTitle>
              <CardDescription>Breakdown by program type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={programDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {programDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Regional Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-aviation-sky" />
              Regional Impact
            </CardTitle>
            <CardDescription>Students impacted and organizations by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#0EA5E9" />
                <Bar dataKey="organizations" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mission Progress */}
        <Card className="mt-8 bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Mission: Impact 1 Million Lives by 2030</CardTitle>
            <div className="w-full bg-blue-800 rounded-full h-8 mb-4">
              <div
                className="bg-aviation-gold h-8 rounded-full flex items-center justify-center font-bold text-aviation-navy"
                style={{ width: "2.62%" }}
              >
                2.62%
              </div>
            </div>
            <p className="text-lg text-gray-300">
              26,200 of 1,000,000 lives impacted
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Together, we're building momentum. Every student, mentor, and organization makes a difference.
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
