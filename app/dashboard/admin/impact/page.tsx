'use client'

import { useState } from 'react'
import { BarChart, Building2, RefreshCw, Sparkles, Users } from 'lucide-react'
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { MetricsForm, MetricsFormValues } from '@/components/impact/MetricsForm'
import { ImpactChart } from '@/components/impact/ImpactChart'
import { OrgMetricsCard } from '@/components/impact/OrgMetricsCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateNetworkImpactMetrics } from '@/lib/db-metrics'
import { recalculateNetworkMetrics } from '@/lib/metrics-aggregator'

const orgSnapshot = [
  { org: 'Aero Youth Alliance', youth: 1240, flights: 220, certs: 58, events: 32, updated: '2024-11-28' },
  { org: 'SkyBridge STEM', youth: 980, flights: 180, certs: 44, events: 27, updated: '2024-11-20' },
  { org: 'Caribbean Flight Lab', youth: 720, flights: 140, certs: 33, events: 18, updated: '2024-11-12' },
]

const networkMonthly = [
  { month: '2024-08', youth: 12800 },
  { month: '2024-09', youth: 14950 },
  { month: '2024-10', youth: 16750 },
  { month: '2024-11', youth: 18620 },
  { month: '2024-12', youth: 20480 },
]

export default function AdminImpactConsole() {
  const [savingNetwork, setSavingNetwork] = useState(false)
  const [recalculating, setRecalculating] = useState(false)

  const handleNetworkSave = async (values: MetricsFormValues) => {
    setSavingNetwork(true)
    try {
      await updateNetworkImpactMetrics({
        totalYouthImpacted: values.youthImpacted,
        totalEventsHosted: values.eventsHosted,
        totalDiscoveryFlights: values.discoveryFlights,
        totalCertifications: values.certifications,
        totalVolunteers: values.volunteerHours,
        totalOrganizations: 0,
      })
    } catch (error) {
      console.error('Unable to update network metrics', error)
    } finally {
      setSavingNetwork(false)
    }
  }

  const handleRecalculate = async () => {
    setRecalculating(true)
    try {
      await recalculateNetworkMetrics()
    } catch (error) {
      console.error('Unable to recalculate metrics', error)
    } finally {
      setRecalculating(false)
    }
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="uppercase tracking-[0.2em] text-sm text-aviation-navy">Admin Tools</p>
            <h1 className="text-3xl md:text-4xl font-heading text-aviation-navy">Impact Metrics Console</h1>
            <p className="text-slate-600 mt-2">Control center for public, partner, and internal metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-aviation-navy" onClick={handleRecalculate} disabled={recalculating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {recalculating ? 'Recalculating…' : 'Recalculate Network Metrics'}
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          <OrgMetricsCard title="Network Youth Impacted" value="204,800" description="Current total" icon={<Users className="h-4 w-4" />} accent="sky" />
          <OrgMetricsCard title="Discovery Flights" value="18,200" description="Global" icon={<Sparkles className="h-4 w-4" />} accent="gold" />
          <OrgMetricsCard title="Certifications" value="7,420" description="Issued" icon={<BarChart className="h-4 w-4" />} accent="green" />
          <OrgMetricsCard title="Partner Orgs" value="84" description="Active" icon={<Building2 className="h-4 w-4" />} accent="navy" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr] items-start">
          <ImpactChart title="Monthly Network Youth Impact" description="Snapshot of youth reached each month">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={networkMonthly} aria-label="Monthly network youth impact">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="youth" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </ImpactChart>

          <MetricsForm title="Edit network KPIs" onSubmit={handleNetworkSave} submitting={savingNetwork} />
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Organization Metrics Overview</CardTitle>
            <CardDescription>Latest values submitted by partner organizations.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2">Org Name</th>
                  <th className="py-2">Youth Impacted</th>
                  <th className="py-2">Discovery Flights</th>
                  <th className="py-2">Certifications</th>
                  <th className="py-2">Events</th>
                  <th className="py-2">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgSnapshot.map((row) => (
                  <tr key={row.org} className="hover:bg-slate-50">
                    <td className="py-3 font-medium text-aviation-navy">{row.org}</td>
                    <td className="py-3">{row.youth.toLocaleString()}</td>
                    <td className="py-3">{row.flights}</td>
                    <td className="py-3">{row.certs}</td>
                    <td className="py-3">{row.events}</td>
                    <td className="py-3 text-slate-500">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
