/**
 * AI Assistant for Natural Language Queries
 * Provides conversational interface to platform features
 */

import { aiGenerateJSON, isAIAvailable, redactPII } from './ai'
import type { UserProfile } from '@/types'

export interface AssistantQuery {
  query: string
  userId: string
  userRole: string
  context?: Record<string, any>
}

export interface AssistantResponse {
  response: string
  actionType?: 'search' | 'navigate' | 'report' | 'recommendation' | 'info'
  actionData?: Record<string, any>
  suggestedFollowUps?: string[]
}

/**
 * Process natural language query through AI assistant
 */
export async function processAssistantQuery(
  query: AssistantQuery
): Promise<AssistantResponse> {
  if (!isAIAvailable()) {
    return generateFallbackResponse(query)
  }

  const prompt = `You are a helpful AI assistant for the Hidden Treasures Network, an aviation/STEM education platform.

User Role: ${query.userRole}
Query: "${query.query}"
${query.context ? `Context: ${JSON.stringify(redactPII(query.context), null, 2)}` : ''}

Analyze the query and determine the user's intent. Then provide a response with:
1. A conversational, helpful answer
2. The type of action needed (if any)
3. Any data needed to perform that action
4. Suggested follow-up questions

Available action types:
- "search" - Search for mentors, resources, events, organizations
- "navigate" - Direct user to a specific page
- "report" - Generate a report or summary
- "recommendation" - Provide personalized recommendations
- "info" - Just provide information, no action needed

Return a JSON object with this exact structure:
{
  "response": "<friendly, conversational response>",
  "actionType": "<one of the action types or null>",
  "actionData": {
    "query": "<search query or filter parameters>",
    "url": "<navigation url if applicable>",
    "reportType": "<type of report if applicable>"
  },
  "suggestedFollowUps": ["<follow-up question 1>", "<follow-up question 2>"]
}

Be helpful, concise, and action-oriented. Understand context and user role.`

  try {
    const result = await aiGenerateJSON<AssistantResponse>(prompt, {
      temperature: 0.7,
      maxTokens: 500,
    })

    if (result && result.response) {
      return result
    }
  } catch (error) {
    console.error('AI assistant error:', error)
  }

  return generateFallbackResponse(query)
}

/**
 * Fallback response generation using pattern matching
 */
