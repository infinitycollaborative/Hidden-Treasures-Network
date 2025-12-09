import { Timestamp } from 'firebase/firestore'

/**
 * User Role Types - Phase 11: Extended Admin Hierarchy
 * Phase 14: Added Education Roles
 */
export type UserRole =
  | 'student'
  | 'mentor'
  | 'organization'
  | 'sponsor'
  | 'admin'
  | 'super_admin'
  | 'country_admin'
  | 'regional_admin'
  | 'organization_admin'
  | 'teacher'              // Phase 14: Classroom educator
  | 'school_admin'         // Phase 14: School administrator
  | 'district_admin'       // Phase 14: District administrator

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  eventReminders: boolean
  resourceUpdates: boolean
  mentorMessages: boolean
  systemAnnouncements: boolean
}

/**
 * Base User Interface
 * Common fields shared across all user types
 */
export interface BaseUser {
  id: string
  email: string
  role: UserRole
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  isActive: boolean
  emailVerified: boolean
  notificationPreferences?: NotificationPreferences
}

/**
 * Student Profile
 */
export interface StudentProfile extends BaseUser {
  role: 'student'
  dateOfBirth?: Date
  grade?: string
  school?: string
  interests: string[]
  goals: string[]
  parentGuardianEmail?: string
  parentGuardianPhone?: string
  mentorIds: string[]
  programsEnrolled: string[]
  achievements: Achievement[]
  hoursCompleted: number
}

/**
 * Mentor Profile
 */
export interface MentorProfile extends BaseUser {
  role: 'mentor'
  occupation: string
  company?: string
  specialty: string[]
  certifications: string[]
  yearsOfExperience: number
  bio: string
  availableHours: number
  studentIds: string[]
  organizationIds: string[]
  volunteerHours: number
  socialLinks?: SocialLinks
}

/**
 * Organization Profile
 */
export interface OrganizationProfile extends BaseUser {
  role: 'organization'
  organizationName: string
  type: 'nonprofit' | 'school' | 'company' | 'government' | 'other'
  taxId?: string
  website?: string
  description: string
  foundedYear?: number
  location: Location
  contactPerson: ContactPerson
  programs: Program[]
  memberCount: number
  studentsImpacted: number
  mentorIds: string[]
  sponsorIds: string[]
  socialLinks?: SocialLinks
}

/**
 * Sponsor Profile
 */
export interface SponsorProfile extends BaseUser {
  role: 'sponsor'
  sponsorType: 'individual' | 'corporate' | 'foundation'
  companyName?: string
  website?: string
  description?: string
  contributionLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'custom'
  totalContributed: number
  organizationIds: string[]
  programsSupported: string[]
  impactMetrics: ImpactMetrics
  socialLinks?: SocialLinks
}

/**
 * Admin Profile - Phase 11: Extended for multi-tenant governance
 */
export interface AdminProfile extends BaseUser {
  role: 'admin' | 'super_admin' | 'country_admin' | 'regional_admin' | 'organization_admin'
  permissions: AdminPermission[]
  department?: string
  country?: string // For country_admin
  region?: string // For regional_admin
  organizationId?: string // For organization_admin
  managedCountries?: string[] // For super_admin
  managedRegions?: string[] // For country_admin
  managedOrganizations?: string[] // For regional_admin
}

/**
 * Union type for all user profiles
 */
export type UserProfile =
  | StudentProfile
  | MentorProfile
  | OrganizationProfile
  | SponsorProfile
  | AdminProfile

/**
 * Supporting Types
 */

export interface Location {
  address?: string
  city: string
  state: string
  country: string
  zipCode?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface ContactPerson {
  name: string
  email: string
  phone?: string
  position?: string
}

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  dateEarned: Timestamp
  badgeURL?: string
  issuedBy: string
}

export interface Program {
  id: string
  name: string
  description: string
  category: ProgramCategory
  startDate?: Timestamp
  endDate?: Timestamp
  capacity?: number
  enrolled: number
  status: 'active' | 'inactive' | 'completed'
  imageURL?: string
}

