import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Award, Building2, CheckCircle, Target } from "lucide-react"
import Link from "next/link"

export default function SponsorsPage() {
  const sponsorshipTiers = [
    {
      name: "Platinum Sponsor",
      amount: "$50,000+",
      color: "from-gray-400 to-gray-600",
      benefits: [
        "Logo featured on all network materials",
        "Speaking opportunity at annual conference",
        "Dedicated sponsor page on website",
        "Quarterly impact reports",
        "Priority partnership opportunities",
        "Recognition in press releases",
      ]
    },
    {
      name: "Gold Sponsor",
      amount: "$25,000+",
      color: "from-aviation-gold to-orange-600",
      benefits: [
        "Logo on website and promotional materials",
        "Annual impact report",
        "Sponsor recognition at events",
        "Social media recognition",
        "Partnership opportunities",
      ]
    },
    {
      name: "Silver Sponsor",
      amount: "$10,000+",
      color: "from-gray-300 to-gray-500",
      benefits: [
        "Logo on website",
        "Annual impact summary",
        "Social media thank you",
        "Networking opportunities",
      ]
    },
    {
      name: "Bronze Sponsor",
      amount: "$5,000+",
      color: "from-orange-400 to-orange-600",
      benefits: [
        "Name listed on website",
        "Annual impact update",
        "Certificate of appreciation",
      ]
    },
  ]

  const impactAreas = [
    {
      title: "Student Scholarships",
      description: "Fund flight training and STEM education for underserved youth",
      icon: Award,
      impact: "Each $5,000 provides a full scholarship for one student"
    },
    {
      title: "Program Development",
      description: "Support creation of new educational programs and curricula",
      icon: Building2,
      impact: "Launch programs in new regions and communities"
    },
    {
      title: "Technology & Infrastructure",
      description: "Invest in learning platforms, simulators, and equipment",
      icon: Target,
      impact: "Enable scalable, high-quality education delivery"
    },
    {
      title: "Network Growth",
      description: "Expand the global reach and impact of the network",
      icon: Heart,
      impact: "Bring aviation education to underserved regions"
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Sponsor the Network
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Partner with Hidden Treasures Network to empower the next generation of aviation
            and STEM leaders. Your support directly impacts thousands of students worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                Become a Sponsor
              </Button>
            </Link>
            <Button variant="outline">
              Download Sponsorship Packet
            </Button>
          </div>
        </div>

        {/* Impact Statement */}
        <Card className="mb-12 bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Your Investment Creates Real Impact</CardTitle>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Every dollar invested in Hidden Treasures Network multiplies across our global
              community, reaching students who will become the aviation professionals,
              engineers, and innovators of tomorrow.
            </p>
          </CardHeader>
        </Card>

        {/* Sponsorship Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-aviation-navy text-center mb-8">
            Sponsorship Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipTiers.map((tier) => (
              <Card key={tier.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`h-2 w-full rounded-full bg-gradient-to-r ${tier.color} mb-4`} />
                  <CardTitle className="text-xl mb-2">{tier.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-aviation-navy">
                    {tier.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Areas */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-aviation-navy text-center mb-8">
            Where Your Support Goes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impactAreas.map((area) => {
              const Icon = area.icon
              return (
                <Card key={area.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-10 w-10 text-aviation-sky" />
                      <CardTitle className="text-xl">{area.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-sm">
                      {area.impact}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Current Sponsors Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Our Valued Sponsors</CardTitle>
            <CardDescription>
              Thank you to these organizations who share our vision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg">
                <p className="text-gray-400 text-center text-sm">Your Logo Here</p>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg">
                <p className="text-gray-400 text-center text-sm">Your Logo Here</p>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg">
                <p className="text-gray-400 text-center text-sm">Your Logo Here</p>
              </div>
              <div className="flex items-center justify-center p-6 bg-gray-100 rounded-lg">
                <p className="text-gray-400 text-center text-sm">Your Logo Here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Make an Impact?</CardTitle>
            <CardDescription className="text-gray-300 text-lg mb-6">
              Join us in our mission to impact one million lives by 2030. Together, we can
              empower the next generation of aviation and STEM leaders.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                  Become a Sponsor Today
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Hidden Treasures Network is operated by Infinity Aero Club Tampa Bay, Inc., a 501(c)(3) nonprofit organization.
              <br />
              Your contribution is tax-deductible to the extent allowed by law.
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
