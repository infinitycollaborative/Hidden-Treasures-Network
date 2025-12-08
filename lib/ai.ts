/**
 * AI Integration Layer
 * Provides utilities for AI-powered features using OpenAI API
 */

import OpenAI from 'openai'

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

/**
 * Check if AI is available
 */
export function isAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY
}

/**
 * Generate AI completion with error handling and fallback
 */
export async function aiGenerateCompletion(
  prompt: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
    responseFormat?: 'text' | 'json'
  }
): Promise<string | null> {
  if (!isAIAvailable()) {
    console.warn('AI is not available - OpenAI API key not configured')
    return null
  }

  try {
    const response = await openai.chat.completions.create({
      model: options?.model || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
      ...(options?.responseFormat === 'json' && {
        response_format: { type: 'json_object' },
      }),
    })

    return response.choices[0]?.message?.content || null
  } catch (error) {
    console.error('AI completion error:', error)
    return null
  }
}

/**
 * Generate AI completion with structured JSON response
 */
export async function aiGenerateJSON<T = any>(
  prompt: string,
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
): Promise<T | null> {
  const content = await aiGenerateCompletion(prompt, {
    ...options,
    responseFormat: 'json',
  })

  if (!content) {
    return null
  }

  try {
    return JSON.parse(content) as T
  } catch (error) {
    console.error('Failed to parse AI JSON response:', error)
    return null
  }
}

/**
 * Redact PII from data before sending to AI
 * Removes or masks sensitive information
 */
export function redactPII(data: any): any {
  if (typeof data === 'string') {
    return data
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
  }

  if (Array.isArray(data)) {
    return data.map(redactPII)
  }

  if (typeof data === 'object' && data !== null) {
    const redacted: any = {}
    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive fields entirely
      if (
        ['email', 'phone', 'phoneNumber', 'ssn', 'taxId', 'password'].includes(
          key.toLowerCase()
        )
      ) {
        redacted[key] = '[REDACTED]'
      } else if (
        ['firstName', 'lastName', 'name'].includes(key) &&
        typeof value === 'string'
      ) {
        // Hash names but keep initials
        redacted[key] = value.charAt(0) + '***'
      } else {
        redacted[key] = redactPII(value)
      }
    }
    return redacted
  }

  return data
}

/**
 * Create a safe prompt with PII redaction
 */
export function createSafePrompt(template: string, data: any): string {
  const redactedData = redactPII(data)
  return template.replace(
    /\{(\w+)\}/g,
    (_, key) => JSON.stringify(redactedData[key] || '', null, 2)
  )
}
