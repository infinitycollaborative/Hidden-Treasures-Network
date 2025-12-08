'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { EventAudience, EventType } from '@/types/event'

export interface EventFilterState {
  type?: EventType
  audience?: EventAudience
  country?: string
  state?: string
  tourOnly?: boolean
}

interface EventFiltersProps {
  filters: EventFilterState
  onChange: (next: EventFilterState) => void
}

export function EventFilters({ filters, onChange }: EventFiltersProps) {
  const [open, setOpen] = useState(false)

  const update = (partial: Partial<EventFilterState>) => onChange({ ...filters, ...partial })

  return (
    <div className="w-full md:w-64 bg-white border rounded-md p-4 space-y-4" aria-label="Event filters">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-aviation-navy flex items-center gap-2">
          <Filter size={18} /> Filters
        </h3>
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </div>
      <div className={`${open ? 'block' : 'hidden md:block'} space-y-3`}>
        <div className="space-y-2">
          <Label htmlFor="type">Event type</Label>
          <select
            id="type"
            className="w-full border rounded-md p-2"
            value={filters.type || ''}
            onChange={(e) =>
              update({ type: e.target.value ? (e.target.value as EventType) : undefined })
            }
          >
            <option value="">All types</option>
            <option value="tour">Hidden Treasures Tour</option>
            <option value="discovery_flight">Discovery flight</option>
            <option value="workshop">Workshop</option>
            <option value="webinar">Webinar</option>
            <option value="merit_badge">Merit badge</option>
            <option value="volunteer">Volunteer</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Audience</Label>
          <div className="flex flex-wrap gap-2">
            {['students', 'mentors', 'organizations', 'sponsors', 'general'].map((aud) => (
              <Button
                key={aud}
                type="button"
                variant={filters.audience === (aud as EventAudience) ? 'default' : 'outline'}
                size="sm"
                onClick={() => update({ audience: filters.audience === aud ? undefined : (aud as EventAudience) })}
              >
                {aud}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              placeholder="e.g., USA"
              value={filters.country || ''}
              onChange={(e) => update({ country: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State/Region</Label>
            <Input
              id="state"
              placeholder="e.g., CA"
              value={filters.state || ''}
              onChange={(e) => update({ state: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="tourOnly" className="flex items-center gap-2">
            <Checkbox
              id="tourOnly"
              checked={!!filters.tourOnly}
              onChange={(e) => update({ tourOnly: e.target.checked })}
            />
            Hidden Treasures Tour
          </Label>
          <Switch
            id="tourOnlyToggle"
            checked={!!filters.tourOnly}
            onChange={(e) => update({ tourOnly: e.target.checked })}
          />
        </div>
      </div>
    </div>
  )
}
