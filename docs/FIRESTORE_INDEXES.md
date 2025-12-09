# Firestore Database Indexes

## Overview

This document describes all Firestore indexes required for optimal query performance across the Hidden Treasures Network platform. The indexes are organized by phase and collection.

**Total Indexes**: 28 composite indexes

## Index Summary by Phase

| Phase | Collections | Indexes | Purpose |
|-------|-------------|---------|---------|
| **Phase 13** | 7 collections | 10 indexes | Gamification queries |
| **Phase 14** | 8 collections | 11 indexes | School & classroom queries |
| **Phase 15** | 7 collections | 7 indexes | Marketplace & funding queries |

---

## Phase 13: Gamification System Indexes

### userBadges Collection (2 indexes)

**Index 1: User Badge History**
```json
{
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "awardedAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: Get all badges for a user, sorted by award date
- **Usage**: Student dashboard, badge showcase

**Index 2: User Badges by Category**
```json
{
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "badgeCategory", "order": "ASCENDING" }
  ]
}
```
- **Query**: Get badges by category for a user
- **Usage**: Badge filtering, category-specific displays

### xpTransactions Collection (2 indexes)

**Index 3: User XP Transaction History**
```json
{
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "timestamp", "order": "DESCENDING" }
  ]
}
```
- **Query**: Get XP history for a user
- **Usage**: XP transaction log, audit trail

**Index 4: User XP by Category**
```json
{
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "category", "order": "ASCENDING" }
  ]
}
```
- **Query**: Get XP transactions by category
- **Usage**: Category-specific XP analytics

### userXP Collection (1 index)

**Index 5: XP Leaderboard**
```json
{
  "fields": [
    { "fieldPath": "totalXP", "order": "DESCENDING" }
  ]
}
```
- **Query**: Global leaderboard rankings
- **Usage**: Leaderboard generation

### quests Collection (2 indexes)

**Index 6: Active Quests by Type**
```json
{
  "fields": [
    { "fieldPath": "isActive", "order": "ASCENDING" },
    { "fieldPath": "type", "order": "ASCENDING" },
    { "fieldPath": "difficulty", "order": "ASCENDING" }
  ]
}
```
- **Query**: Get active quests filtered by type and difficulty
- **Usage**: Quest marketplace, quest filtering

**Index 7: Active Quests by Deadline**
```json
{
  "fields": [
    { "fieldPath": "isActive", "order": "ASCENDING" },
    { "fieldPath": "endDate", "order": "ASCENDING" }
  ]
}
```
- **Query**: Get active quests sorted by deadline
- **Usage**: Urgent quest alerts, expiring quests

### userQuests Collection (2 indexes)

**Index 8: User Quest History**
```json
{
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "startedAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: Get quests by user and status
- **Usage**: Active/completed quest lists

**Index 9: User Quest Deduplication**
```json
{
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "questId", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" }
  ]
}
```
- **Query**: Check if user already has quest
- **Usage**: Prevent duplicate quest enrollment

### leaderboards Collection (2 indexes)

**Index 10: Leaderboard Lookup**
```json
{
  "fields": [
    { "fieldPath": "type", "order": "ASCENDING" },
    { "fieldPath": "period", "order": "ASCENDING" },
    { "fieldPath": "lastUpdated", "order": "DESCENDING" }
  ]
}
```
- **Query**: Get latest leaderboard by type and period
- **Usage**: Leaderboard display

**Index 11: Leaderboard Scoping**
```json
{
  "fields": [
    { "fieldPath": "type", "order": "ASCENDING" },
    { "fieldPath": "period", "order": "ASCENDING" },
    { "fieldPath": "scope", "order": "ASCENDING" }
  ]
}
```
- **Query**: Get scoped leaderboards (global, regional, etc.)
- **Usage**: Multi-scope leaderboard views

---

## Phase 14: School & Classroom Integration Indexes

### districts Collection (1 index)

**Index 12: Active Districts**
```json
{
  "fields": [
    { "fieldPath": "isActive", "order": "ASCENDING" },
    { "fieldPath": "name", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:78` - Get all active districts
- **Usage**: District selection dropdown

### schools Collection (2 indexes)

**Index 13: Schools by District**
```json
{
  "fields": [
    { "fieldPath": "districtId", "order": "ASCENDING" },
    { "fieldPath": "isActive", "order": "ASCENDING" },
    { "fieldPath": "name", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:141-143` - Get active schools in district
- **Usage**: District admin school list

**Index 14: Schools by Status**
```json
{
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "name", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:160-161` - Get schools by status
- **Usage**: Public school directory

### classrooms Collection (2 indexes)

**Index 15: Teacher Classrooms**
```json
{
  "fields": [
    { "fieldPath": "teacherId", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:270-272` - Get teacher's classrooms
- **Usage**: Teacher dashboard (`app/dashboard/teacher/page.tsx:29`)

**Index 16: School Classrooms**
```json
{
  "fields": [
    { "fieldPath": "schoolId", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "name", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:289-291` - Get active classrooms in school
- **Usage**: School admin classroom list

### classroomRoster Collection (2 indexes)

**Index 17: Student Enrollment Check**
```json
{
  "fields": [
    { "fieldPath": "classroomId", "order": "ASCENDING" },
    { "fieldPath": "studentId", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:335-336` - Check if student is enrolled
- **Usage**: Enrollment validation, duplicate prevention

**Index 18: Active Roster**
```json
{
  "fields": [
    { "fieldPath": "classroomId", "order": "ASCENDING" },
    { "fieldPath": "enrollmentStatus", "order": "ASCENDING" },
    { "fieldPath": "studentName", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:398-400` - Get active students alphabetically
- **Usage**: Classroom roster display

### curriculumModules Collection (1 index)

**Index 19: Published Modules**
```json
{
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "title", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:469-470` - Get published modules
- **Usage**: Module marketplace, teacher module selection

### moduleAssignments Collection (1 index)

**Index 20: Classroom Assignments**
```json
{
  "fields": [
    { "fieldPath": "classroomId", "order": "ASCENDING" },
    { "fieldPath": "assignedAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:533-534` - Get classroom assignments
- **Usage**: Teacher assignment view

### studentProgress Collection (2 indexes)

**Index 21: Progress Lookup**
```json
{
  "fields": [
    { "fieldPath": "classroomId", "order": "ASCENDING" },
    { "fieldPath": "studentId", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:684-685` - Check existing progress
- **Usage**: Progress deduplication

**Index 22: Student Progress History**
```json
{
  "fields": [
    { "fieldPath": "studentId", "order": "ASCENDING" },
    { "fieldPath": "classroomId", "order": "ASCENDING" },
    { "fieldPath": "updatedAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:715-717` - Get student progress
- **Usage**: Student dashboard, progress tracking

### parentalConsent Collection (1 index)

**Index 23: Student Consents**
```json
{
  "fields": [
    { "fieldPath": "studentId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-schools.ts:789-790` - Get student consents
- **Usage**: FERPA compliance verification

---

## Phase 15: Marketplace & Funding Exchange Indexes

### scholarships Collection (1 index)

**Index 24: Open Scholarships**
```json
{
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "applicationPeriod.endDate", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-marketplace.ts:67-69` - Get open scholarships by deadline
- **Usage**: Scholarship marketplace

### scholarshipApplications Collection (2 indexes)

**Index 25: Application Deduplication**
```json
{
  "fields": [
    { "fieldPath": "scholarshipId", "order": "ASCENDING" },
    { "fieldPath": "studentId", "order": "ASCENDING" }
  ]
}
```
- **Query**: `lib/db-marketplace.ts:117-118` - Check duplicate application
- **Usage**: Prevent multiple applications

**Index 26: Student Applications**
```json
{
  "fields": [
    { "fieldPath": "studentId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-marketplace.ts:174-175` - Get student's applications
- **Usage**: Student application history

### fundingRequests Collection (1 index)

**Index 27: Active Funding Requests**
```json
{
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-marketplace.ts:222-223` - Get approved funding requests
- **Usage**: Funding marketplace

### sponsorships Collection (1 index)

**Index 28: Sponsor Donations**
```json
{
  "fields": [
    { "fieldPath": "sponsorId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-marketplace.ts:386-387` - Get sponsor's donations
- **Usage**: Sponsor dashboard, donation history

### impactReports Collection (1 index)

**Index 29: Sponsor Reports**
```json
{
  "fields": [
    { "fieldPath": "sponsorId", "order": "ASCENDING" },
    { "fieldPath": "generatedAt", "order": "DESCENDING" }
  ]
}
```
- **Query**: `lib/db-marketplace.ts:532-533` - Get sponsor's impact reports
- **Usage**: Sponsor impact dashboard

---

## Deployment Instructions

### Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Authenticated with Firebase (`firebase login`)
- Firebase project initialized in this directory

### Deploy Indexes

```bash
# Deploy only indexes (recommended)
firebase deploy --only firestore:indexes

# Deploy all Firestore configs (indexes + rules)
firebase deploy --only firestore

# Check deployment status
firebase firestore:indexes:list
```

### Index Build Time

After deployment, Firebase will build the indexes in the background. Build time depends on:
- Number of existing documents in each collection
- Index complexity (number of fields)
- Current Firebase workload

**Estimated Build Time**:
- Empty database: 1-2 minutes
- Small database (<10k docs): 5-15 minutes
- Medium database (10k-100k docs): 15-60 minutes
- Large database (>100k docs): 1+ hours

You can monitor index build progress:
```bash
firebase firestore:indexes:list
```

Status indicators:
- `CREATING` - Index is being built
- `READY` - Index is active and serving queries
- `ERROR` - Index build failed (check logs)

### Testing Indexes Locally

Use Firebase Emulator Suite to test indexes before production:

```bash
# Start Firestore emulator
firebase emulators:start --only firestore

# Indexes are automatically loaded from firestore.indexes.json
```

The emulator will warn you if queries require missing indexes.

---

## Performance Optimization

### Query Performance Guidelines

**Without Indexes**:
- Simple queries: ~500ms - 2s
- Complex queries: 2s - 10s+
- May fail with "The query requires an index" error

**With Indexes**:
- All queries: 50ms - 200ms
- Consistent performance regardless of collection size
- No index errors

### Index Maintenance

**Best Practices**:
1. Create indexes for all production queries
2. Remove unused indexes to reduce storage costs
3. Monitor index usage in Firebase Console
4. Update indexes when query patterns change

**Cost Considerations**:
- Each index increases storage by ~20-30%
- More indexes = higher storage costs
- But: Faster queries = lower compute costs
- Net benefit: Indexes are worth it for production

### Monitoring

Track index usage in Firebase Console:
- **Console** → **Firestore Database** → **Indexes**
- Check "Composite" tab for all custom indexes
- Review "Usage" metrics to identify unused indexes

---

## Troubleshooting

### Common Issues

**Error: "The query requires an index"**
- **Cause**: Missing composite index
- **Fix**: Add index to `firestore.indexes.json` and redeploy
- **Quick Fix**: Click the error link to auto-create index in Console

**Error: "Index build failed"**
- **Cause**: Invalid field path or conflicting index
- **Fix**: Check field names match your schema exactly
- **Tip**: Nested fields use dot notation (e.g., `applicationPeriod.endDate`)

**Slow Queries Despite Indexes**
- **Cause**: May need additional fields in index
- **Fix**: Analyze query in Firestore Console to see execution plan
- **Tool**: Use `explain()` method in Firebase SDK to debug

**Index Not Used**
- **Cause**: Query doesn't exactly match index definition
- **Fix**: Field order in query must match index definition
- **Example**: Index with `status` then `createdAt` won't work for query with only `createdAt`

---

## Index Coverage Report

| Collection | Documents (Est.) | Indexes | Coverage |
|------------|------------------|---------|----------|
| userXP | 10,000 | 1 | ✅ Full |
| xpTransactions | 100,000 | 2 | ✅ Full |
| badgeDefinitions | 18 | 0 | ✅ Small |
| userBadges | 50,000 | 2 | ✅ Full |
| quests | 100 | 2 | ✅ Full |
| userQuests | 20,000 | 2 | ✅ Full |
| leaderboards | 50 | 2 | ✅ Full |
| districts | 100 | 1 | ✅ Full |
| schools | 1,000 | 2 | ✅ Full |
| classrooms | 5,000 | 2 | ✅ Full |
| classroomRoster | 100,000 | 2 | ✅ Full |
| curriculumModules | 500 | 1 | ✅ Full |
| moduleAssignments | 50,000 | 1 | ✅ Full |
| studentProgress | 200,000 | 2 | ✅ Full |
| parentalConsent | 20,000 | 1 | ✅ Full |
| scholarships | 200 | 1 | ✅ Full |
| scholarshipApplications | 10,000 | 2 | ✅ Full |
| fundingRequests | 1,000 | 1 | ✅ Full |
| sponsorships | 5,000 | 1 | ✅ Full |
| impactReports | 2,000 | 1 | ✅ Full |
| taxReceipts | 1,000 | 0 | ⚠️ Rare query |
| sponsorMatches | 5,000 | 0 | ⚠️ Rare query |

**Coverage**: ✅ Full = All queries indexed | ⚠️ Rare = Low-frequency queries without indexes

---

## Future Index Considerations

As the platform grows, consider adding indexes for:

1. **Advanced Analytics**:
   - Multi-field aggregation indexes
   - Time-series indexes for trend analysis

2. **Advanced Filtering**:
   - Scholarship filters (amount range, category, eligibility)
   - Module filters (subject, difficulty, duration)

3. **Search Optimization**:
   - Full-text search requires external service (Algolia, Elasticsearch)
   - Consider for: student search, module search, sponsor search

4. **Geospatial Queries**:
   - If adding location-based features (nearby schools, local sponsors)
   - Requires Firebase GeoPoint and specialized indexes

---

**Last Updated**: December 9, 2025
**Total Indexes**: 29 composite indexes
**Collections Covered**: 22 collections
**Status**: ✅ Production Ready
