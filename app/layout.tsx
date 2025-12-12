import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true,
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800"],
  display: "swap",
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Hidden Treasures Network | Empowering Youth Through Aviation & STEM',
    template: '%s | Hidden Treasures Network',
  },
  description: 'A global network connecting aviation and STEM organizations to impact one million lives by 2030 through education, mentorship, and opportunity.',
  keywords: ['aviation', 'STEM', 'education', 'mentorship', 'nonprofit', 'youth empowerment'],
  authors: [{ name: 'Infinity Aero Club Tampa Bay, Inc.' }],
  creator: 'Hidden Treasures Network',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://HiddenTreasuresNetwork.org',
    siteName: 'Hidden Treasures Network',
    title: 'Hidden Treasures Network | Empowering Youth Through Aviation & STEM',
    description: 'A global network connecting aviation and STEM organizations to impact one million lives by 2030 through education, mentorship, and opportunity.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hidden Treasures Network',
    description: 'Empowering one million lives through aviation & STEM education.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
