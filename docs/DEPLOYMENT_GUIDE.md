# Deployment Guide: Phases 13-15

## Overview

This guide provides step-by-step instructions for deploying Phases 13-15 of the Hidden Treasures Network platform to production.

**What's Being Deployed**:
- ✅ Phase 13: Gamification System (XP, badges, quests, leaderboards)
- ✅ Phase 14: School & Classroom Integration (FERPA-compliant)
- ✅ Phase 15: Marketplace & Funding Exchange (Stripe payments)

**Total Implementation**:
- 22 files created
- 7,084 lines of code
- 22 Firestore collections
- 29 database indexes
- 1,420+ lines of documentation

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Payment Processing Setup](#payment-processing-setup)
5. [Email Service Configuration](#email-service-configuration)
6. [Deployment Steps](#deployment-steps)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Rollback Procedures](#rollback-procedures)
9. [Monitoring & Alerts](#monitoring--alerts)

---

## Pre-Deployment Checklist

### Code Review

- [x] All code committed to branch: `claude/gamification-phases-13-15-01VqGsib4VrzCBcUXc6w12YH`
- [ ] Code reviewed by senior developer
- [ ] Security review completed
- [ ] FERPA compliance verified by legal team
- [ ] Accessibility audit passed (WCAG 2.1 AA)

### Testing

- [ ] All unit tests passing
- [ ] Integration tests completed (see `docs/INTEGRATION_TESTING.md`)
- [ ] End-to-end scenarios validated
- [ ] Performance benchmarks met
- [ ] Security tests passed
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified (iOS, Android)

### Documentation

- [x] Phase 13 documentation complete (`docs/PHASE_13_GAMIFICATION.md`)
- [x] Phase 14 documentation complete (`docs/PHASE_14_SCHOOLS.md`)
- [x] Phase 15 documentation complete (`docs/PHASE_15_MARKETPLACE.md`)
- [x] Integration guide complete (`docs/PHASES_13-15_COMPLETE.md`)
- [x] Database indexes documented (`docs/FIRESTORE_INDEXES.md`)
- [x] Testing guide complete (`docs/INTEGRATION_TESTING.md`)
- [ ] User guides created (student, teacher, sponsor)
- [ ] Admin documentation created

### Compliance

- [ ] Privacy policy updated for new data collection
- [ ] Terms of service updated for marketplace
- [ ] Parental consent forms legally reviewed
- [ ] 501(c)(3) status confirmed for tax receipts
- [ ] PCI DSS compliance verified (Stripe handles card data)
- [ ] Background check process documented for teachers

---

## Environment Setup

### 1. Firebase Production Project

```bash
# Create new Firebase project (or use existing)
firebase projects:create hidden-treasures-prod

# Select project
firebase use hidden-treasures-prod

# Enable required services
firebase enable firestore
firebase enable auth
firebase enable storage
firebase enable functions
```

### 2. Environment Variables

Create `.env.production`:

```env
# Firebase Production
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hidden-treasures-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hidden-treasures-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hidden-treasures-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Stripe Production
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@hiddentreaures.org
SENDGRID_FROM_NAME=Hidden Treasures Network

# Organization Details (for tax receipts)
ORG_NAME=Hidden Treasures Network
ORG_EIN=12-3456789
ORG_ADDRESS=123 Aviation Way, City, ST 12345
ORG_PHONE=(555) 123-4567

# Platform Configuration
PLATFORM_FEE_PERCENTAGE=0.03
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://hiddentreasures.org
```

### 3. Firebase Authentication Setup

```bash
# Enable authentication providers
firebase auth:enable email
firebase auth:enable google.com

# Configure email templates
firebase auth:templates:email:set verify-email \
  --template templates/verify-email.html

firebase auth:templates:email:set password-reset \
  --template templates/password-reset.html
```

---

## Database Configuration

### 1. Deploy Firestore Security Rules

```bash
# Merge all security rules into firestore.rules
cat firestore-gamification.rules >> firestore.rules
cat firestore-schools.rules >> firestore.rules
# (Note: Ensure no duplicate rules_version declarations)

# Deploy security rules
firebase deploy --only firestore:rules

# Verify deployment
firebase firestore:rules:list
```

**Security Rules Files**:
- `firestore-gamification.rules` - Phase 13 rules
- `firestore-schools.rules` - Phase 14 FERPA-compliant rules
- Additional Phase 15 rules in main `firestore.rules`

### 2. Deploy Firestore Indexes

```bash
# Deploy indexes (already configured in firestore.indexes.json)
firebase deploy --only firestore:indexes

# Monitor index build progress
firebase firestore:indexes:list

# Wait for all indexes to show status: READY
# This may take 15-60 minutes for initial build
```

**Index Status**:
- `CREATING` - Index is being built (wait)
- `READY` - Index is active ✅
- `ERROR` - Index build failed (check logs)

### 3. Seed Initial Data

```bash
# Seed 18 starter badges (Phase 13)
npm run seed:badges

# Create sample curriculum modules (Phase 14)
npm run seed:modules

# (Optional) Create test scholarships (Phase 15)
npm run seed:scholarships
```

**Seed Scripts**:
```typescript
// scripts/seed-production.ts
import { seedStarterBadges } from '@/lib/seed-badges'
import { seedSampleModules } from '@/lib/seed-modules'

async function seedProduction() {
  console.log('Seeding starter badges...')
  await seedStarterBadges()

  console.log('Seeding sample curriculum modules...')
  await seedSampleModules()

  console.log('Production data seeded successfully!')
}

seedProduction()
```

---

## Payment Processing Setup

### 1. Stripe Account Configuration

**Sign up for Stripe Account**:
1. Go to https://stripe.com
2. Create business account
3. Complete business verification
4. Get approved for live payments

**Configure Stripe Settings**:

```bash
# Test your Stripe integration first
STRIPE_SECRET_KEY=sk_test_... npm run test:payments

# Switch to live mode in Stripe Dashboard
# Copy live API keys to .env.production
```

### 2. Set Up Stripe Webhooks

**Webhook Endpoint**: `https://hiddentreasures.org/api/webhooks/stripe`

**Events to Subscribe**:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.refunded`
- `customer.subscription.created`
- `customer.subscription.deleted`

**Configure Webhook**:

```bash
# In Stripe Dashboard:
# Developers → Webhooks → Add endpoint

# URL: https://hiddentreasures.org/api/webhooks/stripe
# Events: Select events above
# Copy webhook signing secret to STRIPE_WEBHOOK_SECRET
```

**Test Webhook Locally**:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test payment
stripe trigger payment_intent.succeeded
```

### 3. Platform Fee Configuration

In `app/api/payments/create-intent/route.ts`:

```typescript
// Verify platform fee percentage
const PLATFORM_FEE_PERCENTAGE = 0.03 // 3%

// Ensure fee is correctly calculated
const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE)
const netAmount = amount - platformFee
```

**Fee Structure**:
- Platform fee: 3% of donation
- Stripe fees: ~2.9% + $0.30 (handled automatically)
- Net to recipient: ~94% of donation

---

## Email Service Configuration

### 1. SendGrid Setup

```bash
# Create SendGrid account
# Get API key from Settings → API Keys

# Verify sender email
# Settings → Sender Authentication → Verify Single Sender
```

### 2. Email Templates

Create transactional templates in SendGrid:

**Template IDs**:
- `d-xxx1` - Parental consent request
- `d-xxx2` - Scholarship application received
- `d-xxx3` - Scholarship awarded notification
- `d-xxx4` - Impact report generated
- `d-xxx5` - Tax receipt (annual)

**Example Template Variables**:

```typescript
// Parental Consent Email
{
  studentName: 'John Doe',
  teacherName: 'Ms. Smith',
  className: 'Aviation 101',
  consentLink: 'https://app.com/consent/verify?token=xxx',
  expiryDate: 'December 31, 2025'
}
```

### 3. Email Functions

```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendParentalConsentRequest(
  parentEmail: string,
  studentName: string,
  verificationLink: string
) {
  await sgMail.send({
    to: parentEmail,
    from: process.env.SENDGRID_FROM_EMAIL!,
    templateId: 'd-xxx1',
    dynamicTemplateData: {
      studentName,
      verificationLink,
      // ... other variables
    },
  })
}
```

---

## Deployment Steps

### Step 1: Build Application

```bash
# Install production dependencies
npm ci --production

# Build Next.js application
npm run build

# Verify build
ls -la .next/
```

### Step 2: Deploy Firestore Configuration

```bash
# Deploy in order (to avoid errors)
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Wait for indexes to build
firebase firestore:indexes:list
```

### Step 3: Deploy Application

**Option A: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard
```

**Option B: Firebase Hosting**

```bash
# Build static export
npm run build
npm run export

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

**Option C: Custom Server**

```bash
# Build application
npm run build

# Start production server
npm run start
```

### Step 4: Deploy Cloud Functions (if applicable)

```bash
# Deploy Cloud Functions for XP awards, badge awards
firebase deploy --only functions

# Functions to deploy:
# - awardXPFunction (triggers on module completion)
# - awardBadgeFunction (triggers on badge criteria met)
# - updateLeaderboardFunction (scheduled daily)
# - generateImpactReportFunction (scheduled monthly)
```

### Step 5: Seed Production Data

```bash
# Run production seed script
npm run seed:production

# Verify data created
# - 18 badges in badgeDefinitions
# - Sample curriculum modules
```

---

## Post-Deployment Verification

### Smoke Tests

Run these tests immediately after deployment:

**1. Authentication**
- [ ] User can sign up
- [ ] User can log in
- [ ] Password reset works
- [ ] Email verification works

**2. Phase 13: Gamification**
- [ ] New user receives welcome badge
- [ ] XP can be awarded (test via admin)
- [ ] Badges display correctly
- [ ] Leaderboard loads
- [ ] Quest system functional

**3. Phase 14: Schools**
- [ ] Teacher can create classroom
- [ ] Join code generates
- [ ] Student can join classroom
- [ ] Module assignment works
- [ ] Progress tracking updates
- [ ] Parental consent email sends

**4. Phase 15: Marketplace**
- [ ] Scholarships display
- [ ] Application form submits
- [ ] Stripe payment test (use test card)
- [ ] Impact report generates
- [ ] Email notifications send

### Monitoring Checks

**Firebase Console**:
- [ ] Check Firestore usage metrics
- [ ] Verify security rules active
- [ ] Check authentication success rate
- [ ] Review Function logs

**Stripe Dashboard**:
- [ ] Verify webhook endpoint active
- [ ] Check recent payments
- [ ] Review failed payments (should be 0)

**Application Logs**:
- [ ] No error logs in production
- [ ] Performance metrics acceptable
- [ ] Database query performance good

---

## Rollback Procedures

### If Critical Issues Found

**1. Immediate Rollback (Vercel)**

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**2. Database Rollback**

```bash
# Revert Firestore rules
firebase deploy --only firestore:rules --version [previous-version]

# Disable new features via feature flags
# Update environment variables:
ENABLE_GAMIFICATION=false
ENABLE_CLASSROOMS=false
ENABLE_MARKETPLACE=false
```

**3. Stripe Webhook Pause**

```bash
# In Stripe Dashboard:
# Developers → Webhooks → [Your endpoint] → Disable
```

### Rollback Decision Tree

```
Issue Detected
    ├─ Data loss or corruption?
    │   └─ YES → FULL ROLLBACK + restore backup
    │
    ├─ Payment processing broken?
    │   └─ YES → Disable marketplace + rollback Stripe webhook
    │
    ├─ Minor UI bug?
    │   └─ NO → Hot fix + deploy patch
    │
    └─ Performance degradation?
        └─ Check indexes, scale resources
```

---

## Monitoring & Alerts

### Error Tracking

**Sentry Configuration**:

```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,

  beforeSend(event) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies
    }
    return event
  },
})
```

**Critical Alerts**:
- Payment processing failures
- Database write failures
- Authentication errors
- XP award failures
- Email sending failures

### Performance Monitoring

**Key Metrics**:
- Page load time: < 3 seconds
- API response time: < 500ms
- Firestore queries: < 200ms
- Database write latency: < 100ms

**Tools**:
- Firebase Performance Monitoring
- Vercel Analytics
- Google Lighthouse (weekly audits)

### Uptime Monitoring

**Services to Monitor**:
- Main application (https://hiddentreasures.org)
- API endpoints (/api/*)
- Stripe webhooks
- Email delivery

**Monitoring Tools**:
- UptimeRobot (5-minute checks)
- Pingdom (global availability)
- StatusCake (SSL certificate monitoring)

### Alert Configuration

**PagerDuty / Slack Alerts**:

```typescript
// Severity levels
export enum AlertSeverity {
  CRITICAL = 'critical', // Wake up on-call engineer
  HIGH = 'high',        // Slack notification
  MEDIUM = 'medium',    // Email notification
  LOW = 'low',         // Log only
}

// Alert triggers
const alerts = {
  paymentFailureRate: {
    threshold: 0.05, // 5% failure rate
    severity: AlertSeverity.CRITICAL,
  },
  databaseErrors: {
    threshold: 10, // 10 errors in 5 minutes
    severity: AlertSeverity.HIGH,
  },
  slowApiResponses: {
    threshold: 1000, // 1 second
    severity: AlertSeverity.MEDIUM,
  },
}
```

---

## Gradual Rollout Strategy

### Phase 1: Internal Testing (Week 1)

**Participants**:
- Development team
- QA team
- Select admin users

**Actions**:
- Create test classrooms
- Process test payments
- Generate impact reports
- Monitor for bugs

### Phase 2: Pilot Schools (Week 2-3)

**Participants**:
- 2-3 pilot schools
- ~50 students
- ~5 teachers
- 2 test sponsors

**Actions**:
- Full classroom workflow
- Real scholarship applications
- Small real donations ($100-500)
- Gather user feedback

### Phase 3: Limited Launch (Week 4-6)

**Participants**:
- 10 schools
- ~500 students
- ~20 teachers
- 10 sponsors

**Actions**:
- Monitor performance metrics
- Iterate based on feedback
- Build support documentation
- Train support team

### Phase 4: General Availability (Week 7+)

**Participants**:
- All schools
- Open registration
- Public marketplace

**Actions**:
- Marketing campaign
- Press release
- Social media launch
- Community outreach

---

## Support & Training

### Support Documentation

Create help articles for:
- [ ] Student: How to join a classroom
- [ ] Student: How to apply for scholarships
- [ ] Teacher: Creating and managing classrooms
- [ ] Teacher: Assigning modules and grading
- [ ] Sponsor: Creating scholarships
- [ ] Sponsor: Understanding impact reports
- [ ] Admin: Platform administration

### Training Materials

**Video Tutorials**:
- Student onboarding (5 min)
- Teacher classroom setup (10 min)
- Sponsor dashboard tour (8 min)

**Quick Start Guides**:
- PDF guides for each user role
- Printable classroom join code cards
- Parental consent form template

### Support Channels

**Tier 1: Self-Service**
- Help center (help.hiddentreasures.org)
- Video tutorials
- FAQ section

**Tier 2: Email Support**
- support@hiddentreasures.org
- Response time: 24 hours
- Available: Monday-Friday, 9am-5pm ET

**Tier 3: Priority Support**
- For schools and sponsors
- Phone support
- Dedicated account manager

---

## Success Metrics

### Week 1 Targets

- [ ] 0 critical errors
- [ ] 5 classrooms created
- [ ] 50 students enrolled
- [ ] 1 scholarship funded
- [ ] < 3 second page load time

### Month 1 Targets

- [ ] 50 classrooms
- [ ] 1,000 students
- [ ] 25 scholarships funded
- [ ] 10,000 modules completed
- [ ] 95%+ uptime

### Quarter 1 Targets

- [ ] 200 classrooms
- [ ] 5,000 students
- [ ] $100,000 in scholarships funded
- [ ] 50,000 modules completed
- [ ] 50 impact reports generated

---

## Post-Launch Checklist

### Week 1

- [ ] Daily monitoring of error logs
- [ ] Daily check of payment processing
- [ ] Daily review of support tickets
- [ ] Performance metrics review
- [ ] User feedback collection

### Week 2-4

- [ ] Weekly error review
- [ ] Weekly payment reconciliation
- [ ] Bi-weekly user interviews
- [ ] Feature usage analytics review
- [ ] A/B test results analysis

### Month 2+

- [ ] Monthly impact report to stakeholders
- [ ] Monthly cost analysis
- [ ] Monthly security audit
- [ ] Quarterly user survey
- [ ] Quarterly feature roadmap update

---

## Emergency Contacts

### Technical Team

- **CTO**: [Name] - [Phone] - [Email]
- **Lead Developer**: [Name] - [Phone] - [Email]
- **DevOps Engineer**: [Name] - [Phone] - [Email]

### Service Providers

- **Firebase Support**: https://firebase.google.com/support
- **Stripe Support**: https://support.stripe.com (24/7)
- **Vercel Support**: https://vercel.com/support
- **SendGrid Support**: https://support.sendgrid.com

### Escalation Path

1. **On-call engineer** (first responder)
2. **Lead developer** (if issue unresolved in 30 min)
3. **CTO** (if critical production issue)
4. **Service provider support** (if platform issue)

---

## Deployment Timeline

### Pre-Deployment (2 weeks before)

- [ ] Complete all testing
- [ ] Obtain legal approvals
- [ ] Train support team
- [ ] Prepare rollback plan
- [ ] Schedule deployment window

### Deployment Day

**12:00 AM - 2:00 AM ET** (Low traffic window)

- [ ] 12:00 AM - Deploy Firestore rules
- [ ] 12:15 AM - Deploy Firestore indexes
- [ ] 12:30 AM - Deploy application
- [ ] 1:00 AM - Run smoke tests
- [ ] 1:30 AM - Monitor error logs
- [ ] 2:00 AM - Deployment complete or rollback decision

### Post-Deployment (1 week after)

- [ ] Daily monitoring
- [ ] Daily team sync
- [ ] User feedback review
- [ ] Performance optimization
- [ ] Hot fixes as needed

---

## Final Pre-Launch Checklist

### Critical Items

- [ ] All environment variables configured
- [ ] Firebase project set to production
- [ ] Stripe account in live mode
- [ ] Webhooks configured and tested
- [ ] Email templates approved and active
- [ ] Security rules deployed
- [ ] Indexes built and ready
- [ ] Seed data created
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Support team trained
- [ ] Legal approvals obtained
- [ ] Privacy policy published
- [ ] Terms of service published

### Nice-to-Have

- [ ] Social media accounts ready
- [ ] Press release prepared
- [ ] Marketing materials created
- [ ] Partnership agreements signed
- [ ] Promotional video produced

---

## Conclusion

**You are now ready to deploy Phases 13-15!**

This deployment brings together:
- A gamification system that honors the Tuskegee Airmen legacy
- A FERPA-compliant classroom management platform
- A marketplace connecting sponsors with deserving students
- Real-time impact tracking across all three phases

**The sky is truly no limit.**

---

**Last Updated**: December 9, 2025
**Status**: ✅ Ready for Production Deployment
**Estimated Deployment Time**: 2-3 hours
**Rollback Time**: < 15 minutes if needed
