# Hidden Treasures Network

> Empowering the Next Generation Through Aviation & STEM

A global platform connecting aviation and STEM education organizations, mentors, students, and sponsors to impact **one million lives by 2030**.

## 🌟 Overview

Hidden Treasures Network is the digital layer of Flight Plan 2030, an initiative by **Infinity Aero Club Tampa Bay, Inc.** (501(c)(3) nonprofit) in partnership with **Gleim Aviation**. Our mission is to unite aviation and STEM education organizations worldwide to share resources, amplify impact, and create pathways for underserved youth.

## 🎯 Mission

Connect aviation and STEM education organizations worldwide to share resources, amplify impact, and empower underserved youth through aviation, STEM, and entrepreneurship education.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** lucide-react
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Maps:** Mapbox GL JS
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase account
- Mapbox account (for map features)

## 🛠️ Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/infinitycollaborative/Hidden-Treasures-Network.git
cd Hidden-Treasures-Network
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your credentials:

```env
# Firebase Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Mapbox Configuration (from Mapbox Account)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Create **Firestore Database** (production mode)
5. Enable **Storage**
6. Copy configuration to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Hidden-Treasures-Network/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register, forgot-password)
│   ├── dashboard/         # Role-based dashboards
│   │   ├── student/
│   │   ├── mentor/
│   │   ├── organization/
│   │   ├── sponsor/
│   │   └── admin/
│   ├── network/           # Network features (map, directory)
│   ├── impact/            # Impact dashboard & stories
│   ├── resources/         # Resource library
│   ├── events/            # Events calendar
│   ├── get-involved/      # Get involved page
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/            # Header, Footer, Navigation
│   ├── ui/                # shadcn/ui components
│   └── auth/              # Auth components
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── auth.ts            # Auth utilities
│   ├── validations.ts     # Zod schemas
│   └── utils.ts           # Helpers
├── hooks/
│   └── use-auth.ts        # Auth hook
├── types/
│   └── index.ts           # TypeScript types
└── public/                # Static assets
```

## 👥 User Roles

The platform supports five user roles with distinct dashboards:

1. **Student** - Access mentorship and educational programs
2. **Mentor** - Share expertise and guide students
3. **Organization** - Manage programs and collaborate
4. **Sponsor** - Support programs and track impact
5. **Admin** - Platform administration

## 🔐 Authentication Flow

1. User registers with email/password or Google OAuth
2. Selects role (student, mentor, organization, sponsor)
3. Completes profile information
4. User profile stored in Firestore `users` collection
5. Redirected to role-specific dashboard

## 🗄️ Data Structure

### users Collection

```typescript
{
  uid: string
  email: string
  role: 'student' | 'mentor' | 'organization' | 'sponsor' | 'admin'
  displayName: string
  organizationName?: string
  location?: { city, state, country }
  profileComplete: boolean
  createdAt: Timestamp
  lastLoginAt?: Timestamp
}
```

See `types/index.ts` for complete type definitions.

## 🎨 Brand Design

### Colors
- **Primary Sky Blue:** `#0ea5e9`
- **Navy:** `#1e3a8a` to `#0c4a6e`
- **Gold:** `#f59e0b`
- **Red:** `#dc2626` (Red Tail tribute)

### Typography
- **Headings:** Montserrat (600-800)
- **Body:** Inter (400-600)
- **Display:** Bebas Neue

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard under Project Settings > Environment Variables.

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## ✅ Phase 1 Deliverables (Complete)

- [x] Next.js 14 + TypeScript setup
- [x] Tailwind CSS with custom brand colors
- [x] Firebase integration (Auth, Firestore, Storage)
- [x] shadcn/ui components
- [x] Authentication system with role-based access
- [x] Homepage with hero, mission, stats, stories, events
- [x] Role-based dashboard routing
- [x] Login, Register, Forgot Password pages
- [x] Scaffolded dashboards for all 5 roles
- [x] Scaffolded Network, Impact, Resources, Events pages
- [x] Type definitions for all data models
- [x] Responsive design system

## 🤝 Contributing

This is a nonprofit initiative. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Contact

- **Website:** [HiddenTreasuresNetwork.org](https://hiddentreasuresnetwork.org)
- **Email:** info@hiddentreasuresnetwork.org
- **Organization:** Infinity Aero Club Tampa Bay, Inc.
- **Partner:** Gleim Aviation

## 📄 License

Copyright © 2024-2025 Infinity Aero Club Tampa Bay, Inc. All rights reserved.

---

**Built with ❤️ to impact one million lives by 2030**
