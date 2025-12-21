'use client'

export const dynamic = 'force-dynamic'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Globe, Users, Calendar, ArrowLeft, Medal, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getLeaderboard, getUserRank, getUserXP } from '@/lib/db-gamification'
import { LeaderboardComponent } from '@/components/gamification'
import type { Leaderboard, LeaderboardType, LeaderboardPeriod, UserXP } from '@/types'

export default function StudentLeaderboardPage() {
  const { profile, loading } = useAuth()
  const [globalLeaderboard, setGlobalLeaderboard] = useState<Leaderboard | null>(null)
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<Leaderboard | null>(null)
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<Leaderboard | null>(null)
  const [userRank, setUserRank] = useState<{ rank: number; totalParticipants: number } | null>(null)
  const [userXP, setUserXP] = useState<UserXP | null>(null)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)

  useEffect(() => {
    async function loadLeaderboards() {
      if (!profile?.uid) return

      try {
        const [global, weekly, monthly, rank, xp] = await Promise.all([
          getLeaderboard('global', 'all_time'),
          getLeaderboard('global', 'weekly'),
          getLeaderboard('global', 'monthly'),
          getUserRank(profile.uid, 'global', 'all_time'),
          getUserXP(profile.uid),
        ])

        setGlobalLeaderboard(global)
        setWeeklyLeaderboard(weekly)
        setMonthlyLeaderboard(monthly)
        setUserRank(rank)
        setUserXP(xp)
      } catch (error) {
        console.error('Error loading leaderboards:', error)
      } finally {
        setLoadingLeaderboard(false)
      }
    }

    loadLeaderboards()
  }, [profile?.uid])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/student" className="inline-flex items-center text-sm text-gray-600 hover:text-aviation-navy mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-heading font-bold text-aviation-navy flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-gray-600 mt-1">See how you rank among other students in the network</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Medal className="w-4 h-4 text-yellow-600" />
                Your Rank
              </CardDescription>
              <CardTitle className="text-3xl text-yellow-700">
                {userRank ? `#${userRank.rank}` : '--'}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Total XP
              </CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {userXP?.totalXP.toLocaleString() || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-purple-500" />
                Level
              </CardDescription>
              <CardTitle className="text-3xl text-purple-600">
                {userXP?.level || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                Total Students
              </CardDescription>
              <CardTitle className="text-3xl text-gray-600">
                {userRank?.totalParticipants.toLocaleString() || '--'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="all-time">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="all-time" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              All Time
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Weekly
            </TabsTrigger>
          </TabsList>

          {/* All Time Leaderboard */}
          <TabsContent value="all-time" className="mt-6">
            {loadingLeaderboard ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Loading leaderboard...</p>
              </Card>
            ) : globalLeaderboard ? (
              <LeaderboardComponent
                leaderboard={globalLeaderboard}
                currentUserId={profile?.uid}
                showTop={50}
              />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Leaderboard Data</h3>
                  <p className="text-gray-600">
                    The leaderboard is being calculated. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Monthly Leaderboard */}
          <TabsContent value="monthly" className="mt-6">
            {loadingLeaderboard ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Loading leaderboard...</p>
              </Card>
            ) : monthlyLeaderboard ? (
              <LeaderboardComponent
                leaderboard={monthlyLeaderboard}
                currentUserId={profile?.uid}
                showTop={50}
              />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Monthly Data Yet</h3>
                  <p className="text-gray-600">
                    Start earning XP this month to appear on the monthly leaderboard!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Weekly Leaderboard */}
          <TabsContent value="weekly" className="mt-6">
            {loadingLeaderboard ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600">Loading leaderboard...</p>
              </Card>
            ) : weeklyLeaderboard ? (
              <LeaderboardComponent
                leaderboard={weeklyLeaderboard}
                currentUserId={profile?.uid}
                showTop={50}
              />
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Weekly Data Yet</h3>
                  <p className="text-gray-600">
                    Start earning XP this week to appear on the weekly leaderboard!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Tips Section */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              How to Climb the Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span className="text-gray-700">Complete quests to earn XP bonuses and badges</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span className="text-gray-700">Attend events and participate in programs</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span className="text-gray-700">Engage with mentors and complete sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
