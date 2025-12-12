/**
 * Generate Analytics Snapshot Cloud Function
 * Runs on a schedule to collect and aggregate analytics data
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  AnalyticsSnapshot,
  CoreMetrics,
  SnapshotFrequency,
  TrendDirection,
} from "./types";

const db = admin.firestore();

/**
 * Calculate the trend direction based on current and previous values
 */
function calculateTrend(current: number, previous: number): TrendDirection {
  if (previous === 0) return current > 0 ? "up" : "stable";
  const changePercent = ((current - previous) / previous) * 100;
  if (changePercent > 2) return "up";
  if (changePercent < -2) return "down";
  return "stable";
}

/**
 * Get period boundaries based on frequency
 */
function getPeriodBoundaries(frequency: SnapshotFrequency): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  switch (frequency) {
    case "daily":
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      break;
  }

  return { start, end };
}

/**
 * Collect all core metrics from the database
 */
async function collectMetrics(periodStart: Date, periodEnd: Date): Promise<CoreMetrics> {
  const periodStartTimestamp = admin.firestore.Timestamp.fromDate(periodStart);

  // Get student counts
  const studentsSnapshot = await db.collection("users")
    .where("role", "==", "student")
    .get();
  const totalStudents = studentsSnapshot.size;

  const activeStudentsSnapshot = await db.collection("users")
    .where("role", "==", "student")
    .where("status", "==", "active")
    .get();
  const activeStudents = activeStudentsSnapshot.size;

  const newStudentsSnapshot = await db.collection("users")
    .where("role", "==", "student")
    .where("createdAt", ">=", periodStartTimestamp)
    .get();
  const newStudentsThisPeriod = newStudentsSnapshot.size;

  // Get mentor counts
  const mentorsSnapshot = await db.collection("users")
    .where("role", "==", "mentor")
    .get();
  const totalMentors = mentorsSnapshot.size;

  const activeMentorsSnapshot = await db.collection("users")
    .where("role", "==", "mentor")
    .where("status", "==", "active")
    .get();
  const activeMentors = activeMentorsSnapshot.size;

  // Get organization counts
  const orgsSnapshot = await db.collection("organizations").get();
  const totalOrganizations = orgsSnapshot.size;

  const activeOrgsSnapshot = await db.collection("organizations")
    .where("status", "==", "active")
    .get();
  const activeOrganizations = activeOrgsSnapshot.size;

  // Get program metrics
  const programsSnapshot = await db.collection("programs").get();
  const totalPrograms = programsSnapshot.size;

  const enrollmentsSnapshot = await db.collection("enrollments").get();
  const programEnrollments = enrollmentsSnapshot.size;

  const completionsSnapshot = await db.collection("enrollments")
    .where("status", "==", "completed")
    .get();
  const programCompletions = completionsSnapshot.size;

  // Get scholarship metrics
  const scholarshipsSnapshot = await db.collection("scholarships").get();
  const totalScholarships = scholarshipsSnapshot.size;

  let scholarshipValueAwarded = 0;
  const awardedScholarshipsSnapshot = await db.collection("scholarshipApplications")
    .where("status", "==", "awarded")
    .get();
  awardedScholarshipsSnapshot.forEach((doc) => {
    const data = doc.data();
    scholarshipValueAwarded += data.amount || 0;
  });

  // Get donation metrics
  const donationsSnapshot = await db.collection("donations").get();
  const totalDonations = donationsSnapshot.size;

  let totalDonationAmount = 0;
  donationsSnapshot.forEach((doc) => {
    const data = doc.data();
    totalDonationAmount += data.amount || 0;
  });

  // Get sponsor count
  const sponsorsSnapshot = await db.collection("sponsors").get();
  const totalSponsors = sponsorsSnapshot.size;

  // Calculate impact (students reached through all programs)
  const impactDoc = await db.collection("analytics").doc("impact").get();
  const impactData = impactDoc.data();
  const livesImpacted = impactData?.totalLivesImpacted || totalStudents + programCompletions;

  // Calculate derived metrics
  const mentorStudentRatio = totalMentors > 0 ? totalStudents / totalMentors : 0;
  const completionRate = programEnrollments > 0 ? (programCompletions / programEnrollments) * 100 : 0;
  const averageDonation = totalDonations > 0 ? totalDonationAmount / totalDonations : 0;
  const studentGrowthRate = totalStudents > 0 ? (newStudentsThisPeriod / totalStudents) * 100 : 0;

  // Flight Plan 2030 progress (goal: 1,000,000 lives)
  const GOAL_2030 = 1000000;
  const progressToGoal = (livesImpacted / GOAL_2030) * 100;

  return {
    totalStudents,
    activeStudents,
    newStudentsThisPeriod,
    studentGrowthRate,
    totalMentors,
    activeMentors,
    mentorStudentRatio,
    totalOrganizations,
    activeOrganizations,
    totalPrograms,
    programEnrollments,
    programCompletions,
    completionRate,
    totalScholarships,
    scholarshipValueAwarded,
    totalDonations,
    totalSponsors,
    averageDonation,
    livesImpacted,
    progressToGoal,
  };
}

/**
 * Get previous snapshot for trend comparison
 */
