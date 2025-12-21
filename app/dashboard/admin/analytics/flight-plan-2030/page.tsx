'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Rocket,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Target,
  Award,
  ArrowLeft,
  RefreshCw,
  Share2,
  CheckCircle,
  Circle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  getFlightPlan2030Dashboard,
  getRecentSnapshots,
  formatNumber,
  formatPercentage,
} from '@/lib/db-analytics'
import type { FlightPlan2030Metrics } from '@/types'

// Milestone component
function Milestone({
  target,
  reached,
  date,
  current,
}: {
  target: number
  reached: boolean
  date?: Date
  current: number
}) {
  const progress = Math.min(100, (current / target) * 100)

  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex-shrink-0 rounded-full p-2 ${
          reached ? 'bg-green-100' : 'bg-gray-100'
        }`}
      >
        {reached ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-aviation-navy">
            {formatNumber(target)} lives
          </span>
          {reached && date && (
            <span className="text-sm text-green-600">
              Reached {date.toLocaleDateString()}
            </span>
          )}
          {!reached && (
            <span className="text-sm text-gray-500">
              {formatPercentage(progress)} complete
            </span>
          )}
        </div>
        {!reached && (
          <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-aviation-gold rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// History chart (simple bar chart)
function HistoryChart({
  data,
}: {
  data: { date: Date; livesReached: number }[]
}) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No historical data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.livesReached))
  const reversedData = [...data].reverse() // Show oldest to newest

  return (
    <div className="space-y-3">
      {reversedData.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="w-24 text-sm text-gray-500 flex-shrink-0">
            {item.date.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-aviation-navy to-aviation-gold rounded transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${(item.livesReached / maxValue) * 100}%` }}
            >
              <span className="text-xs text-white font-medium">
                {formatNumber(item.livesReached)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FlightPlan2030Page() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    current: FlightPlan2030Metrics | null
    history: { date: Date; livesReached: number }[]
    milestones: { target: number; reached: boolean; date?: Date }[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getFlightPlan2030Dashboard()
      setData(result)
    } catch (err) {
      console.error('Error fetching Flight Plan 2030 data:', err)
      setError('Failed to load Flight Plan 2030 data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/analytics">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-aviation-navy">
              Flight Plan 2030
            </h1>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-6 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/analytics">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-aviation-navy">
            Flight Plan 2030
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metrics = data?.current
  const progressPercent = metrics ? Math.min(100, metrics.percentageToGoal) : 0
  const livesReached = metrics?.livesReached || 0
  const goal = 1000000
  const remaining = goal - livesReached

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/analytics">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-aviation-navy flex items-center gap-2">
              <Rocket className="h-6 w-6 text-aviation-gold" />
              Flight Plan 2030
            </h1>
            <p className="text-gray-500">
              Reaching 1 million lives through aviation & STEM education
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Main Progress Card */}
      <Card className="bg-gradient-to-br from-aviation-navy via-aviation-navy/95 to-aviation-navy/90 text-white overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-aviation-gold/20 rounded-full mb-4">
              <Award className="h-5 w-5 text-aviation-gold" />
              <span className="text-aviation-gold font-medium">
                Honoring the Tuskegee Airmen Legacy
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-2">
              {formatNumber(livesReached)}
            </h2>
            <p className="text-xl text-white/70">lives reached so far</p>
          </div>

          {/* Large progress bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress to Goal</span>
              <span>{formatPercentage(progressPercent)}</span>
            </div>
            <div className="h-8 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-aviation-gold to-yellow-400 rounded-full transition-all duration-1000 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-sm mt-2 text-white/60">
              <span>0</span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                1,000,000
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <p className="text-3xl font-bold">{formatNumber(remaining)}</p>
              <p className="text-sm text-white/70">Lives Remaining</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <p className="text-3xl font-bold">
                {metrics?.monthlyGrowthRate
                  ? `${metrics.monthlyGrowthRate > 0 ? '+' : ''}${formatPercentage(
                      metrics.monthlyGrowthRate
                    )}`
                  : 'N/A'}
              </p>
              <p className="text-sm text-white/70">Monthly Growth</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <p className="text-3xl font-bold">
                {metrics?.yearlyTarget ? formatNumber(metrics.yearlyTarget) : 'N/A'}
              </p>
              <p className="text-sm text-white/70">Yearly Target</p>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <p className="text-3xl font-bold">
                {metrics?.projectedCompletion
                  ? metrics.projectedCompletion.toDate().getFullYear()
                  : '2030'}
              </p>
              <p className="text-sm text-white/70">Projected Year</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-aviation-gold" />
              Milestones
            </CardTitle>
            <CardDescription>Key targets on the path to 1 million</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.milestones.map((milestone, index) => (
                <Milestone
                  key={index}
                  target={milestone.target}
                  reached={milestone.reached}
                  date={milestone.date}
                  current={livesReached}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historical Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-aviation-gold" />
              Historical Progress
            </CardTitle>
            <CardDescription>Monthly growth over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <HistoryChart data={data?.history || []} />
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Why This Matters</CardTitle>
          <CardDescription>
            The Flight Plan 2030 initiative honors the legacy of the Tuskegee Airmen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6 bg-aviation-navy/5 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-aviation-navy/10 mb-4">
                <Users className="h-6 w-6 text-aviation-navy" />
              </div>
              <h3 className="font-semibold text-aviation-navy mb-2">
                Empower Youth
              </h3>
              <p className="text-sm text-gray-600">
                Providing aviation and STEM education to underserved communities
              </p>
            </div>
            <div className="text-center p-6 bg-aviation-navy/5 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-aviation-navy/10 mb-4">
                <Award className="h-6 w-6 text-aviation-navy" />
              </div>
              <h3 className="font-semibold text-aviation-navy mb-2">
                Honor Legacy
              </h3>
              <p className="text-sm text-gray-600">
                Continuing the pioneering spirit of the Tuskegee Airmen
              </p>
            </div>
            <div className="text-center p-6 bg-aviation-navy/5 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-aviation-navy/10 mb-4">
                <Rocket className="h-6 w-6 text-aviation-navy" />
              </div>
              <h3 className="font-semibold text-aviation-navy mb-2">
                Launch Careers
              </h3>
              <p className="text-sm text-gray-600">
                Creating pathways to careers in aviation and aerospace
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="border-aviation-gold/50 bg-aviation-gold/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-aviation-navy text-lg">
                Help Us Reach 1 Million Lives
              </h3>
              <p className="text-gray-600">
                Partner with us to expand aviation and STEM education
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Learn More</Button>
              <Button className="bg-aviation-navy hover:bg-aviation-navy/90">
                Become a Partner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
