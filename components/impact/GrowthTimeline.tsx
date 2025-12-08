'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface GrowthTimelineProps {
  data: { month: string; youth: number }[]
}

export function GrowthTimeline({ data }: GrowthTimelineProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} aria-label="Youth impact growth over time">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#94a3b8" tickMargin={8} />
        <YAxis stroke="#94a3b8" tickMargin={8} />
        <Tooltip contentStyle={{ borderRadius: 12 }} />
        <Line
          type="monotone"
          dataKey="youth"
          stroke="#0ea5e9"
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
