export type EventType =
  | 'tour'
  | 'discovery_flight'
  | 'workshop'
  | 'webinar'
  | 'merit_badge'
  | 'volunteer'
  | 'other'

export type EventAudience =
  | 'students'
  | 'mentors'
  | 'organizations'
  | 'sponsors'
  | 'general'

export interface Event {
  id: string
  title: string
  type: EventType
  audience: EventAudience[]
  description: string
  startDate: Date
  endDate?: Date
  location: {
    coordinates?: { lat: number; lng: number }
    address: string
    city: string
    state?: string
    country: string
    virtual?: boolean
    meetingUrl?: string
  }
  isHiddenTreasuresTourStop: boolean
  organizerId: string
  organizerName?: string
  capacity?: number
  registeredCount: number
  volunteerSlots?: number
  volunteerCount: number
  registrationOpen: boolean
  volunteerSignupOpen: boolean
  imageUrls: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type RegistrationStatus = 'registered' | 'waitlisted' | 'cancelled' | 'checked_in'

export interface EventRegistration {
  id: string
  eventId: string
  userId?: string
  name: string
  email: string
  phone?: string
  role: 'student' | 'parent' | 'mentor' | 'volunteer' | 'other'
  status: RegistrationStatus
  createdAt: Date
  updatedAt: Date
}