export type ProgramCategory =
  | 'aviation'
  | 'stem'
  | 'entrepreneurship'
  | 'mentorship'
  | 'scholarship'
  | 'workshop'
  | 'other'

export interface ImpactMetrics {
  studentsReached: number
  programsFunded: number
  organizationsSupported: number
  totalHoursSponsored: number
}

export type AdminPermission =
  | 'manage_users'
  | 'manage_organizations'
  | 'manage_programs'
  | 'manage_content'
  | 'view_analytics'
  | 'system_settings'
  | 'super_admin'

/**
 * Authentication Types
 */
export interface AuthUser {
  uid: string
  email: string | null
  emailVerified: boolean
  displayName: string | null
  photoURL: string | null
}

export interface SignUpData {
  email: string
  password: string
  displayName: string
  role: UserRole
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Form Types
 */
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  role?: UserRole
}

export interface JoinFormData {
  firstName: string
  lastName: string
  email: string
  role: UserRole
  organization?: string
  message?: string
}

/**
 * Network Statistics
 */
export interface NetworkStats {
  totalOrganizations: number
  totalMentors: number
  totalStudents: number
  totalSponsors: number
  totalLivesImpacted: number
  totalVolunteerHours: number
  totalProgramsActive: number
  countriesRepresented: number
  lastUpdated: Timestamp
}

/**
 * Map Data Types (for Mapbox integration)
 */
export interface MapMarker {
  id: string
  type: 'organization' | 'event' | 'partner'
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  description?: string
  imageURL?: string
}

/**
 * Event Types
 */
export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  startDate: Timestamp
  endDate: Timestamp
  location: Location | 'virtual'
  organizerId: string
  organizerName: string
  capacity?: number
  registered: number
  imageURL?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isPublic: boolean
}

export type EventCategory =
  | 'workshop'
  | 'webinar'
  | 'conference'
  | 'networking'
  | 'training'
  | 'competition'
  | 'other'

/**
 * Phase 11: Compliance System Types
 */
export interface ComplianceRequirement {
  id: string
  name: string
  appliesTo: ('organization' | 'mentor')[]
  frequency: 'annual' | 'biannual' | 'one-time'
  description: string
  required: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ComplianceSubmission {
  id: string
  orgId: string
  requirementId: string
  requirementName: string
  submittedBy: string
  submittedByName: string
  fileUrl: string
  fileName: string
  status: 'submitted' | 'approved' | 'rejected'
  adminReviewerId?: string
  adminReviewerName?: string
  reviewComments?: string
  expirationDate?: Timestamp
  submittedAt: Timestamp
  reviewedAt?: Timestamp
}

/**
 * Phase 11: Incident Reporting Types
 */
export type IncidentType = 
  | 'safety_violation'
  | 'code_of_conduct'
  | 'harassment'
  | 'abuse_suspicion'
  | 'inappropriate_messages'
  | 'event_safety'
  | 'other'

export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'open' | 'under_review' | 'resolved' | 'closed'

export interface Incident {
  id: string
  type: IncidentType
  priority: IncidentPriority
  status: IncidentStatus
  title: string
  description: string
  location?: string
  organizationId?: string
  organizationName?: string
  eventId?: string
  personsInvolved?: string[]
  minorsInvolved: boolean
  evidenceUrls?: string[]
  reportedBy: string
  reportedByName: string
  reportedByRole: UserRole
  assignedTo?: string
  assignedToName?: string
  notes?: IncidentNote[]
  createdAt: Timestamp
  updatedAt: Timestamp
  resolvedAt?: Timestamp
}

export interface IncidentNote {
  id: string
  userId: string
  userName: string
  note: string
  timestamp: Timestamp
}

/**
 * Phase 11: Audit Log Types
 */
export type AuditAction = 
  | 'admin_role_changed'
  | 'organization_approved'
  | 'organization_suspended'
  | 'organization_activated'
  | 'compliance_approved'
  | 'compliance_rejected'
  | 'user_role_changed'
  | 'user_suspended'
  | 'user_activated'
  | 'incident_created'
  | 'incident_updated'
  | 'incident_resolved'
  | 'sponsor_tier_changed'
  | 'data_edited'
  | 'settings_changed'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  action: AuditAction
  targetId?: string
  targetType?: 'organization' | 'event' | 'session' | 'user' | 'compliance' | 'incident'
  targetName?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Timestamp
}

