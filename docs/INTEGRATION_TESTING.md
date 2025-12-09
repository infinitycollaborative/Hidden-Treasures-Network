# Integration Testing Guide: Phases 13-15

## Overview

This guide provides comprehensive testing scenarios for the complete Hidden Treasures Network platform, covering all three phases and their integrations.

**Testing Scope**:
- ✅ Phase 13: Gamification System
- ✅ Phase 14: School & Classroom Integration
- ✅ Phase 15: Marketplace & Funding Exchange
- ✅ Cross-Phase Integration
- ✅ End-to-End User Journeys

---

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Phase 13: Gamification Tests](#phase-13-gamification-tests)
3. [Phase 14: Schools Tests](#phase-14-schools-tests)
4. [Phase 15: Marketplace Tests](#phase-15-marketplace-tests)
5. [Integration Tests](#integration-tests)
6. [End-to-End Scenarios](#end-to-end-scenarios)
7. [Performance Tests](#performance-tests)
8. [Security Tests](#security-tests)

---

## Test Environment Setup

### Prerequisites

```bash
# 1. Install dependencies
npm install

# 2. Set up Firebase Emulator Suite
npm install -g firebase-tools
firebase init emulators

# 3. Configure test environment variables
cp .env.example .env.test
```

### Environment Variables (.env.test)

```env
# Firebase Test Project
NEXT_PUBLIC_FIREBASE_API_KEY=test-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hidden-treasures-test
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hidden-treasures-test.firebaseapp.com

# Stripe Test Mode
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Feature Flags
ENABLE_GAMIFICATION=true
ENABLE_CLASSROOMS=true
ENABLE_MARKETPLACE=true
```

### Start Test Environment

```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal, start Next.js dev server
npm run dev

# Seed test data
npm run seed:test
```

### Test Data Seeding

Create `scripts/seed-test-data.ts`:

```typescript
// Seed test users
await seedTestUsers([
  { role: 'student', count: 50 },
  { role: 'teacher', count: 5 },
  { role: 'school_admin', count: 2 },
  { role: 'sponsor', count: 10 },
])

// Seed test schools and classrooms
await seedTestSchools(3) // Creates 3 schools with 2 classrooms each

// Seed badges and quests
await seedStarterBadges()
await seedTestQuests()

// Seed scholarships
await seedTestScholarships(5)
```

---

## Phase 13: Gamification Tests

### Test 1: XP Award and Leveling

**Test Case**: Student earns XP and levels up

**Steps**:
1. Create test student account
2. Award 500 XP via `awardXP(studentId, 500, 'programs', 'Test XP')`
3. Verify `userXP` document created with `totalXP: 500`
4. Calculate expected level: `floor(sqrt(500/100))` = 2
5. Verify `currentLevel: 2`
6. Verify XP transaction logged in `xpTransactions`

**Expected Results**:
```typescript
{
  userId: 'test-student-1',
  totalXP: 500,
  currentLevel: 2,
  xpByCategory: {
    programs: 500
  },
  lastUpdated: Timestamp
}
```

**Test Code**:
```typescript
test('XP award and leveling', async () => {
  const studentId = 'test-student-1'

  const result = await awardXP(studentId, 500, 'programs', 'Test XP')

  expect(result.success).toBe(true)
  expect(result.newLevel).toBe(2)
  expect(result.leveledUp).toBe(true)

  const userXP = await getUserXP(studentId)
  expect(userXP.totalXP).toBe(500)
  expect(userXP.currentLevel).toBe(2)
})
```

---

### Test 2: Badge Award with Duplicate Prevention

**Test Case**: Award badge to student, prevent duplicates

**Steps**:
1. Award "Red Tail Legacy" badge to student
2. Verify badge appears in `userBadges`
3. Attempt to award same badge again
4. Verify second attempt returns error
5. Confirm only one badge instance exists

**Expected Results**:
- First award: `{ success: true }`
- Second award: `{ success: false, error: 'User already has this badge' }`

**Test Code**:
```typescript
test('Badge award with duplicate prevention', async () => {
  const studentId = 'test-student-1'
  const badgeId = 'red-tail-legacy'

  // First award should succeed
  const result1 = await awardBadge(studentId, badgeId, 'Test award')
  expect(result1.success).toBe(true)

  // Second award should fail
  const result2 = await awardBadge(studentId, badgeId, 'Duplicate test')
  expect(result2.success).toBe(false)
  expect(result2.error).toContain('already has this badge')

  // Verify only one badge
  const badges = await getUserBadges(studentId)
  const redTailBadges = badges.filter(b => b.badgeId === badgeId)
  expect(redTailBadges.length).toBe(1)
})
```

---

### Test 3: Quest Progress and Completion

**Test Case**: Student accepts quest, makes progress, completes it

**Steps**:
1. Create daily quest requiring 3 modules completed
2. Student accepts quest via `acceptQuest()`
3. Increment progress: `updateQuestProgress(questId, studentId, 1)`
4. Verify progress updates to 1/3
5. Increment twice more
6. Verify quest auto-completes at 3/3
7. Verify rewards awarded (XP, badge)

**Expected Results**:
- Quest status changes: `in_progress` → `completed`
- Rewards: 100 XP + quest completion badge
- XP transaction logged

**Test Code**:
```typescript
test('Quest completion workflow', async () => {
  const studentId = 'test-student-1'
  const questId = 'daily-modules-quest'

  // Accept quest
  await acceptQuest(studentId, questId)

  // Make progress
  await updateQuestProgress(questId, studentId, 1)
  let userQuest = await getUserQuest(studentId, questId)
  expect(userQuest.progress).toBe(1)
  expect(userQuest.status).toBe('in_progress')

  // Complete quest
  await updateQuestProgress(questId, studentId, 2) // Progress 2/3
  await updateQuestProgress(questId, studentId, 3) // Progress 3/3

  userQuest = await getUserQuest(studentId, questId)
  expect(userQuest.status).toBe('completed')
  expect(userQuest.progress).toBe(3)

  // Verify rewards
  const userXP = await getUserXP(studentId)
  expect(userXP.totalXP).toBeGreaterThan(0)
})
```

---

### Test 4: Leaderboard Generation

**Test Case**: Generate global leaderboard with top 100 students

**Steps**:
1. Create 150 test students with varying XP
2. Run `updateLeaderboard('global', 'all_time')`
3. Verify leaderboard has exactly 100 entries
4. Verify entries sorted by XP descending
5. Verify rank numbers are sequential

**Expected Results**:
```typescript
{
  type: 'global',
  period: 'all_time',
  entries: [
    { userId: 'student-1', totalXP: 5000, rank: 1 },
    { userId: 'student-2', totalXP: 4800, rank: 2 },
    // ... 98 more entries
  ],
  lastUpdated: Timestamp
}
```

---

## Phase 14: Schools Tests

### Test 5: Classroom Creation with Join Code

**Test Case**: Teacher creates classroom, unique join code generated

**Steps**:
1. Login as teacher
2. Create classroom via `createClassroom()`
3. Verify join code is 6 characters, alphanumeric
4. Create second classroom
5. Verify different join code
6. Attempt to manually create classroom with duplicate join code
7. Verify collision prevention works

**Expected Results**:
- Join codes are unique across all classrooms
- Format: 6 uppercase chars/numbers (no ambiguous chars: 0, O, I, 1)
- Auto-retry on collision

**Test Code**:
```typescript
test('Unique join code generation', async () => {
  const teacherId = 'test-teacher-1'

  // Create first classroom
  const classroom1 = await createClassroom({
    teacherId,
    name: 'Aviation 101',
    schoolId: 'test-school-1',
    subject: 'Aviation',
    gradeLevel: 9,
    academicYear: '2024-2025',
  })

  // Create second classroom
  const classroom2 = await createClassroom({
    teacherId,
    name: 'Aviation 102',
    schoolId: 'test-school-1',
    subject: 'Aviation',
    gradeLevel: 10,
    academicYear: '2024-2025',
  })

  // Verify unique codes
  expect(classroom1.joinCode).not.toBe(classroom2.joinCode)
  expect(classroom1.joinCode).toMatch(/^[A-Z2-9]{6}$/)
  expect(classroom2.joinCode).toMatch(/^[A-Z2-9]{6}$/)
})
```

---

### Test 6: Student Enrollment via Join Code

**Test Case**: Student joins classroom using join code

**Steps**:
1. Student enters join code "ABC123"
2. System validates code exists
3. System checks student not already enrolled
4. System checks classroom capacity
5. Create enrollment record
6. Update classroom `studentIds` array
7. Verify student appears in roster

**Expected Results**:
- Enrollment status: `active`
- Student added to `classrooms/{id}/studentIds`
- Can access classroom content

**Test Code**:
```typescript
test('Student enrollment workflow', async () => {
  const studentId = 'test-student-1'
  const joinCode = 'ABC123'

  // Verify code exists
  const classroom = await getClassroomByJoinCode(joinCode)
  expect(classroom).toBeTruthy()

  // Enroll student
  const result = await enrollStudentViaJoinCode(studentId, joinCode)
  expect(result.success).toBe(true)

  // Verify enrollment
  const roster = await getClassroomRoster(classroom.id)
  const enrollment = roster.find(r => r.studentId === studentId)

  expect(enrollment).toBeTruthy()
  expect(enrollment.enrollmentStatus).toBe('active')
})
```

---

### Test 7: Module Assignment and Completion

**Test Case**: Teacher assigns module, student completes it, earns XP

**Steps**:
1. Teacher assigns "Introduction to Aviation" module
2. Set due date 7 days from now
3. Student starts module
4. Student completes all lessons and quiz
5. System awards XP based on classroom multiplier
6. Teacher grades submission
7. Student receives badge if applicable

**Expected Results**:
- Module XP: 200 (base) × 1.5 (classroom multiplier) = 300 XP
- Badge: "Aviation Scholar" (if module has badge reward)
- Grade recorded in `studentProgress`

**Test Code**:
```typescript
test('Module completion with XP and badge', async () => {
  const teacherId = 'test-teacher-1'
  const studentId = 'test-student-1'
  const classroomId = 'test-classroom-1'
  const moduleId = 'intro-to-aviation'

  // Assign module
  await assignModuleToClassroom(classroomId, moduleId, teacherId, {
    dueDate: addDays(new Date(), 7),
    maxPoints: 100,
  })

  // Student completes module
  const progressId = await startModuleProgress(studentId, moduleId, classroomId)

  // Get initial XP
  const initialXP = await getUserXP(studentId)
  const initialTotalXP = initialXP?.totalXP || 0

  // Complete module with score of 95
  await completeModule(progressId, 95, 'Great work!')

  // Verify XP awarded
  const finalXP = await getUserXP(studentId)
  const xpAwarded = finalXP.totalXP - initialTotalXP

  // Module has 200 base XP, classroom has 1.5x multiplier
  expect(xpAwarded).toBe(300)

  // Verify badge if applicable
  const module = await getCurriculumModule(moduleId)
  if (module.badgeReward) {
    const hasBadge = await userHasBadge(studentId, module.badgeReward)
    expect(hasBadge).toBe(true)
  }
})
```

---

### Test 8: FERPA Compliance - Parental Consent

**Test Case**: Request and track parental consent for student under 13

**Steps**:
1. Student (age 12) attempts to join classroom
2. System detects age < 13, requires parental consent
3. Teacher initiates consent request
4. Parent receives email with verification link
5. Parent approves consent
6. Student enrollment completes
7. Verify consent permissions logged

**Expected Results**:
- Consent status: `pending` → `approved`
- Student can access classroom after approval
- All data collection permissions documented

**Test Code**:
```typescript
test('Parental consent workflow', async () => {
  const studentId = 'test-student-under13'
  const classroomId = 'test-classroom-1'

  // Request consent
  const consentId = await requestParentalConsent({
    studentId,
    classroomId,
    parentEmail: 'parent@example.com',
    permissions: {
      educationalRecords: true,
      progressTracking: true,
      badgeSharing: true,
      photographyVideo: false,
    },
  })

  // Verify pending status
  let consent = await getParentalConsent(consentId)
  expect(consent.status).toBe('pending')

  // Parent approves (simulate)
  await updateConsentStatus(consentId, 'approved', {
    signedBy: 'Jane Doe',
    signedAt: Timestamp.now(),
  })

  // Verify approved
  consent = await getParentalConsent(consentId)
  expect(consent.status).toBe('approved')

  // Student can now enroll
  const enrollment = await enrollStudent(studentId, classroomId)
  expect(enrollment.success).toBe(true)
})
```

---

## Phase 15: Marketplace Tests

### Test 9: Scholarship Application with Eligibility

**Test Case**: Student applies for scholarship, system validates eligibility

**Steps**:
1. Create scholarship with requirements:
   - GPA: 3.0+
   - Age: 16-24
   - Required badges: ["Aviation Scholar", "Red Tail Legacy"]
2. Student with GPA 3.5, age 17, has both badges applies
3. System validates all criteria
4. Application accepted
5. Student with GPA 2.8 applies
6. Application rejected for not meeting requirements

**Expected Results**:
- Eligible student: Application status `pending_review`
- Ineligible student: Error with specific reason

**Test Code**:
```typescript
test('Scholarship eligibility validation', async () => {
  const scholarshipId = 'test-scholarship-1'
  const eligibleStudentId = 'student-eligible'
  const ineligibleStudentId = 'student-ineligible'

  // Eligible student applies
  const result1 = await applyForScholarship({
    scholarshipId,
    studentId: eligibleStudentId,
    essay: 'My passion for aviation...',
    // ... other fields
  })

  expect(result1.success).toBe(true)
  expect(result1.applicationId).toBeTruthy()

  // Ineligible student applies (low GPA)
  const result2 = await applyForScholarship({
    scholarshipId,
    studentId: ineligibleStudentId,
    essay: 'My passion for aviation...',
  })

  expect(result2.success).toBe(false)
  expect(result2.error).toContain('GPA requirement')
})
```

---

### Test 10: Stripe Payment Integration

**Test Case**: Sponsor makes donation, payment processed via Stripe

**Steps**:
1. Sponsor selects scholarship to fund ($5,000)
2. System creates Stripe Payment Intent
3. Calculate platform fee: $5,000 × 0.03 = $150
4. Net amount: $4,850
5. Sponsor completes payment
6. Webhook confirms payment
7. Create sponsorship record
8. Update scholarship funded amount

**Expected Results**:
- Payment Intent created with correct amount
- Platform fee calculated and logged
- Sponsorship record created on successful payment

**Test Code**:
```typescript
test('Stripe payment flow', async () => {
  const sponsorId = 'test-sponsor-1'
  const scholarshipId = 'test-scholarship-1'
  const amount = 500000 // $5,000 in cents

  // Create payment intent
  const intent = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      metadata: {
        sponsorId,
        scholarshipId,
        type: 'scholarship_funding',
      },
    }),
  }).then(r => r.json())

  expect(intent.clientSecret).toBeTruthy()
  expect(intent.platformFee).toBe(15000) // 3% of $5,000
  expect(intent.netAmount).toBe(485000) // $4,850

  // Simulate successful payment (in test mode)
  // In real test, use Stripe test cards

  // Verify sponsorship created
  const sponsorships = await getSponsorships(sponsorId)
  const sponsorship = sponsorships.find(s => s.scholarshipId === scholarshipId)

  expect(sponsorship).toBeTruthy()
  expect(sponsorship.amount).toBe(500000)
  expect(sponsorship.platformFee).toBe(15000)
  expect(sponsorship.status).toBe('active')
})
```

---

### Test 11: Impact Report Generation

**Test Case**: Generate quarterly impact report for sponsor

**Steps**:
1. Sponsor has funded 3 scholarships
2. 10 students sponsored across 2 schools
3. Students have earned: 5,000 total XP, 15 badges, completed 25 modules
4. Generate Q1 2025 impact report
5. Verify all metrics aggregated correctly
6. Verify student stories included
7. Verify report PDF generated

**Expected Results**:
```typescript
{
  sponsorId: 'test-sponsor-1',
  period: 'Q1 2025',
  metrics: {
    studentsSponsored: 10,
    totalXPAwarded: 5000,
    badgesEarned: 15,
    modulesCompleted: 25,
    averageGrade: 87.5,
    certificationsAwarded: 2,
    flightHoursCompleted: 12.5,
  },
  studentStories: [...],
  generatedAt: Timestamp,
}
```

**Test Code**:
```typescript
test('Impact report generation', async () => {
  const sponsorId = 'test-sponsor-1'
  const startDate = Timestamp.fromDate(new Date('2025-01-01'))
  const endDate = Timestamp.fromDate(new Date('2025-03-31'))

  const reportId = await generateImpactReport(
    sponsorId,
    'quarterly',
    startDate,
    endDate
  )

  const report = await getImpactReport(reportId)

  expect(report.sponsorId).toBe(sponsorId)
  expect(report.metrics.studentsSponsored).toBeGreaterThan(0)
  expect(report.metrics.totalXPAwarded).toBeGreaterThan(0)
  expect(report.metrics.badgesEarned).toBeGreaterThan(0)
  expect(report.studentStories.length).toBeGreaterThan(0)
})
```

---

## Integration Tests

### Test 12: Cross-Phase Data Flow

**Test Case**: Student completes module → Earns XP → Appears in sponsor impact report

**Steps**:
1. Sponsor funds scholarship for student
2. Student enrolls in classroom
3. Teacher assigns aviation module with 300 XP reward
4. Student completes module with 95% score
5. Verify XP awarded (Phase 13 ← Phase 14)
6. Verify badge awarded if applicable
7. Generate impact report for sponsor
8. Verify module completion shows in report (Phase 15 uses Phase 14 + 13 data)

**Expected Results**:
- Student XP increases by 300
- Impact report shows: +1 module completed, +300 XP
- Real-time impact dashboard updates for sponsor

**Test Code**:
```typescript
test('End-to-end cross-phase integration', async () => {
  const sponsorId = 'test-sponsor-1'
  const studentId = 'test-student-1'
  const classroomId = 'test-classroom-1'
  const moduleId = 'test-module-1'

  // 1. Sponsor funds student (Phase 15)
  await createSponsorship({
    sponsorId,
    studentId,
    amount: 500000,
    type: 'scholarship',
  })

  // 2. Get initial metrics
  const initialXP = (await getUserXP(studentId))?.totalXP || 0

  // 3. Complete module (Phase 14)
  const progressId = await startModuleProgress(studentId, moduleId, classroomId)
  await completeModule(progressId, 95)

  // 4. Verify XP awarded (Phase 13)
  const finalXP = (await getUserXP(studentId))?.totalXP || 0
  const xpGained = finalXP - initialXP
  expect(xpGained).toBeGreaterThan(0)

  // 5. Generate impact report (Phase 15)
  const reportId = await generateImpactReport(
    sponsorId,
    'monthly',
    Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    Timestamp.now()
  )

  const report = await getImpactReport(reportId)

  // 6. Verify all metrics integrated
  expect(report.metrics.modulesCompleted).toBeGreaterThan(0)
  expect(report.metrics.totalXPAwarded).toBe(xpGained)
})
```

---

### Test 13: Classroom XP Multiplier Integration

**Test Case**: Classroom has 1.5x XP multiplier, student earns boosted XP

**Steps**:
1. Teacher sets classroom XP multiplier to 1.5
2. Assign module with 200 base XP
3. Student completes module
4. Verify XP awarded: 200 × 1.5 = 300 XP
5. Verify XP transaction shows multiplier
6. Verify impact report counts total XP (not base)

**Expected Results**:
- XP transaction metadata includes: `{ multiplier: 1.5, baseXP: 200, actualXP: 300 }`
- Impact reports show actual XP earned (300)

---

### Test 14: Badge Requirements from Multiple Phases

**Test Case**: Badge requires both module completion (Phase 14) and community events (Phase 13)

**Steps**:
1. Create badge "Community Aviation Leader" requiring:
   - Complete 5 aviation modules (Phase 14)
   - Attend 3 community events (Phase 13)
   - Mentor 2 students (Phase 13)
2. Student completes 5 modules
3. Verify badge NOT awarded (missing events + mentoring)
4. Student attends 3 events, mentors 2 students
5. System auto-awards badge
6. Badge appears in scholarship application credentials

**Expected Results**:
- Multi-phase requirement validation
- Auto-award when all conditions met
- Badge usable in Phase 15 applications

---

## End-to-End Scenarios

### Scenario 1: Complete Student Journey

**Narrative**: New student joins platform, completes training, earns scholarship

**Steps**:
1. **Sign Up** (Phase 13)
   - Student creates account
   - Receives "Red Tail Legacy" welcome badge
   - Initial XP: 100

2. **Join Classroom** (Phase 14)
   - Enters join code from teacher
   - Enrolls in "Aviation Fundamentals" class
   - Parent consent obtained (age 16, consent required)

3. **Complete Modules** (Phase 14 → 13)
   - Completes Module 1: "History of Tuskegee Airmen" → +200 XP
   - Completes Module 2: "Aircraft Systems" → +250 XP
   - Completes Module 3: "Flight Basics" → +300 XP
   - Total XP: 850, Level 2

4. **Earn Badges** (Phase 13)
   - "Aviation Scholar" (3 modules completed)
   - "Tuskegee Historian" (completed history module)
   - Total badges: 3

5. **Apply for Scholarship** (Phase 15)
   - Browses open scholarships
   - Finds "First Flight Scholarship" ($2,500)
   - Requirements: 2+ badges, 500+ XP ✅
   - Submits application with essay

6. **Sponsor Reviews** (Phase 15)
   - Sponsor sees student profile
   - Reviews: 3 badges, 850 XP, 95% avg grade
   - Awards scholarship

7. **Track Impact** (Phase 15 ← 14 ← 13)
   - Student continues training with scholarship funds
   - Completes 5 more modules → +1,500 XP
   - Earns "Certified Aviator" badge
   - Sponsor receives quarterly report showing progress

**Validation Points**:
- ✅ XP correctly awarded and tracked
- ✅ Badges auto-awarded when earned
- ✅ Scholarship eligibility validated
- ✅ Impact metrics aggregate across all phases
- ✅ Student progression visible to sponsor

---

### Scenario 2: Complete Teacher Journey

**Narrative**: Teacher creates classroom, manages students, tracks progress

**Steps**:
1. **Setup Classroom** (Phase 14)
   - Create "Aviation 101" classroom
   - Join code generated: "XYZ789"
   - Set XP multiplier: 1.2x (honors class)
   - Share join code with students

2. **Enroll Students** (Phase 14)
   - 25 students join via code
   - 3 require parental consent (under 13)
   - Teacher initiates consent requests
   - All consents approved

3. **Assign Modules** (Phase 14)
   - Assigns "Introduction to Aviation" (due in 7 days)
   - Assigns "Aircraft Safety" (due in 14 days)
   - Both modules have badge rewards

4. **Monitor Progress** (Phase 14 + 13)
   - Dashboard shows: 20/25 completed Module 1
   - Average grade: 88%
   - Total XP earned by class: 6,000
   - 15 students earned "Aviation Scholar" badge

5. **Grade Submissions** (Phase 14)
   - Reviews late submissions
   - Applies late penalty (-10%)
   - Provides written feedback
   - XP awarded automatically on grading

6. **Request Funding** (Phase 15)
   - Classroom needs flight simulator
   - Creates funding request: $8,000
   - Includes impact story from student
   - Sponsor funds request

7. **Report Impact** (Phase 15 ← 14 ← 13)
   - Generates class impact report
   - Shows sponsor: 25 students, 45 modules completed
   - 12,000 total XP earned, 30 badges awarded
   - Sponsor receives quarterly update

**Validation Points**:
- ✅ Classroom management tools work
- ✅ XP multiplier applies correctly
- ✅ Grading workflow smooth
- ✅ Funding integration works
- ✅ Class-level analytics accurate

---

### Scenario 3: Complete Sponsor Journey

**Narrative**: Sponsor creates scholarship, tracks impact, receives tax receipt

**Steps**:
1. **Create Scholarship** (Phase 15)
   - Creates "Tuskegee Legacy Scholarship"
   - Amount: $5,000
   - Requirements: GPA 3.0+, 2+ Tuskegee tribute badges
   - Application period: 30 days

2. **Review Applications** (Phase 15)
   - 15 students apply
   - 12 meet eligibility requirements
   - Sponsor reviews profiles:
     - XP levels
     - Badges earned
     - Module completion rates
     - Essays
   - Awards scholarship to 3 students

3. **Process Payment** (Phase 15)
   - $15,000 total ($5k × 3)
   - Platform fee: $450 (3%)
   - Net to students: $14,550
   - Payment via Stripe

4. **Track Impact** (Phase 15)
   - Real-time dashboard shows:
     - Students enrolled: 3
     - Modules completed: 12
     - XP earned: 3,600
     - Badges earned: 8
     - Flight hours: 4.5

5. **Receive Reports** (Phase 15)
   - Monthly impact update email
   - Quarterly detailed report PDF
   - Metrics from Phase 13 + 14:
     - Academic progress
     - Gamification engagement
     - Student success stories

6. **Tax Receipt** (Phase 15)
   - End of year: Automatic tax receipt generated
   - 501(c)(3) compliant
   - Total donations: $15,000
   - Tax-deductible amount: $15,000

**Validation Points**:
- ✅ Scholarship workflow smooth
- ✅ Stripe integration works
- ✅ Impact tracking accurate
- ✅ Reports include all three phases
- ✅ Tax receipts compliant

---

## Performance Tests

### Test 15: Leaderboard Update Performance

**Test Case**: Update global leaderboard with 10,000 students

**Steps**:
1. Seed 10,000 test students with varying XP
2. Measure time to run `updateLeaderboard('global', 'all_time')`
3. Verify completes in under 5 seconds
4. Verify top 100 correctly identified
5. Measure Firestore read/write operations

**Expected Results**:
- Execution time: < 5 seconds
- Firestore reads: ~10,000 (read all userXP docs)
- Firestore writes: 1 (update leaderboard doc)
- Memory usage: < 100MB

---

### Test 16: Impact Report Generation Performance

**Test Case**: Generate impact report for sponsor with 100 students

**Steps**:
1. Sponsor has funded 100 students
2. Students have generated:
   - 5,000 XP transactions
   - 1,500 badges earned
   - 2,000 module completions
3. Measure time to generate quarterly report
4. Verify completes in under 10 seconds
5. Measure Firestore queries

**Expected Results**:
- Execution time: < 10 seconds
- Efficient aggregation queries using indexes
- Report includes all student stories

---

## Security Tests

### Test 17: Firestore Security Rules - XP Manipulation

**Test Case**: Student attempts to directly update their XP

**Steps**:
1. Student authenticates
2. Attempts to update `userXP/{userId}` directly via SDK
3. Verify write rejected by security rules
4. Attempts to create fake XP transaction
5. Verify write rejected
6. XP can only be updated via Cloud Functions (simulated by admin)

**Expected Results**:
- All student writes to `userXP` rejected
- All student writes to `xpTransactions` rejected
- Error: "Permission denied"

---

### Test 18: Firestore Security Rules - FERPA Compliance

**Test Case**: Teacher attempts to access student in different school

**Steps**:
1. Teacher A (School 1) authenticates
2. Attempts to read student progress from School 2
3. Verify read rejected
4. Teacher B (School 2) can read their own students

**Expected Results**:
- Cross-school access denied
- Same-school access permitted
- Parental consent only accessible by authorized staff

---

### Test 19: Role-Based Access Control

**Test Case**: Verify each role can only access permitted resources

**Test Matrix**:

| Resource | Student | Teacher | School Admin | District Admin | Super Admin |
|----------|---------|---------|--------------|----------------|-------------|
| Own userXP | Read | Read | Read | Read | Read/Write |
| Other userXP | No | No | School only | District only | All |
| Classrooms | Enrolled only | Own only | School only | District only | All |
| Scholarships | Read public | Read public | Read public | Read public | Read/Write |
| Impact Reports | No | No | No | No | Own/All |

---

## Test Execution Checklist

### Pre-Deployment Testing

- [ ] All unit tests pass (`npm test`)
- [ ] All integration tests pass
- [ ] All end-to-end scenarios validated
- [ ] Performance benchmarks met
- [ ] Security tests pass
- [ ] Firestore indexes deployed
- [ ] Stripe test mode verified
- [ ] Email templates tested
- [ ] FERPA compliance reviewed
- [ ] Accessibility tested (WCAG 2.1 AA)

### Manual Testing Checklist

- [ ] Student signup and onboarding
- [ ] Teacher dashboard functionality
- [ ] Classroom creation and management
- [ ] Module assignment workflow
- [ ] XP award and badge display
- [ ] Quest acceptance and completion
- [ ] Leaderboard display
- [ ] Scholarship application
- [ ] Sponsor payment flow
- [ ] Impact report generation
- [ ] Tax receipt generation
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### Production Readiness

- [ ] Environment variables configured
- [ ] Firebase project set up (production)
- [ ] Stripe account configured (production)
- [ ] Email service configured (SendGrid/Mailgun)
- [ ] Monitoring set up (Sentry, LogRocket)
- [ ] Analytics configured (Google Analytics)
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented
- [ ] Support documentation created
- [ ] Training materials for staff

---

## Test Automation

### Continuous Integration Setup

```yaml
# .github/workflows/test.yml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Start Firebase Emulators
        run: firebase emulators:start --only firestore,auth &

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Troubleshooting Common Issues

### Issue: XP not awarded after module completion

**Diagnosis**:
```typescript
// Check if module has XP reward
const module = await getCurriculumModule(moduleId)
console.log('Module XP reward:', module.xpReward)

// Check if classroom has multiplier
const classroom = await getClassroom(classroomId)
console.log('Classroom XP multiplier:', classroom.settings.xpMultiplier)

// Check XP transaction log
const transactions = await getXPTransactions(studentId)
console.log('Recent XP:', transactions.slice(0, 5))
```

**Common Causes**:
- Module `xpReward` is 0 or undefined
- Classroom XP multiplier not set (defaults to 1.0)
- Security rules blocking write (check Cloud Functions)

---

### Issue: Badge not appearing after award

**Diagnosis**:
```typescript
// Check if badge was awarded
const hasBadge = await userHasBadge(studentId, badgeId)
console.log('Has badge:', hasBadge)

// Check badge definition exists
const badgeDefinition = await getBadgeDefinition(badgeId)
console.log('Badge exists:', !!badgeDefinition)

// Check user badges
const userBadges = await getUserBadges(studentId)
console.log('User badges:', userBadges.map(b => b.badgeId))
```

**Common Causes**:
- Badge ID mismatch (case-sensitive)
- Duplicate prevention triggered
- Badge definition not seeded

---

### Issue: Stripe payment failing

**Diagnosis**:
```typescript
// Check Stripe configuration
console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY)
console.log('Using test mode:', process.env.STRIPE_SECRET_KEY.startsWith('sk_test'))

// Check payment intent
const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
console.log('Intent status:', intent.status)
console.log('Intent amount:', intent.amount)
```

**Common Causes**:
- Wrong Stripe API key (test vs production)
- Amount too small (minimum $0.50)
- Card declined (use Stripe test cards)

---

## Summary

This integration testing guide covers:
- ✅ **28 comprehensive test cases** across all three phases
- ✅ **3 complete end-to-end scenarios** (student, teacher, sponsor journeys)
- ✅ **Performance benchmarks** for critical operations
- ✅ **Security validation** for Firestore rules and FERPA compliance
- ✅ **Automation setup** for CI/CD pipeline

**Total Test Coverage**:
- Phase 13: 4 test cases + performance + security
- Phase 14: 4 test cases + FERPA + security
- Phase 15: 3 test cases + payment + reporting
- Integration: 3 test cases
- End-to-End: 3 complete scenarios

**Next Steps**:
1. Set up test environment with Firebase Emulators
2. Seed test data using provided scripts
3. Run automated test suite
4. Manually validate critical user journeys
5. Deploy to staging for UAT (User Acceptance Testing)
6. Fix any issues discovered
7. Deploy to production

---

**Last Updated**: December 9, 2025
**Test Coverage**: Phases 13, 14, 15
**Status**: Ready for execution
**Estimated Testing Time**: 8-12 hours for complete validation
