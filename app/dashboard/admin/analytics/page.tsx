'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  BookOpen,
  DollarSign,
  Activity,
  Rocket,
  Target,
  FileBarChart,
  ArrowRight,
  RefreshCw,
  Download,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  getDashboardSummary,
  formatNumber,
  formatCurrency,
  formatPercentage,
  getTrendColor,
  getStatusColor,
} from '@/lib/db-analytics'
import type {
  AnalyticsSnapshot,
  MetricTrend,
  FlightPlan2030Metrics,
  TrendDirection,
  KPIStatus,
} from '@/types'

// Trend icon component
function TrendIcon({ direction }: { direction: TrendDirection }) {
  switch (direction) {
    case 'up':
      return <TrendingUp className="h-4 w-4" />
    case 'down':
      return <TrendingDown className="h-4 w-4" />
    default:
      return <Minus className="h-4 w-4" />
  }
}

// Stat card component
function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  format = 'number',
  inverseColor = false,
}: {
  title: string
  value: number
  trend?: MetricTrend
  icon: React.ElementType
  format?: 'number' | 'currency' | 'percentage'
  inverseColor?: boolean
}) {
  const formattedValue =
    format === 'currency'
      ? formatCurrency(value)
      : format === 'percentage'
      ? formatPercentage(value)
      : formatNumber(value)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-aviation-navy/10 p-2">
            <Icon className="h-5 w-5 text-aviation-navy" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm ${getTrendColor(
                trend.direction,
                inverseColor
              )}`}
            >
              <TrendIcon direction={trend.direction} />
              <span>{formatPercentage(Math.abs(trend.changePercent))}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-aviation-navy">{formattedValue}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick action card
function QuickActionCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ElementType
}) {
  return (
    <Link href={href}>
      <Card className="transition-all hover:shadow-md hover:border-aviation-gold/50 cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-aviation-gold/10 p-3">
              <Icon className="h-6 w-6 text-aviation-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-aviation-navy">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// KPI summary card
function KPISummaryCard({
  summary,
}: {
  summary: {
    total: number
    achieved: number
    onTrack: number
    atRisk: number
    critical: number
  }
}) {
  const items: { label: string; count: number; status: KPIStatus }[] = [
    { label: 'Achieved', count: summary.achieved, status: 'achieved' },
    { label: 'On Track', count: summary.onTrack, status: 'on-track' },
    { label: 'At Risk', count: summary.atRisk, status: 'at-risk' },
    { label: 'Critical', count: summary.critical, status: 'critical' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-aviation-gold" />
          KPI Status Summary
        </CardTitle>
        <CardDescription>{summary.total} total targets being tracked</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.status}
              className={`rounded-lg p-3 ${getStatusColor(item.status)}`}
            >
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-sm">{item.label}</p>
            </div>
          ))}
        </div>
        <Link href="/dashboard/admin/analytics/kpi-targets">
          <Button variant="outline" className="w-full mt-4">
            View All KPIs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Flight Plan 2030 progress card
function FlightPlan2030Card({ metrics }: { metrics: FlightPlan2030Metrics | null }) {
  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500 text-center">No Flight Plan 2030 data available</p>
        </CardContent>
      </Card>
    )
  }

  const progressPercent = Math.min(100, metrics.percentageToGoal)

  return (
    <Card className="bg-gradient-to-br from-aviation-navy to-aviation-navy/90 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Rocket className="h-5 w-5 text-aviation-gold" />
          Flight Plan 2030
        </CardTitle>
        <CardDescription className="text-white/70">
          Goal: Reach 1 million lives through aviation & STEM education
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{formatNumber(metrics.livesReached)} lives reached</span>
              <span>{formatPercentage(progressPercent)}</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-aviation-gold rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1 text-right">
              {formatNumber(1000000 - metrics.livesReached)} to go
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-sm text-white/70">Monthly Growth</p>
              <p className="text-xl font-bold">
                {metrics.monthlyGrowthRate > 0 ? '+' : ''}
                {formatPercentage(metrics.monthlyGrowthRate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Projected Completion</p>
              <p className="text-xl font-bold">
                {metrics.projectedCompletion.toDate().toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <Link href="/dashboard/admin/analytics/flight-plan-2030">
          <Button
            variant="outline"
            className="w-full mt-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            View Full Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<{
    current: AnalyticsSnapshot | null
    trends: {
      students: MetricTrend
      programs: MetricTrend
      donations: MetricTrend
      engagement: MetricTrend
    } | null
    flightPlan2030: FlightPlan2030Metrics | null
    kpiSummary: {
      total: number
      achieved: number
      onTrack: number
      atRisk: number
      critical: number
    }
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardSummary()
      setDashboardData(data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load analytics data. Please try again.')
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-aviation-navy">
              Analytics Dashboard
            </h1>
            <p className="text-gray-500">Loading analytics data...</p>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-aviation-navy">
              Analytics Dashboard
            </h1>
          </div>
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

  const snapshot = dashboardData?.current
  const trends = dashboardData?.trends

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-aviation-navy">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500">
            {snapshot
              ? `Last updated: ${snapshot.generatedAt.toDate().toLocaleString()}`
              : 'Real-time platform analytics and insights'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={snapshot?.studentMetrics.totalStudents || 0}
          trend={trends?.students}
          icon={Users}
        />
        <StatCard
          title="Active Programs"
          value={snapshot?.programMetrics.totalPrograms || 0}
          trend={trends?.programs}
          icon={BookOpen}
        />
        <StatCard
          title="Total Donations"
          value={snapshot?.financialMetrics.totalDonations || 0}
          trend={trends?.donations}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Daily Active Users"
          value={snapshot?.engagementMetrics.dailyActiveUsers || 0}
          trend={trends?.engagement}
          icon={Activity}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Flight Plan 2030 - Takes 2 columns */}
        <div className="lg:col-span-2">
          <FlightPlan2030Card metrics={dashboardData?.flightPlan2030 || null} />
        </div>

        {/* KPI Summary */}
        <div>
          <KPISummaryCard summary={dashboardData?.kpiSummary || { total: 0, achieved: 0, onTrack: 0, atRisk: 0, critical: 0 }} />
        </div>
      </div>

      {/* Additional Metrics */}
      {snapshot && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Students</p>
                  <p className="text-xl font-bold text-aviation-navy">
                    +{formatNumber(snapshot.studentMetrics.newStudents)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average XP</p>
                  <p className="text-xl font-bold text-aviation-navy">
                    {formatNumber(snapshot.studentMetrics.averageXP)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-xl font-bold text-aviation-navy">
                    {formatPercentage(snapshot.programMetrics.completionRate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">At-Risk Students</p>
                  <p className="text-xl font-bold text-aviation-navy">
                    {formatNumber(snapshot.studentMetrics.atRiskCount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-aviation-navy mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Flight Plan 2030"
            description="Track progress toward reaching 1 million lives"
            href="/dashboard/admin/analytics/flight-plan-2030"
            icon={Rocket}
          />
          <QuickActionCard
            title="KPI Targets"
            description="Monitor and manage key performance indicators"
            href="/dashboard/admin/analytics/kpi-targets"
            icon={Target}
          />
          <QuickActionCard
            title="Custom Reports"
            description="Build and export custom analytics reports"
            href="/dashboard/admin/analytics/reports"
            icon={FileBarChart}
          />
        </div>
      </div>

      {/* Geographic Distribution Preview */}
      {snapshot && (
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>
              Student distribution across {Object.keys(snapshot.geographicMetrics.stateBreakdown).length} states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-aviation-navy">
                  {formatNumber(snapshot.geographicMetrics.schoolCount)}
                </p>
                <p className="text-sm text-gray-500">Schools</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-aviation-navy">
                  {formatNumber(snapshot.geographicMetrics.districtCount)}
                </p>
                <p className="text-sm text-gray-500">Districts</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-aviation-navy">
                  {formatNumber(snapshot.geographicMetrics.urbanCount)}
                </p>
                <p className="text-sm text-gray-500">Urban Students</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-aviation-navy">
                  {formatNumber(snapshot.geographicMetrics.ruralCount)}
                </p>
                <p className="text-sm text-gray-500">Rural Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