/**
 * Phase 11: AI Risk Scoring Types
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface RiskScore {
  organizationId: string
  organizationName: string
  score: number // 0-100
  level: RiskLevel
  reasons: string[]
  recommendedActions: string[]
  factors: RiskFactor[]
  calculatedAt: Timestamp
  calculatedBy: 'ai' | 'manual'
  overrideBy?: string
  overrideReason?: string
}

export interface RiskFactor {
  category: string
  weight: number
  description: string
  value: number
}

/**
 * Phase 11: Admin Communication Types
 */
export type MessageAudience = 
  | 'network_wide'
  | 'country'
  | 'region'
  | 'organization'
  | 'role_specific'

export interface AdminMessage {
  id: string
  title: string
  content: string
  audience: MessageAudience
  targetCountries?: string[]
  targetRegions?: string[]
  targetOrganizations?: string[]
  targetRoles?: UserRole[]
  senderId: string
  senderName: string
  deliveryChannels: ('in_app' | 'email' | 'sms')[]
  scheduledFor?: Timestamp
  sentAt?: Timestamp
  readBy?: string[]
  createdAt: Timestamp
}

/**
 * Phase 11: Enhanced Organization Types
 */
export interface OrganizationHealth {
  complianceScore: number // 0-100
  riskScore: number // 0-100
  riskLevel: RiskLevel
  engagementScore: number // 0-100
  lastActivityDate?: Timestamp
  activeStudents: number
  activeMentors: number
  eventsThisMonth: number
  sessionsThisMonth: number
  complianceIssues: string[]
  riskFactors: string[]
}

/**
 * Phase 13: Gamification System Types
 */

// XP System Types
export type XPCategory =
  | 'badges'      // Earned from badge awards
  | 'sessions'    // Earned from mentor sessions
  | 'programs'    // Earned from program participation
  | 'quests'      // Earned from completing quests
  | 'events'      // Earned from event attendance
  | 'mentoring'   // Earned from mentoring others
  | 'other'       // Other sources

export interface UserXP {
  id: string
  userId: string
  totalXP: number
  level: number
  currentLevelXP: number // XP in current level (resets each level)
  xpBreakdown: {
    badges: number
    sessions: number
    programs: number
    quests: number
    events: number
    mentoring: number
    other: number
  }
  updatedAt: Timestamp
  createdAt: Timestamp
}

export interface XPTransaction {
  id: string
  userId: string
  amount: number // Can be positive or negative
  category: XPCategory
  reason: string
  sourceId?: string // ID of badge, quest, session, etc.
  timestamp: Timestamp
  metadata?: Record<string, any>
}

// Badge System Types
export type BadgeCategory =
  | 'tuskegee_tribute'   // Honoring Tuskegee Airmen legacy
  | 'hidden_treasures'   // HTN-specific achievements
  | 'flight_milestones'  // Flight training achievements
  | 'community'          // Community engagement
  | 'mentorship'         // Mentoring achievements
  | 'education'          // Educational milestones
  | 'leadership'         // Leadership achievements
  | 'innovation'         // Innovation & creativity
  | 'special'            // Special/rare achievements

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  category: BadgeCategory
  tier: BadgeTier
  imageURL: string
  xpReward: number

  // Requirements
  requirements: {
    minLevel?: number
    minAge?: number
    maxAge?: number
    requiredRole?: UserRole[]
    prerequisiteBadges?: string[] // IDs of badges required first
    customCondition?: string // Description of custom requirement
  }

  // Metadata
  isActive: boolean
  isSecret: boolean // Hidden until earned
  rarityScore: number // 1-100, how rare this badge is
  realWorldEquivalent?: string // e.g., "FAA Private Pilot License"
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  badgeName: string
  badgeCategory: BadgeCategory
  badgeTier: BadgeTier
  imageURL: string
  xpAwarded: number
  reason: string // Why was this badge awarded
  awardedBy?: string // User ID who awarded (if manual)
  awardedAt: Timestamp
  metadata?: Record<string, any>
}

