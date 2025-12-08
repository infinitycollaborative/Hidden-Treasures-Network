/**
 * Mentor Matching Engine (AI-Enhanced)
 * Rule-based matching enhanced with AI insights
 */

import { UserProfile } from '@/types/user'
import { aiGenerateJSON, isAIAvailable, redactPII } from './ai'

export interface MentorMatchInput {
  student: UserProfile       // must have studentProfile
  mentors: UserProfile[]     // mentors with mentorProfile
}

export interface MentorMatchResult {
  mentor: UserProfile
  score: number              // 0-100
  reasons: string[]          // why they match
  aiScore?: number           // AI-generated score if available
  riskFactors?: string[]     // potential concerns
}

export interface AIMatchScore {
  score: number
  reasons: string[]
  riskFactors: string[]
}

/**
 * Compute AI-enhanced match score between student and mentor
 */
export async function computeAIMentorMatch(
  student: UserProfile,
  mentor: UserProfile
): Promise<AIMatchScore | null> {
  if (!isAIAvailable()) {
    return null
  }

  const studentProfile = student.studentProfile
  const mentorProfile = mentor.mentorProfile

  if (!studentProfile || !mentorProfile) {
    return null
  }

  // Redact PII before sending to AI
  const safeStudent = redactPII({
    interests: studentProfile.interests,
    goals: studentProfile.goals,
    grade: studentProfile.grade,
    location: student.location?.state,
  })

  const safeMentor = redactPII({
    specialties: mentorProfile.specialty,
    certifications: mentorProfile.certifications,
    experience: mentorProfile.yearsOfExperience,
    bio: mentorProfile.bio,
  })

  const prompt = `You are an expert aviation/STEM youth mentorship matchmaker.

Student Profile:
${JSON.stringify(safeStudent, null, 2)}

Mentor Profile:
${JSON.stringify(safeMentor, null, 2)}

Evaluate the compatibility based on:
- Shared interests and specialties
- Experience match
- Goals alignment
- Professional background fit

Return a JSON object with this exact structure:
{
  "score": <number between 0-100>,
  "reasons": [<array of 2-4 brief positive match reasons>],
  "riskFactors": [<array of 0-2 potential concerns or empty array>]
}

Be objective and helpful. Focus on educational compatibility.`

  try {
    const result = await aiGenerateJSON<AIMatchScore>(prompt, {
      temperature: 0.3,
      maxTokens: 500,
    })

    if (result && typeof result.score === 'number') {
      return {
        score: Math.max(0, Math.min(100, result.score)),
        reasons: Array.isArray(result.reasons) ? result.reasons : [],
        riskFactors: Array.isArray(result.riskFactors) ? result.riskFactors : [],
      }
    }
  } catch (error) {
    console.error('AI mentor match error:', error)
  }

  return null
}

/**
 * Compute match scores between a student and available mentors
 * Uses hybrid approach: rule-based (60%) + AI (40%)
 */
