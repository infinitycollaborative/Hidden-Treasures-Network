/**
 * AI-Powered Smart Notifications
 * Generates personalized, priority-aware notifications
 */

import { aiGenerateJSON, isAIAvailable, redactPII } from './ai'
import type { UserProfile } from '@/types'

export type NotificationPriority = 'high' | 'medium' | 'low'

export interface SmartNotification {
  userId: string
  title: string
  message: string
  priority: NotificationPriority
  category: string
  actionUrl?: string
  metadata?: Record<string, any>
}

/**
 * Generate AI-personalized notification message
 */
export async function generatePersonalizedNotification(
  user: UserProfile,
  notificationType: string,
  context: Record<string, any>
): Promise<{ title: string; message: string } | null> {
  if (!isAIAvailable()) {
    return generateFallbackNotification(user, notificationType, context)
  }

  const safeUser = redactPII({
    role: user.role,
    displayName: user.displayName?.charAt(0) + '***',
    interests: (user as any).studentProfile?.interests || (user as any).mentorProfile?.specialty || [],
  })

  const safeContext = redactPII(context)

  const prompt = `You are a helpful assistant for an aviation/STEM education platform.

User Profile:
${JSON.stringify(safeUser, null, 2)}

Notification Type: ${notificationType}
Context:
${JSON.stringify(safeContext, null, 2)}

Generate a friendly, personalized notification for this user.

Return a JSON object with this exact structure:
{
  "title": "<brief, engaging title (max 50 chars)>",
  "message": "<personalized message (max 150 chars)>"
}

Make it relevant, encouraging, and action-oriented. Use a warm, supportive tone.`

  try {
    const result = await aiGenerateJSON<{ title: string; message: string }>(prompt, {
      temperature: 0.7,
      maxTokens: 200,
    })

    if (result && result.title && result.message) {
      return result
    }
  } catch (error) {
    console.error('AI notification generation error:', error)
  }

  return generateFallbackNotification(user, notificationType, context)
}

/**
 * Fallback notification generation
 */
function generateFallbackNotification(
  user: UserProfile,
  notificationType: string,
  context: Record<string, any>
): { title: string; message: string } {
  const firstName = user.displayName?.split(' ')[0] || 'there'

  switch (notificationType) {
    case 'mentor_match':
      return {
        title: 'New Mentor Match!',
        message: `Hi ${firstName}! We found a great mentor match for you. Check out their profile.`,
      }
    case 'event_reminder':
      return {
        title: 'Event Reminder',
        message: `Don't forget: ${context.eventName} is coming up soon!`,
      }
    case 'resource_recommendation':
      return {
        title: 'New Resource for You',
        message: `Based on your interests, you might enjoy this new ${context.resourceType}.`,
      }
    case 'inactive_user':
      return {
        title: 'We Miss You!',
        message: `It's been a while since your last visit. Come see what's new in the community!`,
      }
    case 'milestone_achieved':
      return {
        title: 'Congratulations!',
        message: `You've reached a new milestone: ${context.achievement}`,
      }
    default:
      return {
        title: 'Update from Hidden Treasures Network',
        message: 'You have a new notification. Check your dashboard for details.',
      }
  }
}

/**
 * Determine notification priority based on context
 */
export function determineNotificationPriority(
  notificationType: string,
  context: Record<string, any>,
  userRole: string
): NotificationPriority {
  // High priority notifications
  const highPriority = [
    'mentor_response',
    'event_cancelled',
    'event_changed',
    'urgent_message',
    'application_approved',
    'safety_alert',
  ]

  // Low priority notifications
  const lowPriority = [
    'new_sponsor',
    'newsletter',
    'general_announcement',
    'community_update',
  ]

  if (highPriority.includes(notificationType)) {
    return 'high'
  }

  if (lowPriority.includes(notificationType)) {
    return 'low'
  }

  // Context-based priority
  if (context.daysInactive && context.daysInactive > 30) {
    return 'high' // Re-engagement is important
  }

  if (context.deadline && new Date(context.deadline) < new Date(Date.now() + 86400000 * 7)) {
    return 'high' // Within 7 days
  }

  // Role-specific priority
  if (userRole === 'student') {
    if (['mentor_match', 'event_invitation', 'resource_recommendation'].includes(notificationType)) {
      return 'medium'
    }
  }

  if (userRole === 'mentor') {
    if (['new_mentee_request', 'session_reminder'].includes(notificationType)) {
      return 'high'
    }
  }

  if (userRole === 'admin') {
    if (['new_application', 'system_alert'].includes(notificationType)) {
      return 'high'
    }
  }

  return 'medium'
}

/**
 * Generate smart notifications for multiple users
 */
export async function generateSmartNotifications(
  users: UserProfile[],
  notificationType: string,
  baseContext: Record<string, any>
): Promise<SmartNotification[]> {
  const notifications: SmartNotification[] = []

  for (const user of users) {
    const priority = determineNotificationPriority(
      notificationType,
      baseContext,
      user.role
    )

    const content = await generatePersonalizedNotification(
      user,
      notificationType,
      baseContext
    )

    if (content) {
      notifications.push({
        userId: (user as any).uid || user.id,
        title: content.title,
        message: content.message,
        priority,
        category: notificationType,
        actionUrl: baseContext.actionUrl,
        metadata: baseContext,
      })
    }
  }

  return notifications
}

/**
 * Generate re-engagement notification for inactive user
 */
export async function generateReEngagementNotification(
  user: UserProfile,
  inactiveDays: number,
  recentActivity?: {
    newResources?: number
    newEvents?: number
    newMentors?: number
  }
): Promise<SmartNotification | null> {
  const context = {
    inactiveDays,
    ...recentActivity,
  }

  const content = await generatePersonalizedNotification(
    user,
    'inactive_user',
    context
  )

  if (!content) return null

  return {
    userId: (user as any).uid || user.id,
    title: content.title,
    message: content.message,
    priority: inactiveDays > 30 ? 'high' : 'medium',
    category: 're_engagement',
    actionUrl: '/dashboard',
    metadata: context,
  }
}

/**
 * Generate organization support notification
 */
export async function generateOrganizationSupportNotification(
  organization: any,
  issue: string
): Promise<SmartNotification | null> {
  const content = {
    title: 'Organization May Need Support',
    message: `${organization.organizationName} may need assistance: ${issue}`,
  }

  return {
    userId: 'admin',
    title: content.title,
    message: content.message,
    priority: 'high',
    category: 'organization_support',
    actionUrl: `/dashboard/admin/organizations/${organization.id}`,
    metadata: { organizationId: organization.id, issue },
  }
}

/**
 * Batch process notifications with rate limiting
 */
export async function batchProcessNotifications(
  notifications: SmartNotification[],
  batchSize: number = 10
): Promise<{ sent: number; failed: number }> {
  let sent = 0
  let failed = 0

  for (let i = 0; i < notifications.length; i += batchSize) {
    const batch = notifications.slice(i, i + batchSize)
    
    try {
      // Here you would integrate with your notification service
      // For now, we'll just log and count
      console.log(`Processing batch of ${batch.length} notifications`)
      sent += batch.length
      
      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error('Batch notification error:', error)
      failed += batch.length
    }
  }

  return { sent, failed }
}
