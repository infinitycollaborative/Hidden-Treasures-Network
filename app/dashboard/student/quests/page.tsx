'use client'

export const dynamic = 'force-dynamic'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Target, Zap, CheckCircle2, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getUserActiveQuests, getAvailableQuests, startQuest } from '@/lib/db-gamification'
import { QuestCard } from '@/components/gamification'
import type { Quest, UserQuest } from '@/types'

export default function StudentQuestsPage() {
  const { profile, loading } = useAuth()
  const [activeQuests, setActiveQuests] = useState<UserQuest[]>([])
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([])
  const [completedQuests, setCompletedQuests] = useState<UserQuest[]>([])
  const [loadingQuests, setLoadingQuests] = useState(true)
  const [startingQuest, setStartingQuest] = useState<string | null>(null)

  useEffect(() => {
    async function loadQuests() {
      if (!profile?.uid) return

      try {
        const [active, available] = await Promise.all([
          getUserActiveQuests(profile.uid),
          getAvailableQuests(profile.uid, profile.role || 'student'),
        ])

        // Filter active quests
        const inProgress = active.filter((q) => q.status === 'in_progress')
        const completed = active.filter((q) => q.status === 'completed')

        // Remove quests user already has from available
        const activeQuestIds = new Set(active.map((q) => q.questId))
        const filteredAvailable = available.filter((q) => !activeQuestIds.has(q.id))

        setActiveQuests(inProgress)
        setCompletedQuests(completed)
        setAvailableQuests(filteredAvailable)
      } catch (error) {
        console.error('Error loading quests:', error)
      } finally {
        setLoadingQuests(false)
      }
    }

    loadQuests()
  }, [profile?.uid, profile?.role])

  const handleStartQuest = async (questId: string) => {
    if (!profile?.uid) return

    setStartingQuest(questId)
    try {
      const result = await startQuest(profile.uid, questId)
      if (result.success) {
        // Refresh quests
        const [active, available] = await Promise.all([
          getUserActiveQuests(profile.uid),
          getAvailableQuests(profile.uid, profile.role || 'student'),
        ])

        const inProgress = active.filter((q) => q.status === 'in_progress')
        const activeQuestIds = new Set(active.map((q) => q.questId))
        const filteredAvailable = available.filter((q) => !activeQuestIds.has(q.id))

        setActiveQuests(inProgress)
        setAvailableQuests(filteredAvailable)
      }
    } catch (error) {
      console.error('Error starting quest:', error)
    } finally {
      setStartingQuest(null)
    }
  }

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
              <Target className="h-8 w-8 text-blue-500" />
              Quests
            </h1>
            <p className="text-gray-600 mt-1">Complete quests to earn XP, badges, and unlock rewards</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-blue-500" />
                In Progress
              </CardDescription>
              <CardTitle className="text-3xl text-blue-600">{activeQuests.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" />
                Available
              </CardDescription>
              <CardTitle className="text-3xl text-gray-600">{availableQuests.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Completed
              </CardDescription>
              <CardTitle className="text-3xl text-green-600">{completedQuests.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quests Tabs */}
        <Tabs defaultValue="active">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Active ({activeQuests.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Available ({availableQuests.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed ({completedQuests.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Quests */}
          <TabsContent value="active" className="mt-6">
            {loadingQuests ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading quests...</p>
              </div>
            ) : activeQuests.length > 0 ? (
              <div className="space-y-4">
                {activeQuests.map((quest) => (
                  <QuestCard key={quest.id} userQuest={quest} variant="in-progress" />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Quests</h3>
                  <p className="text-gray-600 mb-4">
                    Start a quest from the Available tab to begin earning rewards!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Available Quests */}
          <TabsContent value="available" className="mt-6">
            {loadingQuests ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading quests...</p>
              </div>
            ) : availableQuests.length > 0 ? (
              <div className="space-y-4">
                {availableQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    variant="available"
                    onStart={handleStartQuest}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Available Quests</h3>
                  <p className="text-gray-600">
                    Check back later for new quests, or complete your current quests first!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Quests */}
          <TabsContent value="completed" className="mt-6">
            {loadingQuests ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading quests...</p>
              </div>
            ) : completedQuests.length > 0 ? (
              <div className="space-y-4">
                {completedQuests.map((quest) => (
                  <QuestCard key={quest.id} userQuest={quest} variant="completed" />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Completed Quests Yet</h3>
                  <p className="text-gray-600">
                    Complete quests to see them here and track your achievements!
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
