'use client'

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ResourceAudience,
  ResourceCategory,
} from '@/types/resource'

export interface LibraryFilters {
  search: string
  category?: ResourceCategory
  audience?: ResourceAudience
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  sortBy: 'newest' | 'downloads' | 'featured'
}

interface ResourceFiltersProps {
  value: LibraryFilters
  onChange: (next: LibraryFilters) => void
}

const categoryOptions: { label: string; value: ResourceCategory }[] = [
  { label: 'Flight Training', value: 'flight' },
  { label: 'STEM Education', value: 'stem' },
  { label: 'Aircraft Maintenance', value: 'maintenance' },
  { label: 'Drone', value: 'drone' },
  { label: 'Entrepreneurship', value: 'entrepreneurship' },
  { label: 'Program Operations', value: 'operations' },
  { label: 'Fundraising', value: 'fundraising' },
  { label: 'Video Library', value: 'video' },
]

const audienceOptions: { label: string; value: ResourceAudience }[] = [
  { label: 'Students', value: 'students' },
  { label: 'Mentors', value: 'mentors' },
  { label: 'Organizations', value: 'organizations' },
  { label: 'Sponsors', value: 'sponsors' },
  { label: 'General', value: 'general' },
]

const difficultyOptions = ['beginner', 'intermediate', 'advanced'] as const

export function ResourceFilters({ value, onChange }: ResourceFiltersProps) {
  const [open, setOpen] = useState(false)

  const update = (next: Partial<LibraryFilters>) => onChange({ ...value, ...next })

  return (
    <aside className="bg-white border rounded-xl p-4 shadow-sm" aria-label="Resource filters">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-aviation-navy">Filter</h3>
          <p className="text-sm text-gray-500">Search, sort, and refine resources</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} className="md:hidden">
          {open ? 'Hide' : 'Show'}
        </Button>
      </div>

      <div className={`space-y-6 ${open ? 'block' : 'hidden md:block'}`}>
        <div className="space-y-2">
          <Label htmlFor="resource-search">Search</Label>
          <Input
            id="resource-search"
            placeholder="Search title, description, tags"
            value={value.search}
            onChange={(e) => update({ search: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <Badge
                key={category.value}
                variant={value.category === category.value ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => update({ category: value.category === category.value ? undefined : category.value })}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Audience</Label>
          <div className="flex flex-wrap gap-2">
            {audienceOptions.map((audience) => (
              <Badge
                key={audience.value}
                variant={value.audience === audience.value ? 'default' : 'secondary'}
                className="cursor-pointer capitalize"
                onClick={() => update({ audience: value.audience === audience.value ? undefined : audience.value })}
              >
                {audience.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <div className="flex gap-2 flex-wrap">
            {difficultyOptions.map((level) => (
              <Badge
                key={level}
                variant={value.difficulty === level ? 'default' : 'secondary'}
                className="cursor-pointer capitalize"
                onClick={() => update({ difficulty: value.difficulty === level ? undefined : level })}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort</Label>
          <select
            id="sort"
            className="w-full border rounded-md p-2"
            value={value.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as LibraryFilters['sortBy'] })}
          >
            <option value="newest">Newest</option>
            <option value="downloads">Most Downloaded</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
