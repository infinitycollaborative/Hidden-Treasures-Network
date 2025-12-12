/**
 * Generate Insights Cloud Function
 * Analyzes analytics data and generates actionable insights
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { AnalyticsInsight, AnalyticsSnapshot, TrendDirection } from "./types";

const db = admin.firestore();

interface InsightRule {
  id: string;
  category: string;
  check: (snapshots: AnalyticsSnapshot[]) => Promise<AnalyticsInsight | null>;
}

/**
 * Calculate percentage change between two values
 */
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Insight rules - each rule analyzes data and generates insights
 */
const insightRules: InsightRule[] = [
  // Student Growth Analysis
  {
    id: "student_growth_acceleration",
    category: "growth",
    check: async (snapshots) => {
      if (snapshots.length < 3) return null;

      const recent = snapshots[0].metrics;
      const middle = snapshots[1].metrics;
      const older = snapshots[2].metrics;

      const recentGrowth = calculateChange(recent.totalStudents, middle.totalStudents);
      const previousGrowth = calculateChange(middle.totalStudents, older.totalStudents);

      if (recentGrowth > previousGrowth * 1.5 && recentGrowth > 10) {
        return {
          type: "trend",
          category: "Student Growth",
          title: "Student Growth is Accelerating",
          summary: `Student enrollment growth has accelerated to ${recentGrowth.toFixed(1)}%, ` +
            `up from ${previousGrowth.toFixed(1)}% in the previous period.`,
          details: `This acceleration indicates strong momentum in student acquisition. ` +
            `Current total: ${recent.totalStudents} students. ` +
            `Consider scaling mentorship capacity to maintain quality.`,
          confidence: 0.85,
          actionable: true,
          suggestedActions: [
            "Review mentor-to-student ratios to ensure adequate support",
            "Consider expanding program offerings to accommodate growth",
            "Analyze which channels are driving the increased enrollments",
          ],
          relatedMetrics: ["totalStudents", "studentGrowthRate", "mentorStudentRatio"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      if (recentGrowth < previousGrowth * 0.5 && previousGrowth > 5) {
        return {
          type: "trend",
          category: "Student Growth",
          title: "Student Growth is Slowing",
          summary: `Student enrollment growth has slowed to ${recentGrowth.toFixed(1)}%, ` +
            `down from ${previousGrowth.toFixed(1)}% previously.`,
          details: `This deceleration may indicate market saturation, seasonal effects, or ` +
            `reduced marketing effectiveness. Investigation recommended.`,
          confidence: 0.8,
          actionable: true,
          suggestedActions: [
            "Review and optimize marketing campaigns",
            "Survey recent leads to understand conversion barriers",
            "Consider new partnership opportunities for reach expansion",
          ],
          relatedMetrics: ["totalStudents", "studentGrowthRate", "newStudentsThisPeriod"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      return null;
    },
  },

  // Mentor Capacity Alert
  {
    id: "mentor_capacity_concern",
    category: "capacity",
    check: async (snapshots) => {
      if (snapshots.length < 1) return null;

      const recent = snapshots[0].metrics;
      const ratio = recent.mentorStudentRatio;

      if (ratio > 15) {
        return {
          type: "recommendation",
          category: "Mentorship Capacity",
          title: "Mentor Capacity Concern",
          summary: `Current mentor-to-student ratio is ${ratio.toFixed(1)}:1, ` +
            `which exceeds the recommended maximum of 15:1.`,
          details: `High mentor-to-student ratios can lead to decreased quality of ` +
            `mentorship and student outcomes. Current mentors: ${recent.totalMentors}, ` +
            `Current students: ${recent.totalStudents}.`,
          confidence: 0.9,
          actionable: true,
          suggestedActions: [
            "Launch a mentor recruitment campaign",
            "Consider peer mentoring programs to supplement",
            "Review mentor retention and engagement strategies",
            "Implement mentorship efficiency tools",
          ],
          relatedMetrics: ["totalMentors", "totalStudents", "mentorStudentRatio"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      if (ratio < 5 && recent.totalMentors > 10) {
        return {
          type: "recommendation",
          category: "Mentorship Capacity",
          title: "Underutilized Mentor Capacity",
          summary: `Current mentor-to-student ratio is ${ratio.toFixed(1)}:1, ` +
            `indicating underutilized mentor capacity.`,
          details: `With ${recent.totalMentors} mentors and ${recent.totalStudents} students, ` +
            `there may be an opportunity to increase student enrollment or optimize mentor allocation.`,
          confidence: 0.75,
          actionable: true,
          suggestedActions: [
            "Increase student recruitment efforts",
            "Consider expanding geographic reach",
            "Offer mentors additional responsibilities or specializations",
          ],
          relatedMetrics: ["totalMentors", "totalStudents", "mentorStudentRatio"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      return null;
    },
  },

  // Program Completion Analysis
  {
    id: "program_completion_trend",
    category: "programs",
    check: async (snapshots) => {
      if (snapshots.length < 2) return null;

      const recent = snapshots[0].metrics;
      const previous = snapshots[1].metrics;

      const completionDiff = recent.completionRate - previous.completionRate;

      if (completionDiff < -10 && recent.completionRate < 60) {
        return {
          type: "anomaly",
          category: "Program Performance",
          title: "Declining Program Completion Rate",
          summary: `Program completion rate dropped by ${Math.abs(completionDiff).toFixed(1)}% ` +
            `to ${recent.completionRate.toFixed(1)}%.`,
          details: `This significant decline may indicate issues with program content, ` +
            `student support, or external factors affecting student commitment. ` +
            `${recent.programCompletions} completions out of ${recent.programEnrollments} enrollments.`,
          confidence: 0.85,
          actionable: true,
          suggestedActions: [
            "Survey students who did not complete programs",
            "Review program content for engagement issues",
            "Analyze dropout points within programs",
            "Implement early intervention for at-risk students",
          ],
          relatedMetrics: ["programCompletions", "programEnrollments", "completionRate"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      if (completionDiff > 10 && recent.completionRate > 70) {
        return {
          type: "trend",
          category: "Program Performance",
          title: "Program Completion Rate Improving",
          summary: `Program completion rate increased by ${completionDiff.toFixed(1)}% ` +
            `to ${recent.completionRate.toFixed(1)}%.`,
          details: `This positive trend suggests program improvements are effective. ` +
            `Consider documenting and replicating successful strategies.`,
          confidence: 0.85,
          actionable: true,
          suggestedActions: [
            "Document successful completion strategies",
            "Share best practices across programs",
            "Recognize and reward high-performing mentors",
          ],
          relatedMetrics: ["programCompletions", "programEnrollments", "completionRate"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      return null;
    },
  },

  // Donation Trend Analysis
  {
    id: "donation_trend",
    category: "funding",
    check: async (snapshots) => {
      if (snapshots.length < 3) return null;

      const recentDonations = snapshots[0].metrics.totalDonations;
      const previousDonations = snapshots[1].metrics.totalDonations;
      const olderDonations = snapshots[2].metrics.totalDonations;

      const recentChange = calculateChange(recentDonations, previousDonations);
      const previousChange = calculateChange(previousDonations, olderDonations);

      // Sustained decline
      if (recentChange < -15 && previousChange < -10) {
        return {
          type: "anomaly",
          category: "Funding",
          title: "Sustained Donation Decline",
          summary: `Donations have declined for consecutive periods: ` +
            `${recentChange.toFixed(1)}% most recently, ${previousChange.toFixed(1)}% before that.`,
          details: `This sustained decline in donations requires attention. ` +
            `Current donation count: ${recentDonations}. Consider reviewing ` +
            `donor communication and engagement strategies.`,
          confidence: 0.85,
          actionable: true,
          suggestedActions: [
            "Review donor communication frequency and content",
            "Launch a re-engagement campaign for lapsed donors",
            "Analyze donor feedback and satisfaction",
            "Consider new fundraising channels or campaigns",
          ],
          relatedMetrics: ["totalDonations", "averageDonation", "totalSponsors"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      // Strong growth
      if (recentChange > 25 && previousChange > 15) {
        return {
          type: "trend",
          category: "Funding",
          title: "Strong Donation Momentum",
          summary: `Donations showing strong growth: ${recentChange.toFixed(1)}% increase, ` +
            `following ${previousChange.toFixed(1)}% in the previous period.`,
          details: `This momentum in donations is excellent. Consider capitalizing on this ` +
            `success by analyzing what's working and scaling those efforts.`,
          confidence: 0.85,
          actionable: true,
          suggestedActions: [
            "Identify and replicate successful fundraising strategies",
            "Thank and recognize top donors",
            "Consider launching a matching gift campaign",
          ],
          relatedMetrics: ["totalDonations", "averageDonation", "totalSponsors"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      return null;
    },
  },

  // Flight Plan 2030 Projection
  {
    id: "flight_plan_projection",
    category: "impact",
    check: async (snapshots) => {
      if (snapshots.length < 2) return null;

      const recent = snapshots[0].metrics;
      const previous = snapshots[1].metrics;

      const GOAL_2030 = 1000000;
      const impactGrowthRate = calculateChange(recent.livesImpacted, previous.livesImpacted);

      // Calculate projected completion
      const now = new Date();
      const endDate = new Date(2030, 11, 31);
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const livesRemaining = GOAL_2030 - recent.livesImpacted;
      const dailyNeeded = livesRemaining / daysRemaining;

      // Assume 30-day period between snapshots
      const recentDailyRate = (recent.livesImpacted - previous.livesImpacted) / 30;

      if (recentDailyRate >= dailyNeeded * 1.2) {
        return {
          type: "prediction",
          category: "Flight Plan 2030",
          title: "On Track to Exceed 2030 Goal",
          summary: `At current pace, we are projected to exceed the 1 million lives goal ` +
            `before 2030.`,
          details: `Current daily impact rate: ~${Math.round(recentDailyRate)} lives/day. ` +
            `Required rate: ~${Math.round(dailyNeeded)} lives/day. ` +
            `Total impacted so far: ${recent.livesImpacted.toLocaleString()}.`,
          confidence: 0.7,
          actionable: true,
          suggestedActions: [
            "Consider setting stretch goals beyond 1 million",
            "Document successful strategies for future reference",
            "Plan celebration milestones along the way",
          ],
          relatedMetrics: ["livesImpacted", "progressToGoal"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      if (recentDailyRate < dailyNeeded * 0.5) {
        return {
          type: "prediction",
          category: "Flight Plan 2030",
          title: "Flight Plan 2030 at Risk",
          summary: `Current impact rate is significantly below the pace needed to reach ` +
            `1 million lives by 2030.`,
          details: `Current daily impact rate: ~${Math.round(recentDailyRate)} lives/day. ` +
            `Required rate: ~${Math.round(dailyNeeded)} lives/day. ` +
            `Need to increase pace by ${Math.round((dailyNeeded / recentDailyRate - 1) * 100)}%.`,
          confidence: 0.75,
          actionable: true,
          suggestedActions: [
            "Review and optimize program capacity",
            "Accelerate partner organization onboarding",
            "Launch new high-impact initiatives",
            "Consider strategic partnerships for scale",
          ],
          relatedMetrics: ["livesImpacted", "progressToGoal"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      return null;
    },
  },

  // Organization Network Health
  {
    id: "org_network_health",
    category: "network",
    check: async (snapshots) => {
      if (snapshots.length < 1) return null;

      const recent = snapshots[0].metrics;
      const activeRatio = recent.totalOrganizations > 0
        ? (recent.activeOrganizations / recent.totalOrganizations) * 100
        : 0;

      if (activeRatio < 60 && recent.totalOrganizations > 20) {
        return {
          type: "recommendation",
          category: "Network Health",
          title: "Low Organization Engagement",
          summary: `Only ${activeRatio.toFixed(1)}% of partner organizations are actively engaged.`,
          details: `Out of ${recent.totalOrganizations} organizations in the network, ` +
            `only ${recent.activeOrganizations} are actively participating. ` +
            `Re-engagement efforts may be needed.`,
          confidence: 0.8,
          actionable: true,
          suggestedActions: [
            "Reach out to inactive organizations",
            "Survey organizations to understand barriers",
            "Create engagement incentives or recognition programs",
            "Review onboarding process for new organizations",
          ],
          relatedMetrics: ["totalOrganizations", "activeOrganizations"],
          createdAt: admin.firestore.Timestamp.now(),
          status: "active",
        };
      }

      return null;
    },
  },
];

/**
 * Generate insights by running all insight rules
 */
export async function generateAllInsights(): Promise<{ generated: number; dismissed: number }> {
  // Get recent snapshots for analysis
  const snapshotsQuery = await db.collection("analyticsSnapshots")
    .where("frequency", "==", "daily")
    .orderBy("createdAt", "desc")
    .limit(7) // Last 7 days
    .get();

  const snapshots: AnalyticsSnapshot[] = [];
  snapshotsQuery.forEach((doc) => {
    snapshots.push({ id: doc.id, ...doc.data() } as AnalyticsSnapshot);
  });

  if (snapshots.length === 0) {
    functions.logger.warn("No snapshots available for insight generation");
    return { generated: 0, dismissed: 0 };
  }

  let generated = 0;
  let dismissed = 0;

  // Expire old insights
  const oldInsights = await db.collection("analyticsInsights")
    .where("status", "==", "active")
    .where("createdAt", "<", admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    ))
    .get();

  for (const doc of oldInsights.docs) {
    await doc.ref.update({ status: "dismissed", dismissedAt: admin.firestore.Timestamp.now() });
    dismissed++;
  }

  // Run each insight rule
  for (const rule of insightRules) {
    try {
      const insight = await rule.check(snapshots);

      if (insight) {
        // Check if similar insight already exists and is active
        const existingInsight = await db.collection("analyticsInsights")
          .where("type", "==", insight.type)
          .where("category", "==", insight.category)
          .where("status", "==", "active")
          .limit(1)
          .get();

        if (existingInsight.empty) {
          await db.collection("analyticsInsights").add(insight);
          generated++;
          functions.logger.info(`Generated insight: ${insight.title}`);
        }
      }
    } catch (error) {
      functions.logger.error(`Error in insight rule ${rule.id}:`, error);
    }
  }

  functions.logger.info(`Insight generation complete: ${generated} new, ${dismissed} dismissed`);
  return { generated, dismissed };
}

/**
 * Scheduled function: Generate insights daily at 6 AM UTC
 */
export const scheduledInsightGeneration = functions.pubsub
  .schedule("0 6 * * *") // Every day at 6 AM UTC
  .timeZone("UTC")
  .onRun(async () => {
    try {
      const result = await generateAllInsights();
      functions.logger.info("Insight generation completed", result);
      return null;
    } catch (error) {
      functions.logger.error("Failed to generate insights", error);
      throw error;
    }
  });

/**
 * HTTP function: Manually trigger insight generation (admin only)
 */
export const manualInsightGeneration = functions.https.onCall(async (data, context) => {
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
    const result = await generateAllInsights();
    return { success: true, ...result };
  } catch (error) {
    functions.logger.error("Failed to generate insights manually", error);
    throw new functions.https.HttpsError("internal", "Failed to generate insights");
  }
});

/**
 * HTTP function: Dismiss an insight
 */
export const dismissInsight = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }

  const { insightId, actioned } = data;
  if (!insightId) {
    throw new functions.https.HttpsError("invalid-argument", "Insight ID required");
  }

  const userDoc = await db.collection("users").doc(context.auth.uid).get();
  const userData = userDoc.data();
  if (!userData || (userData.role !== "admin" && userData.role !== "manager")) {
    throw new functions.https.HttpsError("permission-denied", "Admin or manager access required");
  }

  try {
    await db.collection("analyticsInsights").doc(insightId).update({
      status: actioned ? "actioned" : "dismissed",
      dismissedBy: context.auth.uid,
      dismissedAt: admin.firestore.Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    functions.logger.error("Failed to dismiss insight", error);
    throw new functions.https.HttpsError("internal", "Failed to dismiss insight");
  }
});
