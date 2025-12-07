import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plane,
  Users,
  Globe,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  Heart
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-aviation-navy via-aviation-navy to-blue-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMHYxMEgzNnptLTEwLTEwaDEwdjEwSDI2em0xMCAxMGgxMHYxMEgzNnptLTEwIDBoMTB2MTBIMjZ6bTEwIDBoMTB2MTBIMzZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connecting Dreams to the Sky
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-aviation-gold font-semibold">
              Hidden Treasures Network
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-300">
              A global platform uniting aviation and STEM education organizations, mentors,
              students, and sponsors to impact one million lives by 2030.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                  Join the Network
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-aviation-navy mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              To empower underserved youth worldwide through aviation, STEM, and entrepreneurship
              education by creating a unified network that amplifies resources, shares knowledge,
              and multiplies impact across organizations.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <Card className="text-center border-aviation-sky">
              <CardHeader>
                <div className="mx-auto mb-2">
                  <Target className="h-12 w-12 text-aviation-gold" />
                </div>
                <CardTitle className="text-3xl font-bold text-aviation-navy">1M</CardTitle>
                <CardDescription>Lives to Impact by 2030</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-aviation-sky">
              <CardHeader>
                <div className="mx-auto mb-2">
                  <Globe className="h-12 w-12 text-aviation-gold" />
                </div>
                <CardTitle className="text-3xl font-bold text-aviation-navy">Global</CardTitle>
                <CardDescription>Worldwide Network</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-aviation-sky">
              <CardHeader>
                <div className="mx-auto mb-2">
                  <Users className="h-12 w-12 text-aviation-gold" />
                </div>
                <CardTitle className="text-3xl font-bold text-aviation-navy">United</CardTitle>
                <CardDescription>Organizations Together</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-aviation-sky">
              <CardHeader>
                <div className="mx-auto mb-2">
                  <Heart className="h-12 w-12 text-aviation-gold" />
                </div>
                <CardTitle className="text-3xl font-bold text-aviation-navy">501(c)3</CardTitle>
                <CardDescription>Nonprofit Organization</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-aviation-navy mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-700">
              Everything you need to connect, collaborate, and create impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Plane className="h-10 w-10 text-aviation-sky mb-2" />
                <CardTitle>Organization Profiles</CardTitle>
                <CardDescription>
                  Showcase your aviation and STEM programs, connect with partners, and
                  amplify your reach globally.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-10 w-10 text-aviation-sky mb-2" />
                <CardTitle>Interactive World Map</CardTitle>
                <CardDescription>
                  Discover organizations worldwide, visualize the network, and find
                  collaboration opportunities near you.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-aviation-sky mb-2" />
                <CardTitle>Mentor Matching</CardTitle>
                <CardDescription>
                  Connect experienced aviation professionals with aspiring students for
                  meaningful mentorship relationships.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-aviation-sky mb-2" />
                <CardTitle>Resource Sharing</CardTitle>
                <CardDescription>
                  Access and share educational materials, curricula, best practices, and
                  program templates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-aviation-sky mb-2" />
                <CardTitle>Impact Tracking</CardTitle>
                <CardDescription>
                  Measure and visualize your impact with powerful analytics and reporting
                  tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-10 w-10 text-aviation-sky mb-2" />
                <CardTitle>Sponsorship Opportunities</CardTitle>
                <CardDescription>
                  Connect with sponsors who share your vision and can help fund your
                  programs and initiatives.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-aviation-navy mb-4">
              Leadership
            </h2>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ricardo "Tattoo" Foster</CardTitle>
              <CardDescription className="text-lg">
                LCDR USN (Ret.) - Founder & CEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-center">
                Leading the mission to connect aviation and STEM education organizations
                worldwide through the Hidden Treasures Network and Infinity Aero Club Tampa Bay, Inc.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Join the Hidden Treasures Network today and be part of a global movement to
            empower the next generation through aviation and STEM education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Join as Organization
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
