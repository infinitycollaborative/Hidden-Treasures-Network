'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Activity, Award, BarChart3, Clock3, GaugeCircle, Users } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { OrgMetricsCard } from '@/components/impact/OrgMetricsCard'
import { ImpactChart } from '@/components/impact/ImpactChart'
import { MetricsForm, MetricsFormValues } from '@/components/impact/MetricsForm'
import { updateOrgImpactMetrics } from '@/lib/db-metrics'

const chartColors = ['#0ea5e9', '#f59e0b', '#22c55e', '#7c3aed']

export default function OrganizationImpactDashboard() {
  const { profile } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const orgId = profile?.uid || 'org-123'

  const monthlyTrends = useMemo(
    () => [
      { month: '2024-07', youth: 240 },
      { month: '2024-08', youth: 320 },
      { month: '2024-09', youth: 410 },
      { month: '2024-10', youth: 520 },
      { month: '2024-11', youth: 640 },
      { month: '2024-12', youth: 810 },
    ],
    []
  )

  const activityBreakdown = useMemo(
    () => [
      { name: 'Discovery Flights', value: 42 },
      { name: 'Workshops', value: 28 },
      { name: 'Certifications', value: 18 },
      { name: 'Volunteer Events', value: 12 },
    ],
    []
  )

  const eventsImpact = useMemo(
    () => [
      { title: 'STEM Saturday', youth: 120 },
      { title: 'Glider Intro', youth: 90 },
      { title: 'Maintenance Lab', youth: 70 },
      { title: 'Drone Expo', youth: 65 },
    ],
    []
  )

  const handleSubmit = async (values: MetricsFormValues) => {
    setSubmitting(true)
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      await updateOrgImpactMetrics(orgId, {
        ...values,
        month: currentMonth,
      })
    } catch (error) {
      console.error('Unable to save metrics', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="uppercase tracking-[0.2em] text-sm text-aviation-navy">Partner Impact</p>
            <h1 className="text-3xl md:text-4xl font-heading text-aviation-navy">Organization Impact Dashboard</h1>
            <p className="text-slate-600 mt-2">Insights for {profile?.organizationName || 'your organization'}.</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 text-sm flex items-center gap-2">
            <GaugeCircle className="h-4 w-4 text-aviation-sky" />
            <span>Growth trend: +18% QoQ</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <OrgMetricsCard title="Youth Impacted" value="810" description="This month" icon={<Users className="h-4 w-4" />} accent="sky" />
          <OrgMetricsCard title="Youth Impacted" value="3,450" description="Lifetime" icon={<Users className="h-4 w-4" />} accent="navy" />
          <OrgMetricsCard title="Discovery Flights" value="1,120" description="To date" icon={<Activity className="h-4 w-4" />} accent="gold" />
          <OrgMetricsCard title="Certifications" value="245" description="Issued" icon={<Award className="h-4 w-4" />} accent="green" />
          <OrgMetricsCard title="Volunteer Hours" value="4,200" description="Community" icon={<Clock3 className="h-4 w-4" />} accent="sky" />
          <OrgMetricsCard title="Events Hosted" value="76" description="Completed" icon={<BarChart3 className="h-4 w-4" />} accent="navy" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ImpactChart title="Youth Impact Monthly Trends" description="Month-over-month youth reached">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} aria-label="Youth impact monthly trends">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line dataKey="youth" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ImpactChart>

          <ImpactChart title="Activity Breakdown by Type" description="Contribution by program mix">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart aria-label="Activity breakdown by type">
                <Pie data={activityBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {activityBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ImpactChart>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr] items-start">
          <ImpactChart title="Event Impact Summary" description="Youth reached per flagship event">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventsImpact} aria-label="Event impact summary">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="title" stroke="#94a3b8" tick={{ fontSize: 12 }} interval={0} angle={-12} textAnchor="end" height={70} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="youth" fill="#0c4a6e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ImpactChart>

          <MetricsForm title="Submit monthly metrics" onSubmit={handleSubmit} submitting={submitting} />
        </div>
      </div>
    </div>
  )
}
