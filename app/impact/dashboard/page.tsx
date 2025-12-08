'use client'

import { useMemo } from 'react'
import { ArrowUpRight, Compass, Globe2, HeartPulse, Sparkles, Users, HandHeart } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import Link from 'next/link'
import { ImpactChart } from '@/components/impact/ImpactChart'
import { GrowthTimeline } from '@/components/impact/GrowthTimeline'
import { OrgMetricsCard } from '@/components/impact/OrgMetricsCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const activityColors = ['#0ea5e9', '#0f172a', '#f59e0b', '#22c55e', '#7c3aed']

export default function ImpactDashboardPage() {
  const youthTrend = useMemo(
    () => [
      { month: '2024-01', youth: 12000 },
      { month: '2024-03', youth: 18500 },
      { month: '2024-05', youth: 26000 },
      { month: '2024-07', youth: 34000 },
      { month: '2024-09', youth: 43000 },
      { month: '2024-11', youth: 52000 },
    ],
    []
  )

  const programDistribution = useMemo(
    () => [
      { name: 'Discovery Flights', value: 38 },
      { name: 'STEM Programs', value: 24 },
      { name: 'Maintenance Training', value: 14 },
      { name: 'Drone Training', value: 12 },
      { name: 'Entrepreneurship', value: 12 },
    ],
    []
  )

  const networkGrowth = useMemo(
    () => [
      { month: '2024-02', orgs: 24 },
      { month: '2024-04', orgs: 36 },
      { month: '2024-06', orgs: 48 },
      { month: '2024-08', orgs: 61 },
      { month: '2024-10', orgs: 73 },
      { month: '2024-12', orgs: 84 },
    ],
    []
  )

  const geographicReach = useMemo(
    () => [
      { region: 'North America', value: 18 },
      { region: 'Europe', value: 12 },
      { region: 'Africa', value: 9 },
      { region: 'Asia-Pacific', value: 11 },
      { region: 'Latin America', value: 7 },
    ],
    []
  )

  const stories = [
    {
      title: 'STEM Flight Camp ignites 120 new aviators',
      location: 'Seattle, USA',
      impact: 'Hands-on flight simulation and drone building with 60% first-time flyers.',
    },
    {
      title: 'Kenya girls aviation program doubles participation',
      location: 'Nairobi, Kenya',
      impact: 'Mentorship, coding labs, and discovery flights led to 45 new certifications.',
    },
    {
      title: 'Caribbean maintenance pathway launches',
      location: 'San Juan, Puerto Rico',
      impact: 'Partner airlines and volunteers delivered 600+ volunteer hours in one quarter.',
    },
  ]

  return (
    <div className="bg-gray-50 pb-16">
      <section className="gradient-hero text-white py-14 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div>
            <p className="uppercase tracking-[0.2em] text-sm text-sky-100">Flight Plan 2030</p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold">Impact Dashboard</h1>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mt-3">
              Tracking our progress toward empowering one million youth worldwide.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <OrgMetricsCard title="Total Youth Impacted" value="128,400" description="Primary value metric" icon={<Users className="h-4 w-4" />} accent="sky" />
            <OrgMetricsCard title="Discovery Flights" value="8,240" description="Hands-on aviation" icon={<Compass className="h-4 w-4" />} accent="gold" />
            <OrgMetricsCard title="Countries Reached" value="34" description="Active regions" icon={<Globe2 className="h-4 w-4" />} accent="navy" />
            <OrgMetricsCard title="Certifications Earned" value="3,120" description="Credentials issued" icon={<Sparkles className="h-4 w-4" />} accent="green" />
            <OrgMetricsCard title="Partner Organizations" value="84" description="Trusted partners" icon={<HeartPulse className="h-4 w-4" />} accent="sky" />
            <OrgMetricsCard title="Volunteer Hours" value="41,500" description="Community powered" icon={<HandHeart className="h-4 w-4" />} accent="gold" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <ImpactChart title="Youth Impact Over Time" description="Monthly trend across the global network">
            <GrowthTimeline data={youthTrend} />
          </ImpactChart>

          <ImpactChart title="Program Activity Distribution" description="Share of major program types">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart aria-label="Program activity distribution">
                <Pie data={programDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {programDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={activityColors[index % activityColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ImpactChart>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ImpactChart title="Growth of the Network" description="Active partner organizations over time">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={networkGrowth} aria-label="Growth of partner organizations">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#94a3b8" tickMargin={8} />
                <YAxis stroke="#94a3b8" tickMargin={8} />
                <Tooltip />
                <Bar dataKey="orgs" fill="#0c4a6e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ImpactChart>

          <ImpactChart title="Geographic Reach" description="Countries engaged by region">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geographicReach} layout="vertical" margin={{ left: 60 }} aria-label="Geographic reach">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="region" type="category" stroke="#94a3b8" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ImpactChart>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-12 grid gap-6 lg:grid-cols-[2fr,1fr] items-stretch">
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-aviation-navy">Network Stories</p>
                <h2 className="text-2xl font-heading text-aviation-navy">Momentum from the field</h2>
              </div>
              <ArrowUpRight className="h-5 w-5 text-aviation-sky" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <div key={story.title} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs uppercase tracking-wide text-aviation-navy">{story.location}</p>
                  <h3 className="font-heading text-lg mt-1 text-aviation-navy">{story.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">{story.impact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm gradient-sky text-white">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Join the movement</p>
            <h3 className="text-2xl font-heading">Ready to accelerate impact?</h3>
            <p className="text-white/90">
              Partner with Infinity Aero Club to deliver new pathways, fund discovery flights, and inspire future aviators.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-white text-aviation-navy hover:bg-slate-100">
                <Link href="/get-involved">Join the Network</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/support-us">Become a Sponsor</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
