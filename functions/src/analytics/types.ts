/**
 * Analytics Types for Cloud Functions
 * Shared types used across analytics-related Cloud Functions
 */

// Snapshot frequency types
export type SnapshotFrequency = "daily" | "weekly" | "monthly";

// Metric trend direction
export type TrendDirection = "up" | "down" | "stable";

// KPI status levels
export type KPIStatus = "green" | "yellow" | "red";

// Core metrics interface for snapshots
export interface CoreMetrics {
  totalStudents: number;
  activeStudents: number;
  newStudentsThisPeriod: number;
  studentGrowthRate: number;
  totalMentors: number;
  activeMentors: number;
  mentorStudentRatio: number;
  totalOrganizations: number;
  activeOrganizations: number;
  totalPrograms: number;
  programEnrollments: number;
  programCompletions: number;
  completionRate: number;
  totalScholarships: number;
  scholarshipValueAwarded: number;
  totalDonations: number;
  totalSponsors: number;
  averageDonation: number;
  livesImpacted: number;
  progressToGoal: number;
}

// Snapshot document structure
export interface AnalyticsSnapshot {
  id?: string;
  createdAt: FirebaseFirestore.Timestamp;
  frequency: SnapshotFrequency;
  periodStart: FirebaseFirestore.Timestamp;
  periodEnd: FirebaseFirestore.Timestamp;
  metrics: CoreMetrics;
  trends: {
    students: TrendDirection;
    mentors: TrendDirection;
    organizations: TrendDirection;
    programs: TrendDirection;
    donations: TrendDirection;
    impact: TrendDirection;
  };
  generatedBy: "scheduled" | "manual";
}

// KPI Target structure
export interface KPITarget {
  id?: string;
  name: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  thresholds: {
    green: number;
    yellow: number;
    red: number;
  };
  status: KPIStatus;
  lastChecked: FirebaseFirestore.Timestamp;
  trend: TrendDirection;
  trendPercentage: number;
}

// Alert notification structure
export interface AnalyticsAlert {
  id?: string;
  type: "kpi_warning" | "kpi_critical" | "milestone_reached" | "anomaly_detected";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  kpiId?: string;
  metric?: string;
  currentValue?: number;
  thresholdValue?: number;
  createdAt: FirebaseFirestore.Timestamp;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: FirebaseFirestore.Timestamp;
}

// Insight structure for AI-generated insights
export interface AnalyticsInsight {
  id?: string;
  type: "trend" | "recommendation" | "prediction" | "anomaly";
  category: string;
  title: string;
  summary: string;
  details: string;
  confidence: number;
  actionable: boolean;
  suggestedActions?: string[];
  relatedMetrics: string[];
  createdAt: FirebaseFirestore.Timestamp;
  expiresAt?: FirebaseFirestore.Timestamp;
  status: "active" | "dismissed" | "actioned";
}

// Flight Plan 2030 milestone check
export interface MilestoneCheck {
  year: number;
  targetLives: number;
  currentLives: number;
  percentComplete: number;
  onTrack: boolean;
  projectedCompletion: number;
  daysRemaining: number;
}
