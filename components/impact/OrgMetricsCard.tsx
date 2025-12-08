import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OrgMetricsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  accent?: 'sky' | 'navy' | 'gold' | 'green'
}

const accentClass = {
  sky: 'text-aviation-sky',
  navy: 'text-aviation-navy',
  gold: 'text-aviation-gold',
  green: 'text-green-600',
}

export function OrgMetricsCard({ title, value, description, icon, accent = 'navy' }: OrgMetricsCardProps) {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-sm text-slate-600 flex items-center gap-2">
          {icon}
          {title}
        </CardDescription>
        <span className="w-2 h-2 rounded-full bg-aviation-sky" aria-hidden />
      </CardHeader>
      <CardContent>
        <CardTitle className={`text-3xl font-heading ${accentClass[accent]}`}>{value}</CardTitle>
        {description && <p className="text-sm text-slate-500 mt-2">{description}</p>}
      </CardContent>
    </Card>
  )
}
