'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Award, Trophy, Star, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUserBadges, getUserBadgeStats, getActiveBadges } from '@/lib/db-gamification'
import { BadgeCard } from '@/components/gamification'
import type { UserBadge, BadgeDefinition, BadgeCategory, BadgeTier } from '@/types'

const categoryLabels: Record<BadgeCategory, string> = {
  tuskegee_tribute: 'Tuskegee Tribute',
  hidden_treasures: 'Hidden Treasures',
  flight_milestones: 'Flight Milestones',
  community: 'Community',
  mentorship: 'Mentorship',
  education: 'Education',
  leadership: 'Leadership',
  innovation: 'Innovation',
  special: 'Special',
}

export default function StudentBadgesPage() {
  const { profile, loading } = useAuth()
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([])
  const [availableBadges, setAvailableBadges] = useState<BadgeDefinition[]>([])
  const [badgeStats, setBadgeStats] = useState<{
    total: number
    byCategory: Partial<Record<BadgeCategory, number>>
    byTier: Partial<Record<BadgeTier, number>>
  }>({ total: 0, byCategory: {}, byTier: {} })
  const [loadingBadges, setLoadingBadges] = useState(true)
  const [activeTab, setActiveTab] = useState('earned')

  useEffect(() => {
    async function loadBadges() {
      if (!profile?.uid) return

      try {
        const [earned, stats, allBadges] = await Promise.all([
          getUserBadges(profile.uid),
          getUserBadgeStats(profile.uid),
          getActiveBadges(),
        ])

        setEarnedBadges(earned)
        setBadgeStats(stats)

        // Filter out badges the user has already earned
        const earnedBadgeIds = new Set(earned.map((b) => b.badgeId))
        const notEarned = allBadges.filter((b) => !earnedBadgeIds.has(b.id))
        setAvailableBadges(notEarned)
      } catch (error) {
        console.error('Error loading badges:', error)
      } finally {
        setLoadingBadges(false)
      }
    }

    loadBadges()
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
              <Award className="h-8 w-8 text-yellow-500" />
              My Badges
            </h1>
            <p className="text-gray-600 mt-1">Collect badges by completing activities and reaching milestones</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Earned</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{badgeStats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Available</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{availableBadges.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gold Tier</CardDescription>
              <CardTitle className="text-3xl text-amber-500">{badgeStats.byTier?.gold || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Platinum Tier</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{badgeStats.byTier?.platinum || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Badges Tabs */}
        <Tabs defaultValue="earned" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="earned" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Earned ({earnedBadges.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Available ({availableBadges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earned" className="mt-6">
            {loadingBadges ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading badges...</p>
              </div>
            ) : earnedBadges.length > 0 ? (
              <div className="space-y-8">
                {/* Group by category */}
                {Object.entries(categoryLabels).map(([category, label]) => {
                  const categoryBadges = earnedBadges.filter((b) => b.badgeCategory === category)
                  if (categoryBadges.length === 0) return null

                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-aviation-navy mb-4">{label} Badges</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categoryBadges.map((badge) => (
                          <BadgeCard key={badge.id} badge={badge} earned size="md" />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Badges Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Complete activities, attend events, and reach milestones to earn badges!
                  </p>
                  <Link href="/dashboard/student/quests">
                    <Button className="bg-aviation-sky hover:bg-aviation-sky/90">
                      Start a Quest
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            {loadingBadges ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading badges...</p>
              </div>
            ) : availableBadges.length > 0 ? (
              <div className="space-y-8">
                {/* Group by category */}
                {Object.entries(categoryLabels).map(([category, label]) => {
                  const categoryBadges = availableBadges.filter((b) => b.category === category)
                  if (categoryBadges.length === 0) return null

                  return (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-aviation-navy mb-4">{label} Badges</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {categoryBadges.map((badge) => (
                          <BadgeCard
                            key={badge.id}
                            badge={badge}
                            earned={false}
                            locked={badge.isSecret}
                            size="md"
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">All Badges Earned!</h3>
                  <p className="text-gray-600">
                    Congratulations! You've collected all available badges.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