// Quest System Types
export type QuestType = 'daily' | 'weekly' | 'monthly' | 'special' | 'ongoing'
export type QuestStatus = 'available' | 'in_progress' | 'completed' | 'expired'
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface QuestRequirement {
  type: 'attend_event' | 'complete_session' | 'earn_badge' | 'reach_level' | 'custom'
  target: number
  current?: number
  description: string
  metadata?: Record<string, any>
}

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  difficulty: QuestDifficulty

  // Rewards
  xpReward: number
  badgeReward?: string // Badge ID awarded upon completion

  // Requirements
  requirements: QuestRequirement[]
  minLevel?: number
  maxLevel?: number
  eligibleRoles: UserRole[]

  // Timing
  startDate?: Timestamp
  endDate?: Timestamp

  // Metadata
  isActive: boolean
  participantCount: number
  completionCount: number
  imageURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserQuest {
  id: string
  userId: string
  questId: string
  questTitle: string
  status: QuestStatus
  progress: QuestRequirement[] // Copy of requirements with current values
  startedAt: Timestamp
  completedAt?: Timestamp
  expiresAt?: Timestamp
}

// Leaderboard Types
export type LeaderboardType =
  | 'global'          // All users
  | 'regional'        // By country/region
  | 'organizational'  // By organization
  | 'age_group'       // By age bracket
  | 'program'         // By program participation

export type LeaderboardPeriod = 'all_time' | 'monthly' | 'weekly' | 'daily'

export interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  photoURL?: string
  totalXP: number
  level: number
  badgeCount: number
  change?: number // Rank change from previous period (positive = moved up)
}

export interface Leaderboard {
  id: string
  type: LeaderboardType
  period: LeaderboardPeriod
  scope?: string // Country code, organization ID, program ID, etc.
  entries: LeaderboardEntry[]
  totalParticipants: number
  lastUpdated: Timestamp
  metadata?: Record<string, any>
}

/**
 * Phase 14: School & Classroom Integration Types
 */

// School District Types
export type DistrictType = 'public' | 'private' | 'charter' | 'independent'

export interface District {
  id: string
  name: string
  type: DistrictType
  location: Location
  contactPerson: ContactPerson

  // Metadata
  studentCount: number
  schoolCount: number
  teacherCount: number

  // Settings
  settings: {
    requireBackgroundChecks: boolean
    parentalConsentRequired: boolean
    dataRetentionDays: number
    allowDataSharing: boolean
  }

  // Status
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// School Types
export type SchoolType = 'elementary' | 'middle' | 'high' | 'k12' | 'alternative'
export type SchoolStatus = 'active' | 'inactive' | 'pending_approval'

export interface School {
  id: string
  districtId?: string
  name: string
  type: SchoolType
  status: SchoolStatus

  // Location
  location: Location

  // Contact
  contactPerson: ContactPerson
  principalName?: string
  principalEmail?: string

  // Metadata
  studentCount: number
  teacherCount: number
  classroomCount: number
  gradeRange: {
    min: string // e.g., "K", "1", "9"
    max: string // e.g., "5", "8", "12"
  }

  // Settings
  settings: {
    enableGamification: boolean
    requireParentalConsent: boolean
    allowDataSharing: boolean
    autoEnrollStudents: boolean
  }

  // Administrators
  adminIds: string[] // school_admin user IDs

  // Status
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Classroom Types
export type ClassroomStatus = 'active' | 'archived' | 'draft'

export interface Classroom {
  id: string
  schoolId: string
  districtId?: string

  // Basic Info
  name: string
  subject?: string
  gradeLevel?: string
  academicYear: string // e.g., "2024-2025"
  semester?: 'fall' | 'spring' | 'summer' | 'full_year'

  // Teacher
  teacherId: string
  teacherName: string

  // Join Code
  joinCode: string // 6-character unique code
  joinCodeExpiresAt?: Timestamp
  allowJoinRequests: boolean

  // Students
  studentIds: string[]
  maxStudents?: number

  // Curriculum
  moduleIds: string[] // Assigned curriculum modules

