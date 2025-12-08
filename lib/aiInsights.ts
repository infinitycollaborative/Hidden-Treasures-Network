/**
 * AI-Powered Network Insights Generator
 * Analyzes network-wide data to generate actionable insights for admins
 */

import { aiGenerateJSON, isAIAvailable, redactPII } from './ai'

export interface NetworkData {
  users: {
    total: number
    byRole: Record<string, number>
    activeThisMonth: number
    newThisMonth: number
  }
  mentorships: {
    total: number
    activeThisMonth: number
    averageDuration: number
  }
  programs: {
    total: number
    active: number
    studentsEnrolled: number
  }
  events: {
    total: number
    upcoming: number
    avgAttendance: number
  }
  sponsors: {
    total: number
    active: number
    totalFunding: number
  }
  engagement: {
    avgSessionsPerUser: number
    messagesSent: number
    resourcesShared: number
  }
}

export interface NetworkInsights {
  summary: string
  keyTrends: Array<{
    title: string
    description: string
    direction: 'up' | 'down' | 'stable'
    impact: 'high' | 'medium' | 'low'
  }>
  opportunities: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  risks: Array<{
    title: string
    description: string
    severity: 'high' | 'medium' | 'low'
    actionable: boolean
  }>
  recommendations: string[]
}

/**
 * Generate comprehensive network insights using AI
 */
export async function generateNetworkInsights(
  data: NetworkData
): Promise<NetworkInsights | null> {
  if (!isAIAvailable()) {
    return generateFallbackInsights(data)
  }

  // Redact any PII (though metrics shouldn't have any)
  const safeData = redactPII(data)

  const prompt = `You are an expert analyst for aviation/STEM education networks.

Network Metrics:
${JSON.stringify(safeData, null, 2)}

Analyze these metrics and generate comprehensive insights for network administrators.

Return a JSON object with this exact structure:
{
  "summary": "<1-2 sentence executive summary of network health>",
  "keyTrends": [
    {
      "title": "<trend name>",
      "description": "<brief explanation>",
      "direction": "<up|down|stable>",
      "impact": "<high|medium|low>"
    }
  ],
  "opportunities": [
    {
      "title": "<opportunity name>",
      "description": "<brief explanation>",
      "priority": "<high|medium|low>"
    }
  ],
  "risks": [
    {
      "title": "<risk name>",
      "description": "<brief explanation>",
      "severity": "<high|medium|low>",
      "actionable": <true|false>
    }
  ],
  "recommendations": [
    "<specific actionable recommendation>"
  ]
}

Provide 2-4 trends, 2-3 opportunities, 1-3 risks, and 3-5 recommendations.
Be specific, data-driven, and actionable.`

  try {
    const result = await aiGenerateJSON<NetworkInsights>(prompt, {
      temperature: 0.6,
      maxTokens: 1200,
    })

    if (result && result.summary) {
      return result
    }
  } catch (error) {
    console.error('AI insights generation error:', error)
  }

  return generateFallbackInsights(data)
}

/**
 * Generate fallback insights using rule-based logic
 */
