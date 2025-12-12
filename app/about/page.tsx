import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Target, Users, Globe, Heart, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Passion for Empowerment",
      description: "We believe every young person deserves the opportunity to pursue their dreams in aviation and STEM, regardless of their background."
    },
    {
      icon: Users,
      title: "Unity Through Collaboration",
      description: "Together we are stronger. We unite organizations worldwide to share resources, knowledge, and opportunities."
    },
    {
      icon: Award,
      title: "Excellence in Education",
      description: "We are committed to delivering high-quality, impactful programs that prepare students for successful careers."
    },
    {
      icon: TrendingUp,
      title: "Measurable Impact",
      description: "We track our progress and measure our success by the lives we transform and the opportunities we create."
    },
  ]

  const milestones = [
    {
      year: "2024",
      title: "Network Launch",
      description: "Hidden Treasures Network officially launches to connect aviation and STEM organizations globally."
    },
    {
      year: "2025",
      title: "Expansion Phase",
      description: "Growing to 500+ organizations across 50 countries, impacting 100,000 students."
    },
    {
      year: "2027",
      title: "Mid-Goal Milestone",
      description: "Reaching 500,000 lives impacted through unified network initiatives."
    },
    {
      year: "2030",
      title: "Mission Achievement",
      description: "Impact one million lives through aviation, STEM, and entrepreneurship education."
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-aviation-navy via-aviation-navy to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Hidden Treasures Network
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A global platform uniting aviation and STEM education organizations to amplify
              impact and empower underserved youth worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-aviation-sky">
              <CardHeader>
                <Target className="h-12 w-12 text-aviation-sky mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  To empower underserved youth worldwide through aviation, STEM, and
                  entrepreneurship education by creating a unified network that amplifies
                  resources, shares knowledge, and multiplies impact across organizations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-aviation-gold">
              <CardHeader>
                <Globe className="h-12 w-12 text-aviation-gold mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg">
                  A world where every young person, regardless of their circumstances, has
                  access to transformative aviation and STEM education that opens doors to
                  extraordinary careers and opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aviation-navy mb-4">
              Why Hidden Treasures Network Exists
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-red-600">The Challenge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  • Aviation and STEM organizations often work in isolation, duplicating efforts
                </p>
                <p className="text-gray-700">
                  • Underserved communities lack access to quality aviation education
                </p>
                <p className="text-gray-700">
                  • Limited resources prevent organizations from maximizing their impact
                </p>
                <p className="text-gray-700">
                  • The aviation industry faces a critical shortage of diverse talent
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-green-700">Our Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700">
                  • Unite organizations in a collaborative global network
                </p>
                <p className="text-gray-700">
                  • Share resources, curricula, and best practices freely
                </p>
                <p className="text-gray-700">
                  • Amplify impact through collective action and visibility
                </p>
                <p className="text-gray-700">
                  • Build pathways for underserved youth to enter aviation careers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aviation-navy mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-700">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-aviation-sky mx-auto mb-3" />
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Leadership & Partners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aviation-navy mb-4">
              Executive Leadership & Partners
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Infinity Aero Club Tampa Bay, Inc. and our strategic partners are united in a shared mission
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="mb-4">
                <Plane className="h-16 w-16 text-aviation-sky mx-auto" />
              </div>
              <CardTitle className="text-3xl mb-2">Our Story</CardTitle>
              <CardDescription className="text-xl text-aviation-gold">
                A Network Built on Purpose
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 text-center mb-4">
                What began as a vision to empower underserved youth through aviation has grown into a
                thriving network of educators, mentors, mentees, partners, and sponsors. Executive leadership
                at Infinity Aero Club Tampa Bay, Inc. works alongside strategic partners such as Gleim Aviation
                to bring decades of aviation experience and a deep passion for youth empowerment to communities worldwide.
              </p>
              <p className="text-gray-700 text-center">
                Our vision: to build a global network where organizations work together to impact
                one million lives by 2030, proving that when we unite our efforts, we can create
                transformational change for the next generation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aviation-navy mb-4">
              Our Journey to 2030
            </h2>
            <p className="text-lg text-gray-700">
              Milestones on our path to impacting one million lives
            </p>
          </div>

          <div className="relative">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="mb-8 flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-aviation-sky text-white font-bold">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-aviation-sky/30 mt-2" />
                  )}
                </div>
                <Card className="flex-1 mb-8">
                  <CardHeader>
                    <CardTitle>{milestone.title}</CardTitle>
                    <CardDescription className="text-base">{milestone.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us in Making History
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Be part of the movement to impact one million lives through aviation and STEM education.
            Together, we can empower the next generation of innovators, leaders, and changemakers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Join the Network
              </Button>
            </Link>
            <Link href="/sponsors">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Become a Sponsor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
