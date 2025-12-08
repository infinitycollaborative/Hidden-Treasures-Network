import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/marketing/PageHero"
import { SectionHeading } from "@/components/marketing/SectionHeading"
import {
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  Mail,
  ExternalLink,
  Newspaper,
  Radio,
  Tv,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Media & Press Kit",
  description: "Media resources, press kit, and brand assets for Hidden Treasures Network. Contact us for media inquiries.",
  openGraph: {
    title: "Media & Press Kit | Hidden Treasures Network",
    description: "Download our press kit, logos, and brand assets. Get in touch with our media team.",
  },
}

export default function MediaPage() {
  const mediaHighlights = [
    {
      outlet: "Spectrum News 9",
      title: "Hidden Treasures Network Launches Global Aviation Education Initiative",
      date: "December 2024",
      type: "TV Feature",
      icon: Tv,
      link: "#",
    },
    {
      outlet: "Aviation Today",
      title: "Building the Next Generation of Aviation Professionals",
      date: "November 2024",
      type: "Magazine Article",
      icon: Newspaper,
      link: "#",
    },
    {
      outlet: "NPR Education",
      title: "STEM Programs Taking Flight in Underserved Communities",
      date: "October 2024",
      type: "Radio Interview",
      icon: Radio,
      link: "#",
    },
  ]

  const pressReleases = [
    {
      title: "Hidden Treasures Network Announces Flight Plan 2030 Initiative",
      date: "January 15, 2025",
      summary: "Ambitious goal to impact one million lives through aviation and STEM education by 2030.",
    },
    {
      title: "New Partnership Brings Aviation Education to 50+ Schools",
      date: "December 10, 2024",
      summary: "Network expansion enables discovery flights and drone programs for thousands of students.",
    },
    {
      title: "Hidden Treasures Tour Visits 10 Cities, Inspires 5,000 Students",
      date: "November 20, 2024",
      summary: "Red Tail tribute aircraft tour completes successful multi-city journey honoring aviation pioneers.",
    },
  ]

  const brandAssets = [
    {
      title: "Logo Package",
      description: "Full-color, monochrome, and white logos in PNG, SVG, and EPS formats",
      icon: ImageIcon,
      filename: "HTN-Logo-Package.zip",
    },
    {
      title: "Brand Guidelines",
      description: "Logo usage, color palette, typography, and brand voice guidelines",
      icon: FileText,
      filename: "HTN-Brand-Guidelines.pdf",
    },
    {
      title: "Fact Sheet",
      description: "Key statistics, mission statement, and program overview",
      icon: FileText,
      filename: "HTN-Fact-Sheet.pdf",
    },
    {
      title: "Leadership Photos",
      description: "High-resolution photos of leadership team and founder",
      icon: ImageIcon,
      filename: "HTN-Leadership-Photos.zip",
    },
    {
      title: "Program Photos",
      description: "Approved photos of students, aircraft, and program activities",
      icon: ImageIcon,
      filename: "HTN-Program-Photos.zip",
    },
    {
      title: "B-Roll Video",
      description: "Video footage of programs, students, and Hidden Treasures Tour",
      icon: Video,
      filename: "HTN-B-Roll.zip",
    },
  ]

  const keyFacts = [
    { label: "Founded", value: "2023" },
    { label: "Network Organizations", value: "150+" },
    { label: "Countries Reached", value: "25+" },
    { label: "Students Impacted", value: "200,000+" },
    { label: "Discovery Flights", value: "1,200+" },
    { label: "Drone Certifications", value: "3,500+" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Media & Press"
        description="Resources for journalists, media professionals, and content creators covering Hidden Treasures Network."
      />

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {keyFacts.map((fact) => (
              <div key={fact.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-aviation-sky mb-1">{fact.value}</p>
                <p className="text-sm text-gray-600">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-aviation-navy to-blue-900 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-3">Media Inquiries</CardTitle>
              <CardDescription className="text-gray-200 text-lg">
                For interviews, press releases, or media opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <a
                    href="mailto:media@hiddentreasuresnetwork.org"
                    className="text-aviation-gold hover:underline font-semibold"
                  >
                    media@hiddentreasuresnetwork.org
                  </a>
                </div>
                <span className="hidden sm:block text-gray-400">|</span>
                <p className="text-gray-200">
                  Response time: <span className="text-white font-semibold">24-48 hours</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Press Kit Download */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Press Kit & Brand Assets"
            subtitle="Download our complete media kit with logos, photos, and brand guidelines"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandAssets.map((asset) => {
              const Icon = asset.icon
              return (
                <Card key={asset.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-aviation-sky/10 rounded-lg">
                        <Icon className="h-6 w-6 text-aviation-sky" />
                      </div>
                      <CardTitle className="text-lg">{asset.title}</CardTitle>
                    </div>
                    <CardDescription>{asset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" disabled>
                      <Download className="mr-2 h-4 w-4" />
                      Download {asset.filename}
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Available upon media request
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Card className="inline-block border-2 border-aviation-gold">
              <CardContent className="p-6">
                <h3 className="font-semibold text-aviation-navy mb-2">
                  Need the Complete Press Kit?
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Contact our media team to receive the full press kit including all assets
                </p>
                <Link href="/contact">
                  <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                    <Mail className="mr-2 h-4 w-4" />
                    Request Press Kit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Media Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="In the News"
            subtitle="Recent media coverage and features"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {mediaHighlights.map((highlight) => {
              const Icon = highlight.icon
              return (
                <Card key={highlight.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-aviation-sky" />
                      <Badge variant="secondary">{highlight.type}</Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{highlight.title}</CardTitle>
                    <CardDescription>
                      <span className="font-semibold">{highlight.outlet}</span> • {highlight.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Read Article
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Press Releases"
            subtitle="Latest announcements and news from Hidden Treasures Network"
          />

          <div className="max-w-4xl mx-auto space-y-6">
            {pressReleases.map((release) => (
              <Card key={release.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                      <CardDescription className="text-base">{release.summary}</CardDescription>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {release.date}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="text-aviation-sky p-0 h-auto" disabled>
                    Read full release
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Boilerplate */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About Hidden Treasures Network</CardTitle>
              <CardDescription>Standard boilerplate for media use</CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Hidden Treasures Network</strong> is a global platform connecting aviation and STEM
                education organizations to amplify impact and empower underserved youth worldwide. Through
                collaborative partnerships, shared resources, and unified initiatives, the network is working
                to impact one million lives by 2030.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Founded by Ricardo "Tattoo" Foster, LCDR USN (Ret.), and operated by{" "}
                <strong>Infinity Aero Club Tampa Bay, Inc.</strong>, a 501(c)(3) nonprofit organization, Hidden
                Treasures Network provides pathways for youth to pursue careers in aviation, aerospace, and STEM
                fields through programs including flight training, drone certification, aircraft maintenance,
                coding labs, and entrepreneurship education.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For more information, visit{" "}
                <a
                  href="https://HiddenTreasuresNetwork.org"
                  className="text-aviation-sky hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HiddenTreasuresNetwork.org
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
