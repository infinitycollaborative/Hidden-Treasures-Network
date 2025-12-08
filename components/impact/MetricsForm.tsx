'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const metricsSchema = z.object({
  youthImpacted: z.number().min(0, 'Must be 0 or more'),
  eventsHosted: z.number().min(0, 'Must be 0 or more'),
  discoveryFlights: z.number().min(0, 'Must be 0 or more'),
  certifications: z.number().min(0, 'Must be 0 or more'),
  volunteerHours: z.number().min(0, 'Must be 0 or more'),
})

export type MetricsFormValues = z.infer<typeof metricsSchema>

interface MetricsFormProps {
  title: string
  defaultValues?: Partial<MetricsFormValues>
  onSubmit: (values: MetricsFormValues) => Promise<void> | void
  submitting?: boolean
}

export function MetricsForm({ title, defaultValues, onSubmit, submitting }: MetricsFormProps) {
  const initialValues = useMemo(
    () => ({
      youthImpacted: defaultValues?.youthImpacted ?? 0,
      eventsHosted: defaultValues?.eventsHosted ?? 0,
      discoveryFlights: defaultValues?.discoveryFlights ?? 0,
      certifications: defaultValues?.certifications ?? 0,
      volunteerHours: defaultValues?.volunteerHours ?? 0,
    }),
    [defaultValues]
  )

  const form = useForm<MetricsFormValues>({
    resolver: zodResolver(metricsSchema),
    defaultValues: initialValues,
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-aviation-navy">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="youthImpacted">Youth impacted</Label>
            <Input
              id="youthImpacted"
              type="number"
              min={0}
              {...form.register('youthImpacted', { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.youthImpacted}
            />
            {form.formState.errors.youthImpacted && (
              <p className="text-sm text-red-600">{form.formState.errors.youthImpacted.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventsHosted">Events hosted</Label>
            <Input
              id="eventsHosted"
              type="number"
              min={0}
              {...form.register('eventsHosted', { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.eventsHosted}
            />
            {form.formState.errors.eventsHosted && (
              <p className="text-sm text-red-600">{form.formState.errors.eventsHosted.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discoveryFlights">Discovery flights</Label>
            <Input
              id="discoveryFlights"
              type="number"
              min={0}
              {...form.register('discoveryFlights', { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.discoveryFlights}
            />
            {form.formState.errors.discoveryFlights && (
              <p className="text-sm text-red-600">{form.formState.errors.discoveryFlights.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications</Label>
            <Input
              id="certifications"
              type="number"
              min={0}
              {...form.register('certifications', { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.certifications}
            />
            {form.formState.errors.certifications && (
              <p className="text-sm text-red-600">{form.formState.errors.certifications.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteerHours">Volunteer hours</Label>
            <Input
              id="volunteerHours"
              type="number"
              min={0}
              {...form.register('volunteerHours', { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.volunteerHours}
            />
            {form.formState.errors.volunteerHours && (
              <p className="text-sm text-red-600">{form.formState.errors.volunteerHours.message}</p>
            )}
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <Button type="submit" className="bg-aviation-navy" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save metrics'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
