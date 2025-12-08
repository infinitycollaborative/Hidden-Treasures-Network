'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TagInput } from '@/components/common/TagInput'
import { ResourceAudience, ResourceCategory, Resource } from '@/types/resource'

const schema = z
  .object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().min(10, 'Description is required'),
    category: z.enum([
      'flight',
      'stem',
      'maintenance',
      'drone',
      'entrepreneurship',
      'operations',
      'fundraising',
      'video',
    ]),
    audience: z.array(z.enum(['students', 'mentors', 'organizations', 'sponsors', 'general'])).min(1),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    durationMinutes: z
      .preprocess(
        (val) => (val === '' || val === undefined ? undefined : Number(val)),
        z.number().nonnegative().optional()
      ),
    language: z.string().optional(),
    tags: z.array(z.string()).optional(),
    externalLink: z.string().url().optional().or(z.literal('')),
    isFeatured: z.boolean().optional(),
  })

export type ResourceFormValues = z.infer<typeof schema>

interface ResourceFormProps {
  defaultValues?: Partial<Resource>
  onSubmit: (values: ResourceFormValues, file: File | null) => Promise<void>
  submitting?: boolean
  isAdmin?: boolean
}

export function ResourceForm({ defaultValues, onSubmit, submitting, isAdmin }: ResourceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      category: (defaultValues?.category as ResourceCategory) || 'flight',
      audience: (defaultValues?.audience as ResourceAudience[]) || ['students'],
      difficulty: defaultValues?.difficulty,
      durationMinutes: defaultValues?.durationMinutes,
      language: defaultValues?.language || 'English',
      tags: defaultValues?.tags || [],
      externalLink: defaultValues?.fileType === 'link' ? defaultValues.fileUrl : '',
      isFeatured: defaultValues?.isFeatured || false,
    },
  })

  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    reset({
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      category: (defaultValues?.category as ResourceCategory) || 'flight',
      audience: (defaultValues?.audience as ResourceAudience[]) || ['students'],
      difficulty: defaultValues?.difficulty,
      durationMinutes: defaultValues?.durationMinutes,
      language: defaultValues?.language || 'English',
      tags: defaultValues?.tags || [],
      externalLink: defaultValues?.fileType === 'link' ? defaultValues.fileUrl : '',
      isFeatured: defaultValues?.isFeatured || false,
    })
  }, [defaultValues, reset])

  const selectedAudiences = watch('audience') || []
  const tags = watch('tags') || []

  const toggleAudience = (audience: ResourceAudience) => {
    if (selectedAudiences.includes(audience)) {
      setValue(
        'audience',
        selectedAudiences.filter((a) => a !== audience)
      )
    } else {
      setValue('audience', [...selectedAudiences, audience])
    }
  }

  const handleTagsChange = (nextTags: string[]) => setValue('tags', nextTags)

  const onFormSubmit = async (values: ResourceFormValues) => {
    await onSubmit(values, file)
    setFile(null)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" aria-label="Resource form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full border rounded-md p-2"
            {...register('category')}
          >
            <option value="flight">Flight Training</option>
            <option value="stem">STEM Education</option>
            <option value="maintenance">Aircraft Maintenance</option>
            <option value="drone">Drone</option>
            <option value="entrepreneurship">Entrepreneurship</option>
            <option value="operations">Program Operations</option>
            <option value="fundraising">Fundraising</option>
            <option value="video">Video Library</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register('description')} />
        {errors.description ? <p className="text-sm text-red-500">{errors.description.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Audience</Label>
          <div className="flex flex-wrap gap-2">
            {['students', 'mentors', 'organizations', 'sponsors', 'general'].map((aud) => (
              <Button
                type="button"
                variant={selectedAudiences.includes(aud as ResourceAudience) ? 'default' : 'outline'}
                key={aud}
                size="sm"
                onClick={() => toggleAudience(aud as ResourceAudience)}
              >
                {aud}
              </Button>
            ))}
          </div>
          {errors.audience ? <p className="text-sm text-red-500">{errors.audience.message as string}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select id="difficulty" className="w-full border rounded-md p-2" {...register('difficulty')}>
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input id="duration" type="number" min={0} {...register('durationMinutes')} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input id="language" placeholder="English" {...register('language')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="externalLink">External link (optional)</Label>
          <Input id="externalLink" placeholder="https://" {...register('externalLink')} />
          {errors.externalLink ? <p className="text-sm text-red-500">{errors.externalLink.message}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Upload file</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.mp4,.mov"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-gray-500">Provide a file or an external link.</p>
      </div>

      <TagInput value={tags} onChange={handleTagsChange} label="Tags" />

      {isAdmin ? (
        <div className="flex items-center gap-2">
          <input type="checkbox" id="isFeatured" {...register('isFeatured')} />
          <Label htmlFor="isFeatured">Mark as featured</Label>
        </div>
      ) : null}

      <Button type="submit" className="bg-aviation-navy" disabled={submitting} aria-busy={submitting}>
        {submitting ? 'Saving...' : 'Save Resource'}
      </Button>
    </form>
  )
}
