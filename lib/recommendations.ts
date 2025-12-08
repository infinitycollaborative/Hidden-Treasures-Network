/**
 * AI-Powered Personalized Recommendations
 * Recommends resources, events, and connections based on user profiles
 */

import { aiGenerateJSON, isAIAvailable, redactPII } from './ai'
import type { UserProfile } from '@/types'
import type { Resource } from '@/types/resource'
import type { Event } from '@/types/event'

export interface RecommendationResult<T> {
  item: T
  score: number // 0-100
  reasons: string[]
}

/**
 * Recommend resources for a user based on their profile
 */
export async function recommendResourcesForUser(
  user: UserProfile,
  resources: Resource[],
  limit: number = 5
): Promise<RecommendationResult<Resource>[]> {
  if (!isAIAvailable() || resources.length === 0) {
    return fallbackResourceRecommendations(user, resources, limit)
  }

  const safeUser = redactPII({
    role: user.role,
    interests: (user as any).studentProfile?.interests || (user as any).mentorProfile?.specialty || [],
    goals: (user as any).studentProfile?.goals || [],
    grade: (user as any).studentProfile?.grade,
    certifications: (user as any).mentorProfile?.certifications || [],
  })

  const safeResources = resources.map((r) => redactPII({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    tags: r.tags,
    difficulty: r.difficulty,
  }))

  const prompt = `You are an expert aviation/STEM education content curator.

User Profile:
${JSON.stringify(safeUser, null, 2)}

Available Resources:
${JSON.stringify(safeResources.slice(0, 20), null, 2)}

Recommend the top ${limit} most relevant resources for this user.

Return a JSON object with this exact structure:
{
  "recommendations": [
    {
      "resourceId": "<resource id>",
      "score": <number 0-100>,
      "reasons": [<array of 1-2 brief reasons why this resource fits>]
    }
  ]
}

Focus on educational value, skill level appropriateness, and interest alignment.`

  try {
    const result = await aiGenerateJSON<{
      recommendations: Array<{ resourceId: string; score: number; reasons: string[] }>
    }>(prompt, {
      temperature: 0.5,
      maxTokens: 800,
    })

    if (result && Array.isArray(result.recommendations)) {
      const recommendations: RecommendationResult<Resource>[] = []
      
      for (const rec of result.recommendations.slice(0, limit)) {
        const resource = resources.find((r) => r.id === rec.resourceId)
        if (resource) {
          recommendations.push({
            item: resource,
            score: Math.max(0, Math.min(100, rec.score)),
            reasons: Array.isArray(rec.reasons) ? rec.reasons : [],
          })
        }
      }

      if (recommendations.length > 0) {
        return recommendations
      }
    }
  } catch (error) {
    console.error('AI resource recommendation error:', error)
  }

  return fallbackResourceRecommendations(user, resources, limit)
}

/**
 * Fallback resource recommendations using rule-based logic
 */
