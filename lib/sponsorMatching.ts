/**
 * Sponsor Matching Engine
 * AI-powered matching between sponsors and programs/organizations
 */

import { aiGenerateJSON, isAIAvailable, redactPII } from './ai'
import type { Sponsor } from '@/types/sponsor'

export interface SponsorMatchInput {
  sponsor: Sponsor
  targetType: 'organization' | 'program' | 'region' | 'event'
  target: any // Organization, Program, Region, or Event data
}

export interface SponsorMatchResult {
  score: number // 0-100
  alignment: string[] // Why they match
  opportunities: string[] // Potential collaboration areas
  risks: string[] // Potential concerns
}

/**
 * Compute AI-powered match score between sponsor and program/organization
 */
export async function computeSponsorMatch(
  input: SponsorMatchInput
): Promise<SponsorMatchResult | null> {
  if (!isAIAvailable()) {
    return computeFallbackSponsorMatch(input)
  }

  const { sponsor, targetType, target } = input

  // Redact PII before sending to AI
  const safeSponsor = redactPII({
    orgName: sponsor.orgName,
    tierId: sponsor.tierId,
    totalContributions: sponsor.totalContributions,
    region: sponsor.region,
    programSupport: sponsor.programSupport,
    companyDescription: sponsor.companyDescription,
  })

  const safeTarget = redactPII(target)

  const prompt = `You are an expert corporate sponsorship and partnership matchmaker for aviation/STEM education programs.

Sponsor Profile:
${JSON.stringify(safeSponsor, null, 2)}

${targetType === 'organization' ? 'Organization' : targetType === 'program' ? 'Program' : targetType === 'event' ? 'Event' : 'Region'} Details:
${JSON.stringify(safeTarget, null, 2)}

Evaluate the sponsorship fit based on:
- Mission alignment and values match
- Geographic reach and coverage
- Program type compatibility
- Impact measurement potential
- CSR goals alignment
- Budget and funding level appropriateness
- Long-term partnership potential

Return a JSON object with this exact structure:
{
  "score": <number between 0-100>,
  "alignment": [<array of 2-4 key alignment factors>],
  "opportunities": [<array of 2-4 collaboration opportunities>],
  "risks": [<array of 0-2 potential concerns or empty array>]
}

Be objective, strategic, and focus on mutual value creation.`

  try {
    const result = await aiGenerateJSON<SponsorMatchResult>(prompt, {
      temperature: 0.4,
      maxTokens: 600,
    })

    if (result && typeof result.score === 'number') {
      return {
        score: Math.max(0, Math.min(100, result.score)),
        alignment: Array.isArray(result.alignment) ? result.alignment : [],
        opportunities: Array.isArray(result.opportunities) ? result.opportunities : [],
        risks: Array.isArray(result.risks) ? result.risks : [],
      }
    }
  } catch (error) {
    console.error('AI sponsor match error:', error)
  }

  // Fallback to rule-based if AI fails
  return computeFallbackSponsorMatch(input)
}

/**
 * Fallback rule-based sponsor matching when AI is unavailable
 */
function computeFallbackSponsorMatch(
  input: SponsorMatchInput
): SponsorMatchResult {
  const { sponsor, targetType, target } = input
  let score = 50 // Base score
  const alignment: string[] = []
  const opportunities: string[] = []
  const risks: string[] = []

  // Region match
  if (sponsor.region && target.location?.state) {
    if (sponsor.region.toLowerCase().includes(target.location.state.toLowerCase())) {
      score += 20
      alignment.push('Geographic alignment')
    }
  }

  // Program type match
  if (sponsor.programSupport && target.category) {
    const sponsorInterests = sponsor.programSupport.toLowerCase()
    const targetCategory = target.category.toLowerCase()
    
    if (sponsorInterests.includes(targetCategory)) {
      score += 15
      alignment.push('Program type match')
    }
  }

  // Size/scale match based on contribution level
  const contributionLevel = sponsor.totalContributions
  if (targetType === 'organization') {
    if (contributionLevel > 500000 && target.studentsImpacted > 1000) {
      score += 10
      alignment.push('Scale compatibility')
    } else if (contributionLevel > 100000 && target.studentsImpacted > 100) {
      score += 5
      alignment.push('Appropriate program size')
    }
  }

  // Add generic opportunities
  opportunities.push('Brand visibility and recognition')
  opportunities.push('Impact measurement and reporting')
  
  if (targetType === 'organization') {
    opportunities.push('Direct student engagement opportunities')
  }

  // Check for potential risks
  if (contributionLevel < 10000 && target.studentsImpacted > 500) {
    risks.push('Funding level may be below program needs')
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    alignment,
    opportunities,
    risks,
  }
}

/**
 * Find best sponsor matches for a target (organization, program, etc.)
 */
export async function findBestSponsorsForTarget(
  sponsors: Sponsor[],
  targetType: SponsorMatchInput['targetType'],
  target: any
): Promise<Array<{ sponsor: Sponsor; match: SponsorMatchResult }>> {
  const results = await Promise.all(
    sponsors.map(async (sponsor) => {
      const match = await computeSponsorMatch({
        sponsor,
        targetType,
        target,
      })
      
      return {
        sponsor,
        match: match || computeFallbackSponsorMatch({ sponsor, targetType, target }),
      }
    })
  )

  // Sort by score descending
  return results.sort((a, b) => b.match.score - a.match.score)
}

/**
 * Find best programs/organizations for a sponsor
 */
export async function findBestTargetsForSponsor(
  sponsor: Sponsor,
  targets: Array<{ type: SponsorMatchInput['targetType']; data: any }>
): Promise<Array<{ target: any; match: SponsorMatchResult; type: string }>> {
  const results = await Promise.all(
    targets.map(async ({ type, data }) => {
      const match = await computeSponsorMatch({
        sponsor,
        targetType: type,
        target: data,
      })
      
      return {
        target: data,
        type,
        match: match || computeFallbackSponsorMatch({ sponsor, targetType: type, target: data }),
      }
    })
  )

  // Sort by score descending
  return results.sort((a, b) => b.match.score - a.match.score)
}
