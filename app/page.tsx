import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Logo placeholder */}
            <div className="mb-8">
              <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tight mb-4">
                Hidden Treasures
              </h1>
              <h2 className="font-heading text-4xl md:text-6xl font-semibold text-primary-200">
                Network
              </h2>
            </div>

            {/* Mission Statement */}
            <p className="text-xl md:text-2xl font-medium text-primary-50 max-w-3xl mx-auto leading-relaxed">
              Connecting aviation and STEM education organizations worldwide to share resources,
              amplify impact, and empower underserved youth.
            </p>

            {/* Impact Goal */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
              <p className="text-lg text-primary-100 mb-2">Our Mission Goal</p>
              <p className="font-display text-7xl md:text-8xl font-bold text-accent-gold mb-2">
                1,000,000
              </p>
              <p className="text-2xl font-semibold">Lives Impacted by 2030</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/join"
                className="px-8 py-4 bg-accent-gold hover:bg-accent-gold/90 text-navy-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                Join the Network
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg transition-all border-2 border-white/30 text-lg"
              >
                Learn More
              </Link>
            </div>

            {/* Parent Organization */}
            <div className="pt-12 border-t border-white/20">
              <p className="text-sm text-primary-200 mb-2">Powered by</p>
              <p className="text-xl font-semibold">
                Infinity Aero Club Tampa Bay, Inc.
              </p>
              <p className="text-sm text-primary-200">501(c)(3) Nonprofit Organization</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-navy-900 mb-4">
            Building a Global Movement
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Connect with organizations, mentors, and students dedicated to aviation and STEM education
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { label: 'Organizations', value: '---', color: 'primary' },
              { label: 'Mentors', value: '---', color: 'navy' },
              { label: 'Students', value: '---', color: 'primary' },
              { label: 'Sponsors', value: '---', color: 'navy' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md hover:shadow-xl transition-shadow"
              >
                <p className={`font-display text-6xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.value}
                </p>
                <p className="text-gray-700 font-semibold text-lg">{stat.label}</p>
              </div>
            ))}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            alt="Aviation students diversity background"
            fill
            className="object-cover brightness-50"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hidden Treasures Network
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Empowering underrepresented youth to soar in STEM and aviation
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Get Involved
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At Hidden Treasures Network, we believe every young person deserves
                the opportunity to reach for the skies. We provide mentorship,
                educational resources, and career pathways in STEM and aviation
                for underrepresented communities.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Through hands-on programs, industry partnerships, and dedicated
                mentors, we're building the next generation of pilots, engineers,
                and aerospace professionals.
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded transition-colors">
                Learn More
              </button>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
                alt="STEM education children"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
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

      {/* Success Stories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
                  alt="Aviation student portrait 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Marcus Johnson</h3>
                <p className="text-sm text-blue-600 mb-3">Commercial Pilot</p>
                <p className="text-gray-700">
                  "The mentorship I received opened doors I never knew existed.
                  Now I'm flying for a major airline and inspiring others to follow
                  their dreams."
                </p>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                  alt="Aviation student portrait 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Sarah Chen</h3>
                <p className="text-sm text-blue-600 mb-3">Aerospace Engineer</p>
                <p className="text-gray-700">
                  "Through HTN's programs, I discovered my passion for aerospace
                  engineering. Today I'm designing the next generation of aircraft."
                </p>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                  alt="Aviation student portrait 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">David Rodriguez</h3>
                <p className="text-sm text-blue-600 mb-3">Air Traffic Controller</p>
                <p className="text-gray-700">
                  "HTN showed me that aviation careers extend beyond the cockpit.
                  I love the challenge and responsibility of keeping our skies safe."
                </p>
              </div>
            </div>
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

      {/* Leadership Section */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-8">
            Led by Experience
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-accent-gold mb-2">
              Ricardo &quot;Tattoo&quot; Foster
            </h3>
            <p className="text-lg text-primary-300 mb-4">
              LCDR USN (Ret.) - Founder & CEO
            </p>
            <p className="text-gray-300 leading-relaxed">
              Leading the mission to empower underserved youth through aviation, STEM, and
              entrepreneurship education. Building a global network of organizations committed
              to creating opportunities and changing lives.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-200">
            &copy; {new Date().getFullYear()} Hidden Treasures Network. All rights reserved.
          </p>
          <p className="text-sm text-primary-300 mt-2">
            A project of Infinity Aero Club Tampa Bay, Inc. - 501(c)(3) Nonprofit
          </p>
        </div>
      </footer>
    </main>
      {/* Footer */}
      <footer className="relative py-12 text-white">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
            alt="Aviation pattern background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Impact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Programs</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Mentorship</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Flight Training</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">STEM Education</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Get Involved</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Donate</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Partner With Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Social Media</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2024 Hidden Treasures Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
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
