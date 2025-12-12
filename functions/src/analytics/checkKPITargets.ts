/**
 * Check KPI Targets Cloud Function
 * Evaluates KPI targets and generates alerts when thresholds are crossed
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  KPITarget,
  KPIStatus,
  TrendDirection,
  AnalyticsAlert,
  MilestoneCheck,
} from "./types";

const db = admin.firestore();

/**
 * Calculate KPI status based on current value and thresholds
 */
function calculateKPIStatus(
  currentValue: number,
  targetValue: number,
  thresholds: { green: number; yellow: number; red: number }
): KPIStatus {
  const percentOfTarget = (currentValue / targetValue) * 100;

  if (percentOfTarget >= thresholds.green) return "green";
  if (percentOfTarget >= thresholds.yellow) return "yellow";
  return "red";
}

/**
 * Calculate trend based on historical values
 */
function calculateTrendFromHistory(values: number[]): { direction: TrendDirection; percentage: number } {
  if (values.length < 2) {
    return { direction: "stable", percentage: 0 };
  }

  const recent = values[values.length - 1];
  const previous = values[values.length - 2];

  if (previous === 0) {
    return { direction: recent > 0 ? "up" : "stable", percentage: 100 };
  }

  const percentChange = ((recent - previous) / previous) * 100;

  let direction: TrendDirection;
  if (percentChange > 2) direction = "up";
  else if (percentChange < -2) direction = "down";
  else direction = "stable";

  return { direction, percentage: Math.abs(percentChange) };
}

/**
 * Get current value for a KPI metric from the database
 */
async function getMetricValue(metricKey: string): Promise<number> {
  switch (metricKey) {
    case "total_students": {
      const snapshot = await db.collection("users").where("role", "==", "student").get();
      return snapshot.size;
    }
    case "active_students": {
      const snapshot = await db.collection("users")
        .where("role", "==", "student")
        .where("status", "==", "active")
        .get();
      return snapshot.size;
    }
    case "total_mentors": {
      const snapshot = await db.collection("users").where("role", "==", "mentor").get();
      return snapshot.size;
    }
    case "total_organizations": {
      const snapshot = await db.collection("organizations").get();
      return snapshot.size;
    }
    case "program_completions": {
      const snapshot = await db.collection("enrollments").where("status", "==", "completed").get();
      return snapshot.size;
    }
    case "total_donations": {
      const snapshot = await db.collection("donations").get();
      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().amount || 0;
      });
      return total;
    }
    case "scholarship_value": {
      const snapshot = await db.collection("scholarshipApplications")
        .where("status", "==", "awarded")
        .get();
      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().amount || 0;
      });
      return total;
    }
    case "lives_impacted": {
      const impactDoc = await db.collection("analytics").doc("impact").get();
      return impactDoc.data()?.totalLivesImpacted || 0;
    }
    case "mentor_student_ratio": {
      const students = await db.collection("users").where("role", "==", "student").get();
      const mentors = await db.collection("users").where("role", "==", "mentor").get();
      return mentors.size > 0 ? students.size / mentors.size : 0;
    }
    case "program_completion_rate": {
      const enrollments = await db.collection("enrollments").get();
      const completions = await db.collection("enrollments")
        .where("status", "==", "completed")
        .get();
      return enrollments.size > 0 ? (completions.size / enrollments.size) * 100 : 0;
    }
    default:
      functions.logger.warn(`Unknown metric key: ${metricKey}`);
      return 0;
  }
}

/**
 * Create an alert for KPI threshold crossing
 */
