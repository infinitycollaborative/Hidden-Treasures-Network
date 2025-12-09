'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, Award, Calendar, Trophy, Target, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUserXP, getUserBadges, getUserActiveQuests, getLeaderboard, getUserBadgeStats } from '@/lib/db-gamification'
import { XPProgressBar, BadgeCard, QuestCard, LeaderboardComponent } from '@/components/gamification'
import type { UserXP, UserBadge, UserQuest, Leaderboard as LeaderboardType } from '@/types'

export default function StudentDashboard() {
  const { profile, loading } = useAuth()
  const [userXP, setUserXP] = useState<UserXP | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [badgeStats, setBadgeStats] = useState({ total: 0, byCategory: {}, byTier: {} })
  const [quests, setQuests] = useState<UserQuest[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardType | null>(null)
  const [loadingGamification, setLoadingGamification] = useState(true)

  useEffect(() => {
    async function loadGamificationData() {
      if (!profile?.uid) return

      try {
        const [xpData, badgesData, badgeStatsData, questsData, leaderboardData] = await Promise.all([
          getUserXP(profile.uid),
          getUserBadges(profile.uid),
          getUserBadgeStats(profile.uid),
          getUserActiveQuests(profile.uid),
          getLeaderboard('global', 'all_time'),
        ])

        setUserXP(xpData)
        setBadges(badgesData.slice(0, 3)) // Show only 3 most recent badges
        setBadgeStats(badgeStatsData)
        setQuests(questsData.slice(0, 2)) // Show only 2 active quests
        setLeaderboard(leaderboardData)
      } catch (error) {
        console.error('Error loading gamification data:', error)
      } finally {
        setLoadingGamification(false)
      }
    }

    loadGamificationData()
  }, [profile?.uid])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {profile?.displayName}!</p>
        </div>

        {/* Phase 13: XP Progress Bar */}
        {userXP && <XPProgressBar userXP={userXP} showBreakdown variant="detailed" />}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardDescription>Level</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{userXP?.level || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total XP</CardDescription>
              <CardTitle className="text-3xl text-purple-600">
                {userXP?.totalXP.toLocaleString() || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Badges Earned</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{badgeStats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Active Quests</CardDescription>
              <CardTitle className="text-3xl text-green-600">{quests.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Recent Badges
                  </CardTitle>
                  <Link href="/dashboard/student/badges">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loadingGamification ? (
                  <p className="text-gray-600">Loading badges...</p>
                ) : badges.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {badges.map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} earned size="sm" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">No badges earned yet.</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Complete activities to earn your first badge!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Quests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Active Quests
                  </CardTitle>
                  <Link href="/dashboard/student/quests">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loadingGamification ? (
                  <p className="text-gray-600">Loading quests...</p>
                ) : quests.length > 0 ? (
                  <div className="space-y-4">
                    {quests.map((quest) => (
                      <QuestCard key={quest.id} userQuest={quest} variant="in-progress" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">No active quests.</p>
                    <Link href="/dashboard/student/quests">
                      <Button className="mt-4">
                        <Zap className="w-4 h-4 mr-2" />
                        Start a Quest
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Programs & Mentors */}
            <div className="grid md:grid-cols-2 gap-6">
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
                  <Link href="/dashboard/student/mentors">
                    <Button className="mt-4 bg-aviation-navy">Find Mentors</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Mini Leaderboard */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Leaderboard
                  </CardTitle>
                  <Link href="/dashboard/student/leaderboard">
                    <Button variant="outline" size="sm">
                      Full View
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loadingGamification ? (
                  <p className="text-gray-600">Loading...</p>
                ) : leaderboard ? (
                  <div className="space-y-3">
                    {leaderboard.entries.slice(0, 5).map((entry) => (
                      <div
                        key={entry.userId}
                        className={`flex items-center gap-3 p-2 rounded ${
                          entry.userId === profile?.uid
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-bold text-lg w-6">#{entry.rank}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm">{entry.displayName}</p>
                          <p className="text-xs text-gray-600">Level {entry.level}</p>
                        </div>
                        <span className="text-xs font-semibold text-blue-600">
                          {entry.totalXP.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No leaderboard data available.</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
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
                  <Button variant="outline" className="mt-4 w-full">
                    View All Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
