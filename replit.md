# Hidden Treasures Network

A Next.js application for a global platform connecting aviation and STEM education organizations, mentors, students, and sponsors.

## Overview

This is a Next.js 14 application built with TypeScript and TailwindCSS. It uses Firebase for authentication, database (Firestore), and file storage.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Payments**: Stripe
- **Maps**: Mapbox GL
- **AI**: OpenAI integration

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - React components (UI and layout)
- `lib/` - Utility functions and service configurations
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `config/` - Configuration files
- `shared/` - Shared utilities between app and mobile

## Required Environment Variables

The application requires the following Firebase configuration secrets:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Additional optional secrets:
- `STRIPE_SECRET_KEY` - For payment processing
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `NEXT_PUBLIC_MAPBOX_TOKEN` - For map functionality
- `OPENAI_API_KEY` - For AI assistant features

## Development

The app runs on port 5000 in development mode:
```bash
npm run dev -- -H 0.0.0.0 -p 5000
```

## Deployment

The app is configured for autoscale deployment on Replit with:
- Build: `npm run build`
- Run: `npm run start -- -H 0.0.0.0 -p 5000`
