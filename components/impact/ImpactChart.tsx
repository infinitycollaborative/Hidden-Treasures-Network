'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PropsWithChildren } from 'react'

interface ImpactChartProps extends PropsWithChildren {
  title: string
  description?: string
}

export function ImpactChart({ title, description, children }: ImpactChartProps) {
  return (
    <Card className="shadow-sm border border-slate-100 h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg text-aviation-navy">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="h-[320px] lg:h-[360px]">{children}</CardContent>
    </Card>
  )
}
