'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TagInput } from '@/components/common/TagInput'
import { EventAudience, EventType, Event } from '@/types/event'

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  type: z.enum(['tour', 'discovery_flight', 'workshop', 'webinar', 'merit_badge', 'volunteer', 'other']),
  audience: z.array(z.enum(['students', 'mentors', 'organizations', 'sponsors', 'general'])).min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  locationAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  country: z.string().min(1),
  virtual: z.boolean().optional(),
  meetingUrl: z.string().url().optional().or(z.literal('')),
  capacity: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  volunteerSlots: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  registrationOpen: z.boolean().optional(),
  volunteerSignupOpen: z.boolean().optional(),
  isHiddenTreasuresTourStop: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export type EventFormValues = z.infer<typeof schema>

interface EventFormProps {
  defaultValues?: Partial<Event>
  onSubmit: (values: EventFormValues, files: File[]) => Promise<void>
  submitting?: boolean
  isAdmin?: boolean
}

export function EventForm({ defaultValues, onSubmit, submitting, isAdmin }: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      type: (defaultValues?.type as EventType) || 'workshop',
      audience: (defaultValues?.audience as EventAudience[]) || ['students'],
      startDate: defaultValues?.startDate ? new Date(defaultValues.startDate).toISOString().slice(0, 16) : '',
      endDate: defaultValues?.endDate ? new Date(defaultValues.endDate).toISOString().slice(0, 16) : '',
      locationAddress: defaultValues?.location?.address || '',
      city: defaultValues?.location?.city || '',
      state: defaultValues?.location?.state || '',
      country: defaultValues?.location?.country || '',
      virtual: defaultValues?.location?.virtual || false,
      meetingUrl: defaultValues?.location?.meetingUrl || '',
      capacity: defaultValues?.capacity,
      volunteerSlots: defaultValues?.volunteerSlots,
      registrationOpen: defaultValues?.registrationOpen ?? true,
      volunteerSignupOpen: defaultValues?.volunteerSignupOpen ?? false,
      isHiddenTreasuresTourStop: defaultValues?.isHiddenTreasuresTourStop ?? false,
      tags: defaultValues?.tags || [],
    },
  })

  const [files, setFiles] = useState<File[]>([])
  const audiences = watch('audience') || []
  const tags = watch('tags') || []
  const virtual = watch('virtual')

  useEffect(() => {
    reset({
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      type: (defaultValues?.type as EventType) || 'workshop',
      audience: (defaultValues?.audience as EventAudience[]) || ['students'],
      startDate: defaultValues?.startDate ? new Date(defaultValues.startDate).toISOString().slice(0, 16) : '',
      endDate: defaultValues?.endDate ? new Date(defaultValues.endDate).toISOString().slice(0, 16) : '',
      locationAddress: defaultValues?.location?.address || '',
      city: defaultValues?.location?.city || '',
      state: defaultValues?.location?.state || '',
      country: defaultValues?.location?.country || '',
      virtual: defaultValues?.location?.virtual || false,
      meetingUrl: defaultValues?.location?.meetingUrl || '',
      capacity: defaultValues?.capacity,
      volunteerSlots: defaultValues?.volunteerSlots,
      registrationOpen: defaultValues?.registrationOpen ?? true,
      volunteerSignupOpen: defaultValues?.volunteerSignupOpen ?? false,
      isHiddenTreasuresTourStop: defaultValues?.isHiddenTreasuresTourStop ?? false,
      tags: defaultValues?.tags || [],
    })
  }, [defaultValues, reset])

  const toggleAudience = (aud: EventAudience) => {
    if (audiences.includes(aud)) {
      setValue(
        'audience',
        audiences.filter((a) => a !== aud)
      )
    } else {
      setValue('audience', [...audiences, aud])
    }
  }

  const onFormSubmit = async (values: EventFormValues) => {
    await onSubmit(values, files)
    setFiles([])
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" aria-label="Event form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select id="type" className="w-full border rounded-md p-2" {...register('type')}>
            <option value="tour">Hidden Treasures Tour</option>
            <option value="discovery_flight">Discovery flight</option>
            <option value="workshop">Workshop</option>
            <option value="webinar">Webinar</option>
            <option value="merit_badge">Merit badge</option>
            <option value="volunteer">Volunteer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register('description')} />
        {errors.description ? <p className="text-sm text-red-500">{errors.description.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label>Audience</Label>
        <div className="flex flex-wrap gap-2">
          {['students', 'mentors', 'organizations', 'sponsors', 'general'].map((aud) => (
            <Button
              key={aud}
              type="button"
              size="sm"
              variant={audiences.includes(aud as EventAudience) ? 'default' : 'outline'}
              onClick={() => toggleAudience(aud as EventAudience)}
            >
              {aud}
            </Button>
          ))}
        </div>
        {errors.audience ? <p className="text-sm text-red-500">{errors.audience.message as string}</p> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start date & time</Label>
          <Input type="datetime-local" id="startDate" {...register('startDate')} />
          {errors.startDate ? <p className="text-sm text-red-500">{errors.startDate.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End date & time</Label>
          <Input type="datetime-local" id="endDate" {...register('endDate')} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox id="virtual" checked={!!virtual} onChange={(e) => setValue('virtual', e.target.checked)} />
          <Label htmlFor="virtual">Virtual event</Label>
        </div>
        {virtual ? (
          <div className="space-y-2">
            <Label htmlFor="meetingUrl">Meeting URL</Label>
            <Input id="meetingUrl" placeholder="https://" {...register('meetingUrl')} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locationAddress">Address</Label>
              <Input id="locationAddress" {...register('locationAddress')} />
              {errors.locationAddress ? (
                <p className="text-sm text-red-500">{errors.locationAddress.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} />
              {errors.city ? <p className="text-sm text-red-500">{errors.city.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Region</Label>
              <Input id="state" {...register('state')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register('country')} />
              {errors.country ? <p className="text-sm text-red-500">{errors.country.message}</p> : null}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity (optional)</Label>
          <Input id="capacity" type="number" min={0} {...register('capacity')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="volunteerSlots">Volunteer slots</Label>
          <Input id="volunteerSlots" type="number" min={0} {...register('volunteerSlots')} />
        </div>
        <div className="space-y-2">
          <Label>Registration open</Label>
          <div className="flex items-center gap-2">
              <Checkbox
                id="registrationOpen"
                checked={watch('registrationOpen')}
                onChange={(e) => setValue('registrationOpen', e.target.checked)}
              />
            <span className="text-sm text-gray-600">Allow attendee registrations</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="volunteerSignupOpen"
              checked={watch('volunteerSignupOpen')}
              onChange={(e) => setValue('volunteerSignupOpen', e.target.checked)}
            />
            <span className="text-sm text-gray-600">Enable volunteer signups</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={(next) => setValue('tags', next)} />
      </div>

      {isAdmin ? (
        <div className="flex items-center gap-2">
          <Checkbox
            id="tourStop"
            checked={watch('isHiddenTreasuresTourStop')}
            onChange={(e) => setValue('isHiddenTreasuresTourStop', e.target.checked)}
          />
          <Label htmlFor="tourStop">Hidden Treasures Tour stop</Label>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="images">Event images</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full md:w-auto">
        {submitting ? 'Saving...' : 'Save event'}
      </Button>
    </form>
  )
}
