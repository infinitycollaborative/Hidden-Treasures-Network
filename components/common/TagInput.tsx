'use client'

import { useState, KeyboardEvent } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  label?: string
  placeholder?: string
}

export function TagInput({ value, onChange, label, placeholder }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === 'Enter' || event.key === ',') && input.trim()) {
      event.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium text-gray-700">{label}</label> : null}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Add a tag and press enter'}
        />
        <Button type="button" variant="outline" onClick={addTag}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => removeTag(tag)}
              className="ml-1 text-xs hover:text-red-600"
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