function fallbackResourceRecommendations(
  user: UserProfile,
  resources: Resource[],
  limit: number
): RecommendationResult<Resource>[] {
  const userInterests =
    (user as any).studentProfile?.interests ||
    (user as any).mentorProfile?.specialty ||
    []
  const userRole = user.role

  const scored = resources.map((resource) => {
    let score = 0
    const reasons: string[] = []

    // Match interests/specialty with tags
    const matchedTags = resource.tags?.filter((tag) =>
      userInterests.some((interest: string) =>
        tag.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(tag.toLowerCase())
      )
    )

    if (matchedTags && matchedTags.length > 0) {
      score += 30 * Math.min(matchedTags.length, 2)
      reasons.push(`Matches your interest in ${matchedTags[0]}`)
    }

    // Role-appropriate difficulty
    if (userRole === 'student') {
      const grade = (user as any).studentProfile?.grade
      if (resource.difficulty === 'beginner' && (!grade || parseInt(grade) <= 10)) {
        score += 20
        reasons.push('Appropriate difficulty level')
      } else if (resource.difficulty === 'intermediate' && grade && parseInt(grade) > 10) {
        score += 20
        reasons.push('Appropriate difficulty level')
      }
    } else if (userRole === 'mentor' && resource.difficulty === 'advanced') {
      score += 15
      reasons.push('Advanced content')
    }

    // Category relevance
    if (resource.category === 'aviation' || resource.category === 'stem') {
      score += 10
      reasons.push('Core program content')
    }

    return { item: resource, score, reasons }
  })

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Recommend events for a user based on their profile
 */
export async function recommendEventsForUser(
  user: UserProfile,
  events: Event[],
  limit: number = 5
): Promise<RecommendationResult<Event>[]> {
  if (!isAIAvailable() || events.length === 0) {
    return fallbackEventRecommendations(user, events, limit)
  }

  const safeUser = redactPII({
    role: user.role,
    interests: (user as any).studentProfile?.interests || (user as any).mentorProfile?.specialty || [],
    grade: (user as any).studentProfile?.grade,
    location: user.location?.state,
    experience: (user as any).mentorProfile?.yearsOfExperience,
  })

  const safeEvents = events.map((e) => redactPII({
    id: e.id,
    title: e.title,
    description: e.description,
    category: e.category,
    location: e.location === 'virtual' ? 'virtual' : e.location?.city,
    capacity: e.capacity,
    registered: e.registered,
  }))

  const prompt = `You are an expert aviation/STEM education event curator.

User Profile:
${JSON.stringify(safeUser, null, 2)}

Available Events:
${JSON.stringify(safeEvents.slice(0, 15), null, 2)}

Recommend the top ${limit} most relevant upcoming events for this user.

Return a JSON object with this exact structure:
{
  "recommendations": [
    {
      "eventId": "<event id>",
      "score": <number 0-100>,
      "reasons": [<array of 1-2 brief reasons why this event fits>]
    }
  ]
}

Consider age appropriateness, location accessibility, interests, and skill level.`

  try {
    const result = await aiGenerateJSON<{
      recommendations: Array<{ eventId: string; score: number; reasons: string[] }>
    }>(prompt, {
      temperature: 0.5,
      maxTokens: 700,
    })

    if (result && Array.isArray(result.recommendations)) {
      const recommendations: RecommendationResult<Event>[] = []
      
      for (const rec of result.recommendations.slice(0, limit)) {
        const event = events.find((e) => e.id === rec.eventId)
        if (event) {
          recommendations.push({
            item: event,
            score: Math.max(0, Math.min(100, rec.score)),
            reasons: Array.isArray(rec.reasons) ? rec.reasons : [],
          })
        }
      }

      if (recommendations.length > 0) {
        return recommendations
      }
    }
  } catch (error) {
    console.error('AI event recommendation error:', error)
  }

  return fallbackEventRecommendations(user, events, limit)
}

/**
 * Fallback event recommendations using rule-based logic
 */
function fallbackEventRecommendations(
  user: UserProfile,
  events: Event[],
  limit: number
): RecommendationResult<Event>[] {
  const userInterests =
    (user as any).studentProfile?.interests ||
    (user as any).mentorProfile?.specialty ||
    []
  const userState = user.location?.state

  const scored = events.map((event) => {
    let score = 0
    const reasons: string[] = []

    // Category match
    const matchedInterests = userInterests.filter((interest: string) =>
      event.category.toLowerCase().includes(interest.toLowerCase()) ||
      event.title.toLowerCase().includes(interest.toLowerCase())
    )

    if (matchedInterests.length > 0) {
      score += 30
      reasons.push(`Matches your interest in ${matchedInterests[0]}`)
    }

    // Location preference
    if (event.location === 'virtual') {
      score += 15
      reasons.push('Virtual event - join from anywhere')
    } else if (event.location && typeof event.location !== 'string') {
      if (userState && event.location.state === userState) {
        score += 20
        reasons.push('Local event in your area')
      }
    }

    // Capacity availability
    if (event.capacity && event.registered < event.capacity) {
      score += 10
      reasons.push('Spots available')
    }

    // Role appropriateness
    if (event.category === 'workshop' || event.category === 'training') {
      score += 15
      reasons.push('Educational opportunity')
    }

    return { item: event, score, reasons }
  })

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Get personalized recommendations for all types
 */
export async function getPersonalizedRecommendations(
  user: UserProfile,
  data: {
    resources?: Resource[]
    events?: Event[]
  }
): Promise<{
  resources: RecommendationResult<Resource>[]
  events: RecommendationResult<Event>[]
}> {
  const [resources, events] = await Promise.all([
    data.resources
      ? recommendResourcesForUser(user, data.resources, 5)
      : Promise.resolve([]),
    data.events
      ? recommendEventsForUser(user, data.events, 5)
      : Promise.resolve([]),
  ])

  return { resources, events }
}