export async function computeMentorMatchScores(
  input: MentorMatchInput
): Promise<MentorMatchResult[]> {
  const { student, mentors } = input
  const studentProfile = student.studentProfile

  if (!studentProfile) {
    return []
  }

  const results: MentorMatchResult[] = []

  for (const mentor of mentors) {
    const mentorProfile = mentor.mentorProfile
    
    if (!mentorProfile) {
      results.push({
        mentor,
        score: 0,
        reasons: ['No mentor profile available']
      })
      continue
    }

    // Compute rule-based score
    let ruleScore = 0
    const reasons: string[] = []

    // Rule 1: Shared interests/specialties (+40 points max)
    const studentInterests = studentProfile.interests || []
    const mentorSpecialties = mentorProfile.specialty || []
    const sharedInterests = studentInterests.filter(interest =>
      mentorSpecialties.some(specialty => 
        specialty.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(specialty.toLowerCase())
      )
    )
    
    if (sharedInterests.length > 0) {
      const interestScore = Math.min(40, sharedInterests.length * 15)
      ruleScore += interestScore
      reasons.push(`Shared interests: ${sharedInterests.join(', ')}`)
    }

    // Rule 2: Language match (+20 points)
    const studentLanguages = (studentProfile as any).preferredLanguages || []
    const mentorLanguages = (mentorProfile as any).languages || []
    const sharedLanguages = studentLanguages.filter((lang: string) =>
      mentorLanguages.some((mLang: string) => 
        mLang.toLowerCase() === lang.toLowerCase()
      )
    )
    
    if (sharedLanguages.length > 0) {
      ruleScore += 20
      reasons.push(`Speaks: ${sharedLanguages.join(', ')}`)
    }

    // Rule 3: Location/virtual preference match (+20 points)
    const studentLocationPref = (studentProfile as any).locationPreference
    const mentorVirtualOnly = (mentorProfile as any).virtualOnly
    
    if (studentLocationPref === 'virtual' && mentorVirtualOnly) {
      ruleScore += 20
      reasons.push('Both prefer virtual sessions')
    } else if (studentLocationPref === 'in_person' && !mentorVirtualOnly) {
      // Check if in same region
      const studentState = student.location?.state
      const mentorRegions = (mentorProfile as any).inPersonRegions || []
      
      if (studentState && mentorRegions.some((region: string) => 
        region.toLowerCase().includes(studentState.toLowerCase())
      )) {
        ruleScore += 20
        reasons.push('Available for in-person in your area')
      } else {
        ruleScore += 10
        reasons.push('Available for in-person sessions')
      }
    } else if (studentLocationPref === 'both') {
      ruleScore += 15
      reasons.push('Flexible meeting options')
    }

    // Rule 4: Age range preference (+10 points)
    const studentAge = (studentProfile as any).ageRange
    const mentorAgePrefs = (mentorProfile as any).preferredAgeRanges || []
    
    if (studentAge && mentorAgePrefs.includes(studentAge)) {
      ruleScore += 10
      reasons.push('Age range match')
    }

    // Rule 5: Accepting new mentees (required, -50 if not)
    if (!(mentorProfile as any).acceptsNewMentees) {
      ruleScore -= 50
      reasons.push('Not currently accepting new mentees')
    } else {
      reasons.push('Accepting new mentees')
    }

    // Rule 6: Check capacity
    if ((mentorProfile as any).maxMentees && (mentorProfile as any).currentMenteeCount) {
      if ((mentorProfile as any).currentMenteeCount >= (mentorProfile as any).maxMentees) {
        ruleScore -= 30
        reasons.push('At capacity')
      }
    }

    // Clamp rule score between 0 and 100
    ruleScore = Math.max(0, Math.min(100, ruleScore))

    // Try to get AI score
    let aiScore: number | undefined
    let aiReasons: string[] = []
    let riskFactors: string[] = []

    try {
      const aiResult = await computeAIMentorMatch(student, mentor)
      if (aiResult) {
        aiScore = aiResult.score
        aiReasons = aiResult.reasons
        riskFactors = aiResult.riskFactors
        
        // Add AI reasons that aren't duplicates
        aiReasons.forEach(reason => {
          if (!reasons.some(r => r.toLowerCase().includes(reason.toLowerCase()))) {
            reasons.push(`AI: ${reason}`)
          }
        })
      }
    } catch (error) {
      console.error('AI scoring failed for mentor match:', error)
    }

    // Compute final hybrid score: 60% rule-based, 40% AI
    let finalScore = ruleScore
    if (aiScore !== undefined) {
      finalScore = ruleScore * 0.6 + aiScore * 0.4
    }

    finalScore = Math.max(0, Math.min(100, finalScore))

    results.push({
      mentor,
      score: finalScore,
      reasons,
      aiScore,
      riskFactors
    })
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score)
}

/**
 * Helper to get display name from profile
 */
export function getMentorDisplayName(mentor: UserProfile): string {
  if (mentor.firstName && mentor.lastName) {
    return `${mentor.firstName} ${mentor.lastName}`
  }
  return mentor.displayName || mentor.email
}

/**
 * Helper to format availability summary
 */
export function formatAvailabilitySummary(mentor: UserProfile): string {
  const mentorProfile = mentor.mentorProfile
  if (!mentorProfile || !mentorProfile.availability.length) {
    return 'No availability set'
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const slots = mentorProfile.availability.map(slot => {
    const day = days[slot.dayOfWeek]
    return `${day} ${slot.startTime}-${slot.endTime}`
  })

  if (slots.length <= 2) {
    return slots.join(', ')
  }

  return `${slots.slice(0, 2).join(', ')} and more`
}