  // Settings
  settings: {
    enableGamification: boolean
    xpMultiplier: number // Default 1.0, can boost XP for activities
    allowPeerReview: boolean
    requireModuleCompletion: boolean
  }

  // Status
  status: ClassroomStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Classroom Roster Types
export type EnrollmentStatus = 'active' | 'dropped' | 'completed' | 'pending'

export interface ClassroomRoster {
  id: string
  classroomId: string
  studentId: string
  studentName: string

  // Enrollment
  enrollmentStatus: EnrollmentStatus
  enrolledAt: Timestamp
  droppedAt?: Timestamp
  completedAt?: Timestamp

  // Parental Consent (FERPA)
  parentalConsentGiven: boolean
  parentalConsentDate?: Timestamp
  parentGuardianEmail?: string

  // Progress
  modulesCompleted: string[]
  totalXPEarned: number
  attendancePercentage: number

  // Notes
  teacherNotes?: string

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Curriculum Module Types
export type ModuleDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type ModuleStatus = 'draft' | 'published' | 'archived'
export type ModuleType = 'lesson' | 'assignment' | 'quiz' | 'project' | 'assessment'

export interface CurriculumModule {
  id: string

  // Basic Info
  title: string
  description: string
  type: ModuleType
  difficulty: ModuleDifficulty

  // Content
  content: string // Markdown or HTML
  resources: {
    type: 'video' | 'pdf' | 'link' | 'file'
    title: string
    url: string
  }[]

  // Learning Objectives
  objectives: string[]

  // Requirements
  prerequisites: string[] // Module IDs
  estimatedDuration: number // minutes

  // Gamification
  xpReward: number
  badgeReward?: string // Badge ID

  // Grading
  isGraded: boolean
  passingScore?: number // Percentage (0-100)

  // Metadata
  subject: string
  gradeLevel: string[]
  tags: string[]

  // Creator
  createdBy: string
  createdByName: string

  // Status
  status: ModuleStatus
  publishedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Module Assignment Types
export type AssignmentStatus = 'assigned' | 'in_progress' | 'submitted' | 'graded'

export interface ModuleAssignment {
  id: string
  classroomId: string
  moduleId: string
  moduleName: string

  // Assignment
  assignedBy: string // Teacher ID
  assignedTo: string[] // Student IDs (empty = all students)

  // Dates
  assignedAt: Timestamp
  dueDate?: Timestamp
  availableFrom?: Timestamp
  availableUntil?: Timestamp

  // Settings
  allowLateSubmission: boolean
  lateSubmissionPenalty?: number // Percentage
  maxAttempts?: number

  // Status
  status: AssignmentStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Student Progress Types
export type ProgressStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'completed'

export interface StudentProgress {
  id: string
  studentId: string
  classroomId: string
  moduleId: string
  assignmentId?: string

  // Progress
  status: ProgressStatus
  progressPercentage: number // 0-100

  // Timestamps
  startedAt?: Timestamp
  submittedAt?: Timestamp
  gradedAt?: Timestamp
  completedAt?: Timestamp

  // Submission
  submissionData?: {
    answers: Record<string, any>
    files: string[]
    notes: string
  }

  // Grading
  score?: number // Percentage (0-100)
  feedback?: string
  gradedBy?: string // Teacher ID

  // Gamification
  xpAwarded?: number
  badgesAwarded?: string[]

  // Attempts
  attemptNumber: number
  maxAttempts?: number

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Parental Consent Types (FERPA Compliance)
export type ConsentStatus = 'pending' | 'granted' | 'denied' | 'expired'

export interface ParentalConsent {
  id: string
  studentId: string
  studentName: string

  // Parent/Guardian
  parentGuardianName: string
  parentGuardianEmail: string
  parentGuardianPhone?: string
  relationship: 'parent' | 'guardian' | 'other'

  // Consent
  consentStatus: ConsentStatus
  consentDate?: Timestamp
  expirationDate?: Timestamp

  // Scope
  schoolId?: string
  districtId?: string
  classroomIds: string[]

  // Permissions
  permissions: {
    allowDataCollection: boolean
    allowDataSharing: boolean
    allowThirdPartyTools: boolean
    allowPhotography: boolean
    allowPublicDisplay: boolean
  }