function generateFallbackResponse(query: AssistantQuery): AssistantResponse {
  const q = query.query.toLowerCase()
  const role = query.userRole

  // Find mentor patterns
  if (q.includes('find') && q.includes('mentor')) {
    return {
      response: "I can help you find a mentor! Let me search for mentors that match your interests.",
      actionType: 'search',
      actionData: {
        query: 'mentors',
        filters: extractMentorFilters(q),
      },
      suggestedFollowUps: [
        'Show me mentors with aviation experience',
        'Find mentors available for virtual sessions',
      ],
    }
  }

  // Resource recommendations
  if (q.includes('resource') || q.includes('learn') || q.includes('study')) {
    return {
      response: "I can recommend resources based on your interests. What topic are you interested in?",
      actionType: 'recommendation',
      actionData: {
        type: 'resources',
      },
      suggestedFollowUps: [
        'Show me aviation resources',
        'What resources for beginners?',
      ],
    }
  }

  // Events
  if (q.includes('event') || q.includes('workshop') || q.includes('webinar')) {
    return {
      response: "Let me show you upcoming events that might interest you.",
      actionType: 'navigate',
      actionData: {
        url: '/events',
      },
      suggestedFollowUps: [
        'Show virtual events only',
        'What events are this month?',
      ],
    }
  }

  // Progress/reports (students)
  if (role === 'student' && (q.includes('progress') || q.includes('achievement'))) {
    return {
      response: "I can show you your progress and achievements.",
      actionType: 'navigate',
      actionData: {
        url: '/dashboard/student',
      },
      suggestedFollowUps: [
        'What are my recent achievements?',
        'How many hours have I completed?',
      ],
    }
  }

  // Mentee summary (mentors)
  if (role === 'mentor' && q.includes('mentee')) {
    return {
      response: "I can provide a summary of your mentees and their progress.",
      actionType: 'report',
      actionData: {
        reportType: 'mentee_summary',
      },
      suggestedFollowUps: [
        'Show me recent mentee activity',
        'Which mentees need attention?',
      ],
    }
  }

  // Organization insights (organizations)
  if (role === 'organization' && (q.includes('program') || q.includes('metric'))) {
    return {
      response: "I can show you your program metrics and performance data.",
      actionType: 'navigate',
      actionData: {
        url: '/dashboard/organization/impact',
      },
      suggestedFollowUps: [
        'What are our top programs?',
        'Show student enrollment trends',
      ],
    }
  }

  // Admin queries
  if (role === 'admin') {
    if (q.includes('risk') || q.includes('alert')) {
      return {
        response: "I'll show you users and organizations that may need attention.",
        actionType: 'report',
        actionData: {
          reportType: 'at_risk_analysis',
        },
        suggestedFollowUps: [
          'Show inactive users',
          'Which organizations need support?',
        ],
      }
    }

    if (q.includes('insight') || q.includes('analytics')) {
      return {
        response: "Let me generate network insights and analytics for you.",
        actionType: 'navigate',
        actionData: {
          url: '/dashboard/admin/insights',
        },
        suggestedFollowUps: [
          'What are the key trends?',
          'Show user growth statistics',
        ],
      }
    }
  }

  // Generic help
  return {
    response: "I'm here to help! I can assist you with finding mentors, resources, events, and more. What would you like to know?",
    actionType: 'info',
    suggestedFollowUps: [
      'Find me a mentor',
      'Show upcoming events',
      'Recommend resources for me',
    ],
  }
}

/**
 * Extract mentor search filters from natural language
 */
function extractMentorFilters(query: string): Record<string, any> {
  const filters: Record<string, any> = {}

  // Location
  if (query.includes('virtual')) {
    filters.virtual = true
  }
  if (query.includes('in-person') || query.includes('local')) {
    filters.inPerson = true
  }

  // Specialty keywords
  const specialties = ['aviation', 'pilot', 'stem', 'engineering', 'drone', 'aircraft']
  for (const specialty of specialties) {
    if (query.includes(specialty)) {
      filters.specialty = specialty
      break
    }
  }

  // Location extraction
  const stateMatch = query.match(/in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i)
  if (stateMatch) {
    filters.state = stateMatch[1]
  }

  return filters
}

/**
 * Generate contextual suggestions based on user profile
 */
export function generateContextualSuggestions(
  user: UserProfile
): string[] {
  const suggestions: string[] = []

  switch (user.role) {
    case 'student':
      suggestions.push(
        'Find me a mentor in aviation',
        'Show me upcoming workshops',
        'What resources can help me get my pilot license?',
        'Show my progress and achievements'
      )
      break
    case 'mentor':
      suggestions.push(
        'Summarize my mentees\' recent progress',
        'Find students who need a mentor',
        'Show upcoming events I can attend',
        'What resources can I share with my mentees?'
      )
      break
    case 'organization':
      suggestions.push(
        'Show our program performance metrics',
        'Find potential sponsors for our programs',
        'What grants match our profile?',
        'Show student enrollment trends'
      )
      break
    case 'sponsor':
      suggestions.push(
        'Show my impact report',
        'Find programs I can support',
        'What organizations need funding?',
        'Show my contribution history'
      )
      break
    case 'admin':
      suggestions.push(
        'Show network insights and analytics',
        'Which users are at risk of churn?',
        'Generate a board meeting report',
        'Show programs needing support',
        'What are the key network trends?'
      )
      break
  }

  return suggestions
}

/**
 * Chat history management
 */
export interface ChatMessage {
  id: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actionType?: string
  actionData?: Record<string, any>
}

export function formatChatHistory(messages: ChatMessage[]): string {
  return messages
    .slice(-5) // Last 5 messages for context
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n')
}
