# Hidden Treasures Network

A professional web application connecting aviation and STEM education organizations, mentors, students, and sponsors under a unified mission to impact one million lives by 2030.

## 🎯 Mission

To empower underserved youth worldwide through aviation, STEM, and entrepreneurship education by creating a unified network that amplifies resources, shares knowledge, and multiplies impact across organizations.

## 🏢 Organization

**Parent Organization:** Infinity Aero Club Tampa Bay, Inc. (501c3 nonprofit)
**Founder & CEO:** Ricardo "Tattoo" Foster, LCDR USN (Ret.)
**Domain:** [HiddenTreasuresNetwork.org](https://hiddentreasuresnetwork.org)

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