  // Verification
  ipAddress?: string
  verificationMethod: 'email' | 'phone' | 'in_person' | 'mail'
  verificationToken?: string

  // Notes
  notes?: string

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Teacher Profile Extension
export interface TeacherProfile extends BaseUser {
  role: 'teacher'

  // Credentials
  certifications: string[]
  yearsOfExperience: number
  education: {
    degree: string
    institution: string
    year: number
  }[]

  // Teaching
  subjects: string[]
  gradeLevels: string[]
  schoolId?: string
  districtId?: string

  // Background Check
  backgroundCheckStatus: 'pending' | 'approved' | 'denied' | 'expired'
  backgroundCheckDate?: Timestamp
  backgroundCheckExpiresAt?: Timestamp

  // Classrooms
  classroomIds: string[]

  // Settings
  preferences: {
    emailNotifications: boolean
    gradeReminderFrequency: 'daily' | 'weekly' | 'never'
    studentProgressReports: 'weekly' | 'monthly' | 'quarterly'
  }
}

// School Admin Profile Extension
export interface SchoolAdminProfile extends BaseUser {
  role: 'school_admin'

  schoolId: string
  schoolName: string
  districtId?: string

  // Permissions
  permissions: {
    manageTeachers: boolean
    manageStudents: boolean
    manageClassrooms: boolean
    viewReports: boolean
    manageCurriculum: boolean
  }

  // Background Check
  backgroundCheckStatus: 'pending' | 'approved' | 'denied' | 'expired'
  backgroundCheckDate?: Timestamp
}

// District Admin Profile Extension
export interface DistrictAdminProfile extends BaseUser {
  role: 'district_admin'

  districtId: string
  districtName: string

  // Permissions
  permissions: {
    manageSchools: boolean
    manageStaff: boolean
    viewAllReports: boolean
    managePolicies: boolean
    manageIntegrations: boolean
  }
}

// Update UserProfile union type
export type UserProfileExtended =
  | StudentProfile
  | MentorProfile
  | OrganizationProfile
  | SponsorProfile
  | AdminProfile
  | TeacherProfile
  | SchoolAdminProfile
  | DistrictAdminProfile

/**
 * Phase 15: Marketplace & Funding Exchange Types
 */

// Scholarship Types
export type ScholarshipType = 'one-time' | 'recurring' | 'full-tuition' | 'partial-tuition' | 'equipment' | 'program-specific'
export type ScholarshipStatus = 'draft' | 'open' | 'closed' | 'awarded' | 'completed'
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'awarded'

export interface Scholarship {
  id: string

  // Basic Info
  name: string
  description: string
  type: ScholarshipType
  amount: number // USD cents
  currency: string // Default: 'usd'

  // Sponsor
  sponsorId: string
  sponsorName: string
  sponsorType: 'individual' | 'corporate' | 'foundation'

  // Eligibility
  eligibility: {
    minAge?: number
    maxAge?: number
    gradeLevel?: string[]
    location?: string[] // Countries or states
    gpa?: number // Minimum GPA
    flightHours?: number // Minimum flight hours
    requireEssay: boolean
    requireRecommendation: boolean
    requireTranscript: boolean
    customRequirements?: string[]
  }

  // Application Period
  applicationPeriod: {
    startDate: Timestamp
    endDate: Timestamp
    notificationDate?: Timestamp
  }

  // Funding
  totalFunding: number // Total amount available (cents)
  numberOfAwards: number // How many scholarships to award
  remainingFunding: number // Amount left (cents)

  // Applications
  applicationCount: number
  awardedCount: number
  applicationIds: string[]

  // Settings
  isRecurring: boolean // Multi-year commitment
  renewalCriteria?: string
  disbursementSchedule?: {
    type: 'one-time' | 'monthly' | 'quarterly' | 'semester'
    payments: number // Number of payments
  }

  // Status
  status: ScholarshipStatus
  createdAt: Timestamp
  updatedAt: Timestamp
  publishedAt?: Timestamp
}

export interface ScholarshipApplication {
  id: string
  scholarshipId: string
  scholarshipName: string

