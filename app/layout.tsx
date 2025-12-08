import type { Metadata } from 'next'
import { Inter, Montserrat, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hidden Treasures Network - Empowering Youth Through Aviation & STEM',
  description: 'Global platform connecting aviation and STEM education organizations, mentors, students, and sponsors under a unified mission to impact one million lives by 2030.',
  keywords: ['aviation', 'STEM', 'education', 'mentorship', 'nonprofit', 'youth empowerment'],
  authors: [{ name: 'Infinity Aero Club Tampa Bay, Inc.' }],
  creator: 'Hidden Treasures Network',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hiddentreasuresnetwork.org',
    siteName: 'Hidden Treasures Network',
    title: 'Hidden Treasures Network - Empowering Youth Through Aviation & STEM',
    description: 'Global platform connecting aviation and STEM education organizations to impact one million lives by 2030.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hidden Treasures Network',
    description: 'Empowering underserved youth through aviation, STEM, and entrepreneurship education.',
  },
  robots: {
    index: true,
    follow: true,
  },
import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Hidden Treasures Network | Aviation & STEM Education",
  description: "A global platform connecting aviation and STEM education organizations, mentors, students, and sponsors to impact one million lives by 2030.",
  keywords: ["aviation", "STEM", "education", "mentorship", "nonprofit", "youth empowerment"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased">
        {children}
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