async function createAlert(
  kpi: KPITarget,
  previousStatus: KPIStatus,
  newStatus: KPIStatus
): Promise<void> {
  // Only create alerts for status changes to yellow or red
  if (newStatus === "green" && previousStatus !== "green") {
    // KPI recovered - create info alert
    const alert: Omit<AnalyticsAlert, "id"> = {
      type: "kpi_warning",
      severity: "info",
      title: `${kpi.name} has recovered`,
      message: `The KPI "${kpi.name}" has returned to healthy status (${kpi.currentValue} ${kpi.unit}).`,
      kpiId: kpi.id,
      metric: kpi.name,
      currentValue: kpi.currentValue,
      thresholdValue: kpi.thresholds.green,
      createdAt: admin.firestore.Timestamp.now(),
      acknowledged: false,
    };
    await db.collection("analyticsAlerts").add(alert);
    functions.logger.info(`KPI recovered: ${kpi.name}`);
    return;
  }

  if (newStatus === "yellow" && previousStatus !== "yellow") {
    const alert: Omit<AnalyticsAlert, "id"> = {
      type: "kpi_warning",
      severity: "warning",
      title: `${kpi.name} needs attention`,
      message: `The KPI "${kpi.name}" has dropped to warning level (${kpi.currentValue} ${kpi.unit}). ` +
        `Target: ${kpi.targetValue} ${kpi.unit}.`,
      kpiId: kpi.id,
      metric: kpi.name,
      currentValue: kpi.currentValue,
      thresholdValue: kpi.thresholds.yellow,
      createdAt: admin.firestore.Timestamp.now(),
      acknowledged: false,
    };
    await db.collection("analyticsAlerts").add(alert);
    functions.logger.warn(`KPI warning: ${kpi.name}`);
    return;
  }

  if (newStatus === "red") {
    const alert: Omit<AnalyticsAlert, "id"> = {
      type: "kpi_critical",
      severity: "critical",
      title: `${kpi.name} is critical`,
      message: `The KPI "${kpi.name}" has dropped to critical level (${kpi.currentValue} ${kpi.unit}). ` +
        `Immediate attention required. Target: ${kpi.targetValue} ${kpi.unit}.`,
      kpiId: kpi.id,
      metric: kpi.name,
      currentValue: kpi.currentValue,
      thresholdValue: kpi.thresholds.red,
      createdAt: admin.firestore.Timestamp.now(),
      acknowledged: false,
    };
    await db.collection("analyticsAlerts").add(alert);
    functions.logger.error(`KPI critical: ${kpi.name}`);
  }
}

/**
 * Check all KPI targets and update their status
 */
export async function checkAllKPITargets(): Promise<{ checked: number; alerts: number }> {
  const kpisSnapshot = await db.collection("kpiTargets").get();

  if (kpisSnapshot.empty) {
    functions.logger.info("No KPI targets configured");
    return { checked: 0, alerts: 0 };
  }

  let alertsCreated = 0;

  for (const doc of kpisSnapshot.docs) {
    const kpi = { id: doc.id, ...doc.data() } as KPITarget;

    // Get current metric value
    const metricKey = kpi.name.toLowerCase().replace(/\s+/g, "_");
    const currentValue = await getMetricValue(metricKey);

    // Get historical values for trend calculation
    const historySnapshot = await db.collection("kpiTargets").doc(doc.id)
      .collection("history")
      .orderBy("timestamp", "desc")
      .limit(5)
      .get();

    const historicalValues: number[] = [];
    historySnapshot.forEach((histDoc) => {
      historicalValues.unshift(histDoc.data().value);
    });
    historicalValues.push(currentValue);

    // Calculate trend
    const { direction: trendDirection, percentage: trendPercentage } =
      calculateTrendFromHistory(historicalValues);

    // Calculate new status
    const previousStatus = kpi.status;
    const newStatus = calculateKPIStatus(currentValue, kpi.targetValue, kpi.thresholds);

    // Update KPI document
    await doc.ref.update({
      currentValue,
      status: newStatus,
      trend: trendDirection,
      trendPercentage,
      lastChecked: admin.firestore.Timestamp.now(),
    });

    // Store history point
    await doc.ref.collection("history").add({
      value: currentValue,
      status: newStatus,
      timestamp: admin.firestore.Timestamp.now(),
    });

    // Create alert if status changed
    if (previousStatus !== newStatus) {
      await createAlert(
        { ...kpi, currentValue, status: newStatus, trend: trendDirection, trendPercentage },
        previousStatus,
        newStatus
      );
      alertsCreated++;
    }
  }

  functions.logger.info(`Checked ${kpisSnapshot.size} KPIs, created ${alertsCreated} alerts`);
  return { checked: kpisSnapshot.size, alerts: alertsCreated };
}

/**
 * Check Flight Plan 2030 milestones
 */
