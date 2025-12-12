/**
 * Hidden Treasures Network - Cloud Functions
 *
 * This file is the main entry point for all Cloud Functions.
 * Functions are organized by feature area in subdirectories.
 */

import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export Analytics Functions
export {
  // Scheduled snapshot generation
  scheduledDailySnapshot,
  scheduledWeeklySnapshot,
  scheduledMonthlySnapshot,
  manualSnapshot,

  // KPI monitoring
  scheduledKPICheck,
  manualKPICheck,

  // AI-powered insights
  scheduledInsightGeneration,
  manualInsightGeneration,
  dismissInsight,
} from "./analytics";
