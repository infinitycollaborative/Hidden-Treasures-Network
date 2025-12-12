/**
 * Analytics Functions Index
 * Re-exports all analytics-related Cloud Functions
 */

// Snapshot generation functions
export {
  scheduledDailySnapshot,
  scheduledWeeklySnapshot,
  scheduledMonthlySnapshot,
  manualSnapshot,
} from "./generateSnapshot";

// KPI checking functions
export {
  scheduledKPICheck,
  manualKPICheck,
} from "./checkKPITargets";

// Insight generation functions
export {
  scheduledInsightGeneration,
  manualInsightGeneration,
  dismissInsight,
} from "./generateInsights";

// Export types for use elsewhere
export * from "./types";
