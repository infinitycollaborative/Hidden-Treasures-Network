# Hidden Treasures Network

A global platform connecting aviation and STEM education organizations, mentors, students, and sponsors under a unified mission to impact **one million lives by 2030**.

## 🎯 Mission

Connect aviation and STEM education organizations worldwide to share resources, amplify impact, and empower underserved youth through aviation, STEM, and entrepreneurship education.

## 🏢 About
A professional web application connecting aviation and STEM education organizations, mentors, students, and sponsors under a unified mission to impact one million lives by 2030.

## 🎯 Mission

To empower underserved youth worldwide through aviation, STEM, and entrepreneurship education by creating a unified network that amplifies resources, shares knowledge, and multiplies impact across organizations.

## 🏢 Organization

**Parent Organization:** Infinity Aero Club Tampa Bay, Inc. (501c3 nonprofit)
**Founder & CEO:** Ricardo "Tattoo" Foster, LCDR USN (Ret.)
**Domain:** [HiddenTreasuresNetwork.org](https://hiddentreasuresnetwork.org)

## 🚀 Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with custom brand configuration
## 🚀 Features

- **Organization Profiles** - Showcase aviation and STEM programs globally
- **Interactive World Map** - Discover and connect with partner organizations using Mapbox
- **Impact Dashboard** - Track collective progress toward the 2030 goal with real-time analytics
- **Resource Library** - Share curricula, lesson plans, and educational materials
- **Mentor Matching** - Connect experienced professionals with aspiring students
- **Sponsorship Platform** - Connect organizations with sponsors
- **Authentication System** - Secure login with email/password and Google OAuth

## 🛠 Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage
- **Maps:** Mapbox GL JS
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🎨 Brand Design System

### Color Palette

- **Primary (Sky Blue):** `#0ea5e9` - Representing limitless possibilities
- **Navy:** `#1e3a8a` - Professional, trustworthy
- **Accent Colors:**
  - Red: `#dc2626`
  - Gold: `#f59e0b`
  - Green: `#10b981`

### Typography

- **Headings:** Montserrat (600, 700, 800)
- **Body:** Inter (400, 500, 600)
- **Display/Numbers:** Bebas Neue (400)

## 👥 User Roles

The platform supports five distinct user types:

1. **Student** - Youth participants with progress tracking
2. **Mentor** - Aviation professionals and volunteers
3. **Organization** - Partner affiliates and program managers
4. **Sponsor** - Donors and corporate partners
5. **Admin** - Infinity Aero Club staff with full system access

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Firebase project (for backend services)
- Mapbox account (for maps integration)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/infinitycollaborative/Hidden-Treasures-Network.git
cd Hidden-Treasures-Network
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Copy the environment template and fill in your credentials:

```bash
cp .env.local.template .env.local
```

Edit `.env.local` with your Firebase and Mapbox credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Set up Firebase Storage
5. Copy your configuration to `.env.local`

### Mapbox Setup

1. Sign up at [mapbox.com](https://mapbox.com)
2. Get your access token from your account dashboard
3. Add the token to `.env.local`
## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- Mapbox account (for map features)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/infinitycollaborative/Hidden-Treasures-Network.git
   cd Hidden-Treasures-Network
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Mapbox Configuration
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

4. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore Database
   - Enable Storage
   - Copy your config values to `.env.local`

5. **Mapbox Setup**
   - Go to [Mapbox](https://www.mapbox.com/)
   - Create a free account
   - Get your access token
   - Add to `.env.local`

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Build

Build the production application:

```bash
npm run build
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/infinitycollaborative/Hidden-Treasures-Network)

## 🎨 Brand Design

### Color Palette

- **Aviation Navy:** `#0A2540` - Primary brand color
- **Aviation Sky:** `#0EA5E9` - Accent color
- **Aviation Gold:** `#F59E0B` - Secondary accent
- **Aviation Silver:** `#94A3B8` - Tertiary color
- **Aviation Crimson:** `#DC2626` - Alert/emphasis color

## 📁 Project Structure

```
Hidden-Treasures-Network/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utility functions and configs
│   ├── firebase.ts       # Firebase initialization
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
│   └── index.ts          # User roles and data models
├── hooks/                # Custom React hooks
├── config/               # Application configuration
└── public/               # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌐 Deployment

This project is configured for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📋 Phase 1 Deliverables (Week 1)

- [x] Project setup with Next.js 14 + TypeScript
- [x] Tailwind CSS with custom brand colors
- [x] Firebase SDK integration
- [x] Shadcn/ui components setup
- [x] Custom fonts (Montserrat, Inter, Bebas Neue)
- [x] TypeScript types for user roles
- [x] Environment variables structure
- [x] Basic home page layout

## 🤝 Contributing

This is a nonprofit project aimed at empowering underserved youth. Contributions are welcome!

## 📄 License

Copyright © 2024 Infinity Aero Club Tampa Bay, Inc. All rights reserved.

## 📞 Contact

For more information about the Hidden Treasures Network:

- **Website:** [HiddenTreasuresNetwork.org](https://hiddentreasuresnetwork.org)
- **Email:** info@hiddentreasuresnetwork.org

---

**Built with ❤️ to impact one million lives by 2030**
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── dashboard/         # User dashboard
│   ├── impact/            # Impact tracking dashboard
│   ├── login/             # Login page
│   ├── map/               # Interactive world map
│   ├── organizations/     # Organizations directory
│   ├── register/          # Registration page
│   ├── resources/         # Resource library
│   ├── sponsors/          # Sponsorship page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components (navbar, footer)
│   ├── map/               # Map components
│   └── ui/                # Shadcn UI components
├── config/
│   └── firebase.ts        # Firebase configuration
├── lib/
│   └── utils.ts           # Utility functions
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🔐 Authentication

The platform supports:
- Email/Password authentication
- Google OAuth
- Protected routes for authenticated users

## 📊 Firestore Data Structure

```
users/
  {userId}/
    - name
    - email
    - organizationName
    - userType
    - role
    - createdAt

organizations/
  {orgId}/
    - name
    - location
    - description
    - programs
    - studentsImpacted
    - contactInfo
    - createdAt

resources/
  {resourceId}/
    - title
    - description
    - category
    - fileUrl
    - uploadedBy
    - createdAt
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## 📝 License

This project is owned by Infinity Aero Club Tampa Bay, Inc.

## 📧 Contact

For questions or support, contact:
- **Email:** info@hiddentreasuresnetwork.org
- **Website:** [HiddenTreasuresNetwork.org](https://hiddentreasuresnetwork.org)

## 🌟 Acknowledgments

Special thanks to all aviation and STEM education organizations working tirelessly to inspire and empower the next generation.

---

**Mission: Impact One Million Lives by 2030**

Built with ❤️ by the Hidden Treasures Network team
