'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getClassroomsByTeacher, getClassroomRoster } from '@/lib/db-schools'
import type { Classroom, ClassroomRoster, TeacherProfile } from '@/types'
import { Users, BookOpen, Award, Plus, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'

export default function TeacherDashboard() {
  const { profile, loading } = useAuth()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [stats, setStats] = useState({
    totalClassrooms: 0,
    totalStudents: 0,
    activeModules: 0,
    averageProgress: 0,
  })
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function loadTeacherData() {
      if (!profile?.id || profile.role !== 'teacher') return

      try {
        // Get teacher's classrooms
        const teacherClassrooms = await getClassroomsByTeacher(profile.id)
        setClassrooms(teacherClassrooms)

        // Calculate stats
        let totalStudents = 0
        let totalModules = 0

        for (const classroom of teacherClassrooms) {
          totalStudents += classroom.studentIds.length
          totalModules += classroom.moduleIds.length
        }

        setStats({
          totalClassrooms: teacherClassrooms.length,
          totalStudents,
          activeModules: totalModules,
          averageProgress: 0, // TODO: Calculate from student progress
        })
      } catch (error) {
        console.error('Error loading teacher data:', error)
      } finally {
        setLoadingData(false)
      }
    }

    loadTeacherData()
  }, [profile?.id, profile?.role])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (profile?.role !== 'teacher') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Access denied. Teacher role required.</p>
      </div>
    )
  }

  const teacherProfile = profile as TeacherProfile

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-2">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {teacherProfile.displayName}!
          </p>
          {teacherProfile.schoolId && (
            <p className="text-sm text-gray-500 mt-1">
              {teacherProfile.subjects?.join(', ')} • Grades {teacherProfile.gradeLevels?.join(', ')}
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Classrooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-3xl font-bold">{stats.totalClassrooms}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-3xl font-bold">{stats.totalStudents}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Active Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-3xl font-bold">{stats.activeModules}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-3xl font-bold">{stats.averageProgress}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Link href="/dashboard/teacher/classrooms/new">
            <Button className="bg-aviation-navy">
              <Plus className="w-4 h-4 mr-2" />
              Create Classroom
            </Button>
          </Link>
          <Link href="/dashboard/teacher/modules">
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Modules
            </Button>
          </Link>
        </div>

        {/* Classrooms List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Classrooms</h2>
            <Link href="/dashboard/teacher/classrooms">
              <Button variant="outline" size="sm">
                View All
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loadingData ? (
            <p className="text-gray-600">Loading classrooms...</p>
          ) : classrooms.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {classrooms.map((classroom) => (
                <ClassroomCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <Users className="w-16 h-16 text-gray-300 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Classrooms Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first classroom to start teaching!
                  </p>
                  <Link href="/dashboard/teacher/classrooms/new">
                    <Button className="bg-aviation-navy">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Classroom
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">
              No recent activity to display.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClassroomCard({ classroom }: { classroom: Classroom }) {
  const [studentCount, setStudentCount] = useState(0)

  useEffect(() => {
    async function loadRoster() {
      const roster = await getClassroomRoster(classroom.id)
      setStudentCount(roster.length)
    }
    loadRoster()
  }, [classroom.id])

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2">{classroom.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {classroom.subject && <span>{classroom.subject}</span>}
              {classroom.gradeLevel && <span>Grade {classroom.gradeLevel}</span>}
              <span>{classroom.academicYear}</span>
            </div>
          </div>
          <Link href={`/dashboard/teacher/classrooms/${classroom.id}`}>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{studentCount}</p>
            <p className="text-xs text-gray-600">Students</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{classroom.moduleIds.length}</p>
            <p className="text-xs text-gray-600">Modules</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {classroom.status === 'active' ? '✓' : '−'}
            </p>
            <p className="text-xs text-gray-600">Status</p>
          </div>
        </div>

        {/* Join Code */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Join Code</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-mono font-bold tracking-wider">{classroom.joinCode}</p>
            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(classroom.joinCode)}>
              Copy
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/dashboard/teacher/classrooms/${classroom.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          <Link href={`/dashboard/teacher/classrooms/${classroom.id}/roster`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Roster
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