  // Applicant
  studentId: string
  studentName: string
  studentEmail: string

  // Application Data
  personalStatement: string
  essay?: string
  transcript?: string // File URL
  recommendationLetters?: string[] // File URLs
  additionalDocuments?: string[]

  // Student Info
  age: number
  gradeLevel: string
  gpa?: number
  flightHours?: number
  achievements: string[]

  // Status
  status: ApplicationStatus
  submittedAt?: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string // Admin/sponsor ID
  reviewNotes?: string
  awardedAt?: Timestamp
  awardAmount?: number // May be less than scholarship amount

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Funding Request Types
export type FundingRequestType = 'equipment' | 'program' | 'event' | 'infrastructure' | 'general'
export type FundingRequestStatus = 'draft' | 'pending' | 'approved' | 'funded' | 'in_progress' | 'completed' | 'rejected'
export type FundingUrgency = 'low' | 'medium' | 'high' | 'critical'

export interface FundingRequest {
  id: string

  // Requester
  requesterId: string
  requesterName: string
  requesterType: 'school' | 'organization' | 'teacher' | 'district'
  schoolId?: string
  districtId?: string
  organizationId?: string

  // Request Details
  title: string
  description: string
  type: FundingRequestType
  urgency: FundingUrgency

  // Funding
  targetAmount: number // USD cents
  currentAmount: number // Amount raised so far
  currency: string // Default: 'usd'

  // Timeline
  deadline?: Timestamp
  startDate?: Timestamp
  completionDate?: Timestamp

  // Impact
  studentsImpacted: number
  programsImpacted: string[]
  expectedOutcomes: string[]

  // Items (for equipment requests)
  items?: {
    name: string
    quantity: number
    unitCost: number
    totalCost: number
    vendor?: string
    specifications?: string
  }[]

  // Supporters
  sponsorIds: string[] // Sponsors who funded
  donationIds: string[] // Individual donations

  // Documentation
  budgetBreakdown?: string // File URL
  supportingDocuments?: string[]
  images?: string[]

  // Status & Review
  status: FundingRequestStatus
  approvedBy?: string // Admin ID
  approvedAt?: Timestamp
  rejectionReason?: string

  // Updates
  updates: {
    id: string
    message: string
    postedBy: string
    postedByName: string
    postedAt: Timestamp
    imageUrls?: string[]
  }[]

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Sponsorship Types (Payment/Commitment)
export type SponsorshipType = 'scholarship' | 'funding_request' | 'program' | 'student' | 'general'
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
export type CommitmentType = 'one-time' | 'monthly' | 'quarterly' | 'annually' | 'multi-year'

export interface Sponsorship {
  id: string

  // Sponsor
  sponsorId: string
  sponsorName: string
  sponsorEmail: string

  // What's being sponsored
  type: SponsorshipType
  targetId?: string // Scholarship ID, funding request ID, student ID, etc.
  targetName?: string

  // Financial
  amount: number // USD cents
  currency: string
  commitmentType: CommitmentType
  totalCommitment?: number // For recurring (total over all payments)

  // Stripe
  stripePaymentIntentId?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string // For recurring

  // Payment
  paymentStatus: PaymentStatus
  paymentMethod?: string // 'card', 'bank_transfer', 'check'
  transactionFee: number // Platform fee (cents)
  netAmount: number // Amount after fees

  // Recurring Details
  isRecurring: boolean
  recurringUntil?: Timestamp
  nextPaymentDate?: Timestamp
  paymentCount?: number // Payments made so far
  totalPayments?: number // Total payments planned

  // Tax Receipt
  taxReceiptId?: string
  taxReceiptSent: boolean

  // Impact Tracking
  impact: {
    studentsSponsored: number
    certificationsAwarded: number
    flightHoursCompleted: number
    badgesEarned: number
    modulesCompleted: number
    eventsAttended: number
  }

  // Visibility
  isAnonymous: boolean
  displayName?: string // If anonymous, show this instead