async function getPreviousSnapshot(frequency: SnapshotFrequency): Promise<CoreMetrics | null> {
  const previousSnapshot = await db.collection("analyticsSnapshots")
    .where("frequency", "==", frequency)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (previousSnapshot.empty) return null;
  return previousSnapshot.docs[0].data().metrics as CoreMetrics;
}

/**
 * Generate and store analytics snapshot
 */
export async function generateAnalyticsSnapshot(
  frequency: SnapshotFrequency = "daily"
): Promise<AnalyticsSnapshot> {
  const { start: periodStart, end: periodEnd } = getPeriodBoundaries(frequency);

  // Collect current metrics
  const metrics = await collectMetrics(periodStart, periodEnd);

  // Get previous snapshot for trends
  const previousMetrics = await getPreviousSnapshot(frequency);

  // Calculate trends
  const trends = {
    students: previousMetrics
      ? calculateTrend(metrics.totalStudents, previousMetrics.totalStudents)
      : "stable" as TrendDirection,
    mentors: previousMetrics
      ? calculateTrend(metrics.totalMentors, previousMetrics.totalMentors)
      : "stable" as TrendDirection,
    organizations: previousMetrics
      ? calculateTrend(metrics.totalOrganizations, previousMetrics.totalOrganizations)
      : "stable" as TrendDirection,
    programs: previousMetrics
      ? calculateTrend(metrics.totalPrograms, previousMetrics.totalPrograms)
      : "stable" as TrendDirection,
    donations: previousMetrics
      ? calculateTrend(metrics.totalDonations, previousMetrics.totalDonations)
      : "stable" as TrendDirection,
    impact: previousMetrics
      ? calculateTrend(metrics.livesImpacted, previousMetrics.livesImpacted)
      : "stable" as TrendDirection,
  };

  // Create snapshot document
  const snapshot: AnalyticsSnapshot = {
    createdAt: admin.firestore.Timestamp.now(),
    frequency,
    periodStart: admin.firestore.Timestamp.fromDate(periodStart),
    periodEnd: admin.firestore.Timestamp.fromDate(periodEnd),
    metrics,
    trends,
    generatedBy: "scheduled",
  };

  // Store in Firestore
  const docRef = await db.collection("analyticsSnapshots").add(snapshot);
  snapshot.id = docRef.id;

  // Update latest snapshot reference for quick access
  await db.collection("analytics").doc(`latest-${frequency}`).set({
    snapshotId: docRef.id,
    updatedAt: admin.firestore.Timestamp.now(),
  });

  functions.logger.info(`Generated ${frequency} analytics snapshot: ${docRef.id}`);

  return snapshot;
}

/**
 * Scheduled function: Generate daily snapshot at midnight UTC
 */
export const scheduledDailySnapshot = functions.pubsub
  .schedule("0 0 * * *") // Every day at midnight UTC
  .timeZone("UTC")
  .onRun(async () => {
    try {
      const snapshot = await generateAnalyticsSnapshot("daily");
      functions.logger.info("Daily snapshot generated successfully", { snapshotId: snapshot.id });
      return null;
    } catch (error) {
      functions.logger.error("Failed to generate daily snapshot", error);
      throw error;
    }
  });

/**
 * Scheduled function: Generate weekly snapshot every Sunday at midnight UTC
 */
export const scheduledWeeklySnapshot = functions.pubsub
  .schedule("0 0 * * 0") // Every Sunday at midnight UTC
  .timeZone("UTC")
  .onRun(async () => {
    try {
      const snapshot = await generateAnalyticsSnapshot("weekly");
      functions.logger.info("Weekly snapshot generated successfully", { snapshotId: snapshot.id });
      return null;
    } catch (error) {
      functions.logger.error("Failed to generate weekly snapshot", error);
      throw error;
    }
  });

/**
 * Scheduled function: Generate monthly snapshot on the 1st of each month
 */
export const scheduledMonthlySnapshot = functions.pubsub
  .schedule("0 0 1 * *") // 1st day of each month at midnight UTC
  .timeZone("UTC")
  .onRun(async () => {
    try {
      const snapshot = await generateAnalyticsSnapshot("monthly");
      functions.logger.info("Monthly snapshot generated successfully", { snapshotId: snapshot.id });
      return null;
    } catch (error) {
      functions.logger.error("Failed to generate monthly snapshot", error);
      throw error;
    }
  });

/**
 * HTTP function: Manually trigger snapshot generation (admin only)
 */
export const manualSnapshot = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }

  // Check for admin role
  const userDoc = await db.collection("users").doc(context.auth.uid).get();
  const userData = userDoc.data();
  if (!userData || userData.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  const frequency = (data.frequency as SnapshotFrequency) || "daily";

  try {
    const snapshot = await generateAnalyticsSnapshot(frequency);
    // Update to show it was manually generated
    await db.collection("analyticsSnapshots").doc(snapshot.id!).update({
      generatedBy: "manual",
      triggeredBy: context.auth.uid,
    });

    return { success: true, snapshotId: snapshot.id };
  } catch (error) {
    functions.logger.error("Failed to generate manual snapshot", error);
    throw new functions.https.HttpsError("internal", "Failed to generate snapshot");
  }
});