export async function checkFlightPlan2030Milestones(): Promise<MilestoneCheck> {
  const GOAL_2030 = 1000000;
  const GOAL_START_YEAR = 2024;
  const GOAL_END_YEAR = 2030;

  // Get current lives impacted
  const impactDoc = await db.collection("analytics").doc("impact").get();
  const currentLives = impactDoc.data()?.totalLivesImpacted || 0;

  const now = new Date();
  const currentYear = now.getFullYear();

  // Calculate where we should be at this point
  const totalYears = GOAL_END_YEAR - GOAL_START_YEAR;
  const yearsElapsed = Math.max(0, currentYear - GOAL_START_YEAR);
  const expectedProgress = (yearsElapsed / totalYears) * GOAL_2030;

  // Calculate days remaining until 2030
  const endDate = new Date(GOAL_END_YEAR, 11, 31); // Dec 31, 2030
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate projected completion based on current rate
  const daysSinceStart = Math.max(1, Math.ceil((now.getTime() - new Date(GOAL_START_YEAR, 0, 1).getTime()) /
    (1000 * 60 * 60 * 24)));
  const dailyRate = currentLives / daysSinceStart;
  const livesRemaining = GOAL_2030 - currentLives;
  const daysToComplete = dailyRate > 0 ? Math.ceil(livesRemaining / dailyRate) : Infinity;
  const projectedCompletionTimestamp = now.getTime() + (daysToComplete * 1000 * 60 * 60 * 24);
  const projectedCompletionYear = new Date(projectedCompletionTimestamp).getFullYear();

  const milestoneCheck: MilestoneCheck = {
    year: currentYear,
    targetLives: Math.round(expectedProgress),
    currentLives,
    percentComplete: (currentLives / GOAL_2030) * 100,
    onTrack: currentLives >= expectedProgress,
    projectedCompletion: projectedCompletionYear,
    daysRemaining,
  };

  // Update Flight Plan 2030 document
  await db.collection("analytics").doc("flightPlan2030").set({
    ...milestoneCheck,
    lastUpdated: admin.firestore.Timestamp.now(),
  }, { merge: true });

  // Create milestone alerts
  const percentComplete = milestoneCheck.percentComplete;
  const milestoneThresholds = [10, 25, 50, 75, 90, 100];

  for (const threshold of milestoneThresholds) {
    if (percentComplete >= threshold) {
      // Check if we already created this milestone alert
      const existingAlert = await db.collection("analyticsAlerts")
        .where("type", "==", "milestone_reached")
        .where("metric", "==", `flightPlan2030_${threshold}`)
        .limit(1)
        .get();

      if (existingAlert.empty) {
        const alert: Omit<AnalyticsAlert, "id"> = {
          type: "milestone_reached",
          severity: "info",
          title: `Flight Plan 2030: ${threshold}% Milestone Reached!`,
          message: `Congratulations! We have reached ${currentLives.toLocaleString()} lives impacted, ` +
            `achieving ${threshold}% of our goal to impact 1 million lives by 2030.`,
          metric: `flightPlan2030_${threshold}`,
          currentValue: currentLives,
          thresholdValue: (threshold / 100) * GOAL_2030,
          createdAt: admin.firestore.Timestamp.now(),
          acknowledged: false,
        };
        await db.collection("analyticsAlerts").add(alert);
        functions.logger.info(`Flight Plan 2030 milestone reached: ${threshold}%`);
      }
    }
  }

  // Alert if off track
  if (!milestoneCheck.onTrack) {
    const daysSinceLastOffTrackAlert = await db.collection("analyticsAlerts")
      .where("type", "==", "kpi_warning")
      .where("metric", "==", "flightPlan2030_offTrack")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    const shouldCreateAlert = daysSinceLastOffTrackAlert.empty ||
      (admin.firestore.Timestamp.now().toMillis() -
        daysSinceLastOffTrackAlert.docs[0].data().createdAt.toMillis()) > (7 * 24 * 60 * 60 * 1000); // 7 days

    if (shouldCreateAlert) {
      const alert: Omit<AnalyticsAlert, "id"> = {
        type: "kpi_warning",
        severity: "warning",
        title: "Flight Plan 2030: Behind Schedule",
        message: `We are currently at ${currentLives.toLocaleString()} lives impacted. ` +
          `To stay on track for 2030, we should be at ${milestoneCheck.targetLives.toLocaleString()}. ` +
          `At current pace, projected completion is ${projectedCompletionYear}.`,
        metric: "flightPlan2030_offTrack",
        currentValue: currentLives,
        thresholdValue: milestoneCheck.targetLives,
        createdAt: admin.firestore.Timestamp.now(),
        acknowledged: false,
      };
      await db.collection("analyticsAlerts").add(alert);
      functions.logger.warn("Flight Plan 2030 is behind schedule");
    }
  }

  return milestoneCheck;
}

/**
 * Scheduled function: Check KPI targets every 6 hours
 */
export const scheduledKPICheck = functions.pubsub
  .schedule("0 */6 * * *") // Every 6 hours
  .timeZone("UTC")
  .onRun(async () => {
    try {
      const result = await checkAllKPITargets();
      await checkFlightPlan2030Milestones();
      functions.logger.info("KPI check completed", result);
      return null;
    } catch (error) {
      functions.logger.error("Failed to check KPIs", error);
      throw error;
    }
  });

/**
 * HTTP function: Manually trigger KPI check (admin only)
 */
export const manualKPICheck = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }

  const userDoc = await db.collection("users").doc(context.auth.uid).get();
  const userData = userDoc.data();
  if (!userData || userData.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  try {
    const kpiResult = await checkAllKPITargets();
    const milestoneResult = await checkFlightPlan2030Milestones();

    return {
      success: true,
      kpis: kpiResult,
      flightPlan2030: milestoneResult,
    };
  } catch (error) {
    functions.logger.error("Failed to run manual KPI check", error);
    throw new functions.https.HttpsError("internal", "Failed to check KPIs");
  }
});