  // Status
  isActive: boolean
  cancelledAt?: Timestamp
  cancelReason?: string

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Impact Report Types
export type ReportPeriod = 'monthly' | 'quarterly' | 'annually' | 'custom'
export type ReportStatus = 'draft' | 'pending_review' | 'published' | 'archived'

export interface ImpactReport {
  id: string

  // Sponsor & Scope
  sponsorId: string
  sponsorName: string
  sponsorshipIds: string[] // All sponsorships included in this report

  // Period
  period: ReportPeriod
  startDate: Timestamp
  endDate: Timestamp

  // Overall Metrics
  totalContributed: number // USD cents
  totalStudentsImpacted: number
  totalSchoolsSupported: number
  totalProgramsFunded: number

  // Detailed Metrics
  metrics: {
    // Students
    newStudentsEnrolled: number
    activeStudents: number
    studentRetentionRate: number

    // Academic Progress (Phase 14)
    modulesCompleted: number
    averageGrade: number
    certificationsAwarded: number

    // Gamification (Phase 13)
    totalXPAwarded: number
    badgesEarned: number
    averageStudentLevel: number
    questsCompleted: number

    // Flight Training
    flightHoursCompleted: number
    soloFlights: number
    checkrides: number

    // Events & Engagement
    eventsHosted: number
    eventAttendance: number
    mentorSessionsHeld: number
  }

  // Student Stories (anonymized if needed)
  stories: {
    studentId: string
    studentName: string // Or "Anonymous Student"
    age?: number
    achievement: string
    quote?: string
    imageUrl?: string
  }[]

  // Program Updates
  programUpdates: {
    programId: string
    programName: string
    update: string
    imageUrls?: string[]
  }[]

  // Financial Breakdown
  financialBreakdown: {
    scholarshipsAwarded: number
    equipmentPurchased: number
    programOperations: number
    events: number
    other: number
  }

  // Goals Progress
  goalsProgress?: {
    goal: string
    target: number
    achieved: number
    unit: string // 'students', 'hours', 'certifications', etc.
  }[]

  // Status
  status: ReportStatus
  generatedAt: Timestamp
  publishedAt?: Timestamp
  sentToSponsor: boolean
  sentAt?: Timestamp

  createdAt: Timestamp
  updatedAt: Timestamp
}

// Tax Receipt Types
export type TaxReceiptStatus = 'pending' | 'generated' | 'sent' | 'failed'

export interface TaxReceipt {
  id: string

  // Donor
  sponsorId: string
  sponsorName: string
  sponsorEmail: string
  sponsorAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
  }

  // Organization (Hidden Treasures Network)
  organizationName: string
  organizationEIN: string // Tax ID
  organizationAddress: {
    line1: string
    city: string
    state: string
    zip: string
    country: string
  }

  // Donation Details
  sponsorshipIds: string[]
  totalAmount: number // USD cents
  taxYear: number
  receiptNumber: string // Unique receipt number

  // Breakdown
  donations: {
    date: Timestamp
    amount: number
    description: string
    sponsorshipId: string
  }[]

  // Status
  status: TaxReceiptStatus
  pdfUrl?: string
  generatedAt?: Timestamp
  sentAt?: Timestamp

  createdAt: Timestamp
  updatedAt: Timestamp
}

// AI Sponsor Matching Types
export interface SponsorMatch {
  id: string

  // What's being matched
  targetType: 'scholarship' | 'funding_request' | 'program' | 'student'
  targetId: string
  targetName: string
  targetDescription: string

  // Potential sponsors (ranked by match score)
  matches: {
    sponsorId: string
    sponsorName: string
    sponsorType: 'individual' | 'corporate' | 'foundation'
    matchScore: number // 0-100
    reasons: string[] // Why this is a good match
    pastContributions: number
    interests: string[]
  }[]

  // AI Analysis
  aiAnalysis: {
    targetKeywords: string[]
    targetCategories: string[]
    recommendedSponsorTypes: ('individual' | 'corporate' | 'foundation')[]
    suggestedAskAmount: number
    confidenceScore: number
  }

  // Status
  generatedAt: Timestamp
  generatedBy: 'ai' | 'manual'
  reviewedBy?: string
  approvedMatches?: string[] // Sponsor IDs approved for outreach
}

