import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/marketing/PageHero"
import { SectionHeading } from "@/components/marketing/SectionHeading"
import {
  Building2,
  Users,
  BookOpen,
  TrendingUp,
  Globe,
  Handshake,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Organizations",
  description: "Join the Hidden Treasures Network. Amplify your impact, access shared resources, and collaborate with organizations worldwide.",
  openGraph: {
    title: "For Organizations | Hidden Treasures Network",
    description: "Unite with aviation and STEM organizations to maximize collective impact.",
  },
}

export default function OrganizationsPage() {
  const benefits = [
    {
      icon: Users,
      title: "Expanded Reach",
      description: "Connect with students, mentors, and partners worldwide through our platform",
    },
    {
      icon: BookOpen,
      title: "Shared Resources",
      description: "Access curricula, best practices, and program materials from network partners",
    },
    {
      icon: TrendingUp,
      title: "Impact Tracking",
      description: "Measure and showcase your program's impact with built-in analytics",
    },
    {
      icon: Handshake,
      title: "Collaborative Opportunities",
      description: "Partner with other organizations for events, programs, and initiatives",
    },
    {
      icon: Award,
      title: "Recognition & Visibility",
      description: "Featured placement in our directory and on the network map",
    },
    {
      icon: Globe,
      title: "Network Effect",
      description: "Benefit from collective marketing, advocacy, and fundraising efforts",
    },
  ]

  const types = [
    {
      title: "Youth-Serving Organizations",
      examples: ["After-school programs", "Youth centers", "Community organizations"],
    },
    {
      title: "Educational Institutions",
      examples: ["K-12 schools", "Colleges & universities", "Technical schools"],
    },
    {
      title: "Aviation Organizations",
      examples: ["Flight schools", "Aviation clubs", "Airport authorities"],
    },
    {
      title: "STEM Organizations",
      examples: ["Science centers", "Makerspaces", "Robotics teams"],
    },
  ]

  const requirements = [
    "501(c)(3) nonprofit status or educational institution",
    "Mission aligned with youth aviation/STEM education",
    "Active programs or commitment to launch programs",
    "Willingness to share resources and best practices",
    "Commitment to network values and collaboration",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="For Schools & Organizations"
        description="Join our global network to amplify your impact and empower more students through aviation and STEM education."
      />

      {/* Why Join */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-aviation-navy mb-4">
                Stronger Together
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Aviation and STEM organizations often work in isolation, duplicating efforts and
                limiting reach. Hidden Treasures Network brings organizations together to share resources,
                amplify impact, and create opportunities that no single organization could achieve alone.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                By joining our network, your organization gains access to a global community, shared tools,
                and collaborative opportunities that help you serve more students more effectively.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-aviation-sky text-white text-sm py-2 px-4">
                  150+ Partner Organizations
                </Badge>
                <Badge className="bg-aviation-gold text-aviation-navy text-sm py-2 px-4">
                  25+ Countries
                </Badge>
                <Badge className="bg-green-600 text-white text-sm py-2 px-4">
                  200,000+ Students Served
                </Badge>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop"
                alt="Organizations collaborating"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Network Benefits"
            subtitle="What your organization gains by joining"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <Card key={benefit.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="p-3 bg-aviation-sky/10 rounded-lg w-fit mb-3">
                      <Icon className="h-8 w-8 text-aviation-sky" />
                    </div>
                    <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                    <CardDescription className="text-base">{benefit.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Organization Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Who Can Join"
            subtitle="We welcome diverse organizations committed to youth aviation and STEM education"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {types.map((type) => (
              <Card key={type.title} className="border-2 border-transparent hover:border-aviation-sky transition-all">
                <CardHeader>
                  <CardTitle className="text-lg mb-3">{type.title}</CardTitle>
                  <ul className="space-y-2">
                    {type.examples.map((example) => (
                      <li key={example} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-aviation-sky mt-1">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Membership Requirements"
            subtitle="What we look for in network partners"
          />

          <Card className="border-2 border-aviation-sky">
            <CardContent className="p-8">
              <div className="space-y-4">
                {requirements.map((req) => (
                  <div key={req} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{req}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl">Membership is Free</CardTitle>
              <CardDescription className="text-base">
                There are no fees to join the Hidden Treasures Network. We believe in removing barriers
                and making collaboration accessible to all organizations committed to our mission.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building2 className="h-16 w-16 mx-auto mb-6 text-aviation-gold" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Join Our Network?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Complete the application to become a member organization and start collaborating with partners worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=organization">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Apply to Join Network
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule a Call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
