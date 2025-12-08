export type ResourceCategory =
  | 'flight'
  | 'stem'
  | 'maintenance'
  | 'drone'
  | 'entrepreneurship'
  | 'operations'
  | 'fundraising'
  | 'video'

export type ResourceAudience = 'students' | 'mentors' | 'organizations' | 'sponsors' | 'general'

export interface Resource {
  id: string
  title: string
  category: ResourceCategory
  audience: ResourceAudience[]
  description: string
  fileUrl: string
  fileType: 'pdf' | 'docx' | 'pptx' | 'video' | 'link' | 'image' | 'other'
  thumbnailUrl?: string
  uploadedBy: string
  uploadedByName?: string
  organizationId?: string
  tags: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  durationMinutes?: number
  language?: string
  downloads: number
  views: number
  rating?: number
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}
