import { Metadata } from "next"
import Link from "next/link"
import { PageHero } from "@/components/marketing/PageHero"
import { SectionHeading } from "@/components/marketing/SectionHeading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Users,
  Target,
  TrendingUp,
  Award,
  Briefcase,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Sponsors",
  description: "Partner with Hidden Treasures Network to empower youth through aviation and STEM education. Create lasting impact and workforce development.",
  openGraph: {
    title: "For Sponsors & Partners | Hidden Treasures Network",
    description: "Invest in the next generation of aviation and STEM professionals.",
  },
}

export default function SponsorsGetInvolvedPage() {
  const impactAreas = [
    {
      icon: Users,
      title: "Workforce Development",
      description: "Build the pipeline of skilled aviation and STEM professionals your industry needs",
    },
    {
      icon: Target,
      title: "DEI & Social Impact",
      description: "Support diversity, equity, and inclusion in aviation and aerospace careers",
    },
    {
      icon: TrendingUp,
      title: "Brand Visibility",
      description: "Gain recognition as a leader in youth education and community investment",
    },
    {
      icon: Award,
      title: "Measurable ROI",
      description: "Track your investment's impact with detailed metrics and student outcomes",
    },
  ]

  const sponsorshipTypes = [
    {
      title: "Program Sponsorship",
      description: "Fund specific programs like flight training scholarships or STEM workshops",
      examples: ["Student scholarships", "Equipment purchases", "Program operations"],
      investment: "$5,000 - $50,000",
    },
    {
      title: "Event Sponsorship",
      description: "Support conferences, career fairs, and Hidden Treasures Tour stops",
      examples: ["Annual conference", "Regional events", "Virtual career panels"],
      investment: "$2,500 - $25,000",
    },
    {
      title: "Strategic Partnership",
      description: "Multi-year commitment with comprehensive benefits and deep collaboration",
      examples: ["Brand integration", "Curriculum development", "Talent pipeline"],
      investment: "$50,000+",
    },
    {
      title: "In-Kind Support",
      description: "Donate equipment, software, expertise, or facility access",
      examples: ["Aircraft access", "Software licenses", "Professional expertise"],
      investment: "Varies",
    },
  ]

  const benefits = [
    "Logo placement on website and marketing materials",
    "Recognition in impact reports and press releases",
    "Speaking opportunities at events",
    "Employee volunteer and engagement opportunities",
    "Access to talent pipeline for recruitment",
    "Quarterly impact updates and metrics",
    "Tax deduction for 501(c)(3) donation",
    "Corporate social responsibility reporting",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="For Sponsors & Partners"
        description="Invest in the future of aviation and STEM. Create lasting impact while building your workforce pipeline."
      />

      {/* Why Sponsor */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-aviation-navy mb-4">
                Invest in Tomorrow's Talent Today
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                The aviation industry faces a critical shortage of skilled professionals. By sponsoring
                Hidden Treasures Network, you're not just giving back—you're investing in the workforce
                your organization needs.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Your sponsorship provides scholarships, equipment, and opportunities that transform
                students into the pilots, engineers, technicians, and innovators who will drive our
                industry forward.
              </p>
              <div className="bg-aviation-sky/10 p-6 rounded-xl border-l-4 border-aviation-sky">
                <p className="text-aviation-navy font-semibold mb-2">
                  Operated by Infinity Aero Club Tampa Bay, Inc.
                </p>
                <p className="text-gray-700 text-sm">
                  501(c)(3) nonprofit organization • Tax ID: XX-XXXXXXX
                  <br />
                  Your contribution is tax-deductible to the extent allowed by law.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-2 border-aviation-sky">
                <CardHeader className="text-center">
                  <p className="text-4xl font-bold text-aviation-sky mb-2">200K+</p>
                  <p className="text-sm text-gray-700">Students Impacted</p>
                </CardHeader>
              </Card>
              <Card className="border-2 border-aviation-gold">
                <CardHeader className="text-center">
                  <p className="text-4xl font-bold text-aviation-gold mb-2">150+</p>
                  <p className="text-sm text-gray-700">Organizations</p>
                </CardHeader>
              </Card>
              <Card className="border-2 border-green-600">
                <CardHeader className="text-center">
                  <p className="text-4xl font-bold text-green-600 mb-2">25+</p>
                  <p className="text-sm text-gray-700">Countries</p>
                </CardHeader>
              </Card>
              <Card className="border-2 border-purple-600">
                <CardHeader className="text-center">
                  <p className="text-4xl font-bold text-purple-600 mb-2">1M</p>
                  <p className="text-sm text-gray-700">Goal by 2030</p>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Your Impact"
            subtitle="How sponsorship creates value for your organization and the community"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactAreas.map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-aviation-sky mx-auto mb-3" />
                    <CardTitle className="text-lg mb-2">{area.title}</CardTitle>
                    <CardDescription className="text-base">{area.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sponsorship Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Sponsorship Opportunities"
            subtitle="Choose the sponsorship level that aligns with your goals and budget"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {sponsorshipTypes.map((type) => (
              <Card key={type.title} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <Badge className="bg-aviation-gold text-aviation-navy">{type.investment}</Badge>
                  </div>
                  <CardDescription className="text-base mb-4">{type.description}</CardDescription>
                  <div>
                    <p className="text-sm font-semibold text-aviation-navy mb-2">Examples:</p>
                    <ul className="space-y-1">
                      {type.examples.map((example) => (
                        <li key={example} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-aviation-sky">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Sponsor Benefits"
            subtitle="Recognition and value for your investment"
          />

          <Card className="border-2 border-aviation-sky">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link href="/sponsors">
              <Button variant="outline" size="lg">
                View Detailed Sponsorship Tiers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-aviation-gold" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Create Impact?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Let's discuss how a sponsorship can align with your organization's goals and create
            measurable value for both your business and the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sponsors/apply">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Become a Sponsor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule a Conversation
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-8">
            Questions? Email{" "}
            <a
              href="mailto:partnerships@hiddentreasuresnetwork.org"
              className="text-aviation-gold hover:underline"
            >
              partnerships@hiddentreasuresnetwork.org
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