function generateFallbackInsights(data: NetworkData): NetworkInsights {
  const insights: NetworkInsights = {
    summary: 'Network metrics show overall stability with growth opportunities.',
    keyTrends: [],
    opportunities: [],
    risks: [],
    recommendations: [],
  }

  // User growth trend
  const userGrowthRate = data.users.newThisMonth / data.users.total
  if (userGrowthRate > 0.1) {
    insights.keyTrends.push({
      title: 'Strong User Growth',
      description: `${data.users.newThisMonth} new users this month (${(userGrowthRate * 100).toFixed(1)}% growth)`,
      direction: 'up',
      impact: 'high',
    })
  } else if (userGrowthRate < 0.02) {
    insights.keyTrends.push({
      title: 'Slow User Growth',
      description: `Only ${data.users.newThisMonth} new users this month`,
      direction: 'down',
      impact: 'medium',
    })
  }

  // Engagement trend
  const engagementRate = data.users.activeThisMonth / data.users.total
  if (engagementRate > 0.6) {
    insights.keyTrends.push({
      title: 'High Engagement',
      description: `${(engagementRate * 100).toFixed(1)}% of users active this month`,
      direction: 'up',
      impact: 'high',
    })
  } else if (engagementRate < 0.3) {
    insights.risks.push({
      title: 'Low User Engagement',
      description: `Only ${(engagementRate * 100).toFixed(1)}% of users are active`,
      severity: 'medium',
      actionable: true,
    })
  }

  // Mentor supply and demand
  const mentors = data.users.byRole?.mentor || 0
  const students = data.users.byRole?.student || 0
  const mentorStudentRatio = students / mentors
  
  if (mentorStudentRatio > 10) {
    insights.risks.push({
      title: 'Mentor Shortage',
      description: `High student-to-mentor ratio (${mentorStudentRatio.toFixed(1)}:1)`,
      severity: 'high',
      actionable: true,
    })
    insights.recommendations.push('Launch mentor recruitment campaign')
  }

  // Program health
  const programActivity = data.programs.studentsEnrolled / data.programs.total
  if (programActivity < 10) {
    insights.opportunities.push({
      title: 'Underutilized Programs',
      description: 'Several programs have low enrollment',
      priority: 'medium',
    })
  }

  // Sponsorship opportunities
  if (data.sponsors.total < 10) {
    insights.opportunities.push({
      title: 'Expand Sponsorship',
      description: 'Significant growth potential in corporate partnerships',
      priority: 'high',
    })
    insights.recommendations.push('Develop sponsor outreach strategy')
  }

  // Event participation
  if (data.events.upcoming < 3) {
    insights.opportunities.push({
      title: 'Increase Event Programming',
      description: 'Few upcoming events scheduled',
      priority: 'medium',
    })
  }

  // Generic recommendations
  insights.recommendations.push('Monitor engagement metrics weekly')
  insights.recommendations.push('Survey users for feedback and suggestions')
  
  if (insights.recommendations.length < 3) {
    insights.recommendations.push('Continue building community partnerships')
  }

  return insights
}

/**
 * Identify at-risk users who need intervention
 */
export async function identifyAtRiskUsers(
  users: Array<{
    id: string
    role: string
    lastActive: Date
    sessionCount: number
    engagementScore: number
  }>
): Promise<Array<{ user: any; riskLevel: 'high' | 'medium' | 'low'; reasons: string[] }>> {
  const atRisk = []

  for (const user of users) {
    const daysSinceActive = Math.floor(
      (Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    )

    const reasons: string[] = []
    let riskLevel: 'high' | 'medium' | 'low' = 'low'

    // Inactivity risk
    if (daysSinceActive > 30) {
      riskLevel = 'high'
      reasons.push(`Inactive for ${daysSinceActive} days`)
    } else if (daysSinceActive > 14) {
      riskLevel = 'medium'
      reasons.push(`No activity for ${daysSinceActive} days`)
    }

    // Low engagement
    if (user.sessionCount < 3) {
      riskLevel = riskLevel === 'high' ? 'high' : 'medium'
      reasons.push('Very few sessions completed')
    }

    if (user.engagementScore < 20) {
      riskLevel = riskLevel === 'high' ? 'high' : 'medium'
      reasons.push('Low engagement score')
    }

    if (reasons.length > 0) {
      atRisk.push({
        user,
        riskLevel,
        reasons,
      })
    }
  }

  return atRisk.sort((a, b) => {
    const levels = { high: 3, medium: 2, low: 1 }
    return levels[b.riskLevel] - levels[a.riskLevel]
  })
}

/**
 * Generate geographic expansion opportunities
 */
export async function identifyGrowthOpportunities(
  data: {
    usersByRegion: Record<string, number>
    programsByRegion: Record<string, number>
    sponsorsByRegion: Record<string, number>
  }
): Promise<Array<{ region: string; opportunity: string; priority: 'high' | 'medium' | 'low' }>> {
  const opportunities = []

  for (const [region, userCount] of Object.entries(data.usersByRegion)) {
    const programCount = data.programsByRegion[region] || 0
    const sponsorCount = data.sponsorsByRegion[region] || 0

    // High user count but few programs
    if (userCount > 50 && programCount < 3) {
      opportunities.push({
        region,
        opportunity: 'High user demand with limited programs',
        priority: 'high' as const,
      })
    }

    // Growing user base with no sponsors
    if (userCount > 20 && sponsorCount === 0) {
      opportunities.push({
        region,
        opportunity: 'Untapped sponsorship market',
        priority: 'medium' as const,
      })
    }
  }

  return opportunities
}
