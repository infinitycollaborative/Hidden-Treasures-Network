import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailCapture } from "@/components/marketing/EmailCapture"
import { StructuredData, organizationSchema } from "@/components/seo/StructuredData"
import {
  Plane,
  Users,
  Globe,
  Target,
  BookOpen,
  Award,
  Calendar,
  Heart,
  TrendingUp,
  GraduationCap,
  MapPin,
  ArrowRight
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <StructuredData data={organizationSchema} />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-aviation-navy via-aviation-navy to-blue-900 text-white py-32 md:py-40 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMHYxMEgzNnptLTEwLTEwaDEwdjEwSDI2em0xMCAxMGgxMHYxMEgzNnptLTEwIDBoMTB2MTBIMjZ6bTEwIDBoMTB2MTBIMzZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Empowering the Next Generation
              <br />
              <span className="text-aviation-gold">Through Aviation & STEM</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              A global network of organizations, mentors, and innovators impacting one million lives by 2030.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold text-lg px-8 py-6">
                  Join the Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/impact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Explore Our Impact
                </Button>
              </Link>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
              {[
                { value: "50+", label: "Partner Organizations" },
                { value: "200,000+", label: "Youth Impacted" },
                { value: "25+", label: "Countries Reached" },
                { value: "1,200+", label: "Discovery Flights" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="font-display text-4xl md:text-5xl font-bold text-aviation-gold mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm md:text-base text-gray-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-aviation-navy mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Hidden Treasures Network unites aviation and STEM education organizations worldwide to share resources,
                amplify impact, and create pathways for underserved youth. Through collaborative partnerships, we're
                building the next generation of pilots, engineers, entrepreneurs, and innovators who will shape the
                future of flight.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Led by Ricardo "Tattoo" Foster, LCDR USN (Ret.), and powered by Infinity Aero Club Tampa Bay, Inc.
                (501(c)(3)), we are committed to reaching one million lives by 2030.
              </p>
              <Link href="/about">
                <Button className="bg-aviation-navy hover:bg-aviation-navy/90 text-white">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
                alt="Students engaged in STEM education"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Network at a Glance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-aviation-navy mb-4">
              A Global Network
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Connecting aviation and STEM organizations across continents to maximize our collective impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-aviation-navy to-blue-900 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Globe className="h-24 w-24 mx-auto mb-4 text-aviation-gold" />
                <p className="text-2xl font-heading font-bold mb-2">Interactive Network Map</p>
                <p className="text-gray-300 mb-6">Coming Soon</p>
                <Link href="/map">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Explore the Network
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-aviation-sky/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-aviation-sky/10 rounded-lg">
                      <Users className="h-6 w-6 text-aviation-sky" />
                    </div>
                    <CardTitle className="text-aviation-navy">Diverse Network</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Organizations, mentors, students, and sponsors united by a common mission to democratize aviation and STEM education.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-aviation-sky/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-aviation-sky/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-aviation-sky" />
                    </div>
                    <CardTitle className="text-aviation-navy">Measurable Impact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Track and celebrate collective achievements as we progress toward our goal of impacting one million lives.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-aviation-sky/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-aviation-sky/10 rounded-lg">
                      <Heart className="h-6 w-6 text-aviation-sky" />
                    </div>
                    <CardTitle className="text-aviation-navy">Shared Resources</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Access a growing library of educational materials, best practices, and program templates developed by network partners.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-aviation-navy mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Real lives changed through aviation and STEM education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Rodriguez",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
                quote: "I never thought someone like me could become a pilot. Hidden Treasures showed me it was possible.",
                outcome: "Now pursuing Commercial Pilot License"
              },
              {
                name: "James Washington",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
                quote: "The mentorship I received changed my entire perspective on what I could achieve.",
                outcome: "Earned FAA Part 107 Drone Certification"
              },
              {
                name: "Aisha Patel",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
                quote: "Learning about aircraft maintenance opened up a career path I didn't know existed.",
                outcome: "Started apprenticeship with major airline"
              }
            ].map((story) => (
              <Card key={story.name} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading text-2xl font-bold text-aviation-navy mb-3">{story.name}</h3>
                  <p className="text-gray-700 italic mb-4">"{story.quote}"</p>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-aviation-sky flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {story.outcome}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/impact/stories">
              <Button variant="outline" className="border-2 border-aviation-navy text-aviation-navy hover:bg-aviation-navy hover:text-white">
                Read More Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Get Involved Tiles */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-aviation-navy mb-4">
              Get Involved
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Join the movement to empower youth through aviation and STEM education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <GraduationCap className="h-10 w-10" />,
                title: "For Students",
                description: "Access mentorship, programs, and resources to launch your aviation or STEM career",
                href: "/register?role=student"
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "For Mentors",
                description: "Share your expertise and inspire the next generation of aviation professionals",
                href: "/register?role=mentor"
              },
              {
                icon: <Plane className="h-10 w-10" />,
                title: "For Organizations",
                description: "Join our network to amplify your impact and collaborate with global partners",
                href: "/register?role=organization"
              },
              {
                icon: <Heart className="h-10 w-10" />,
                title: "For Sponsors",
                description: "Support youth education and create lasting impact in underserved communities",
                href: "/register?role=sponsor"
              }
            ].map((tile) => (
              <Card key={tile.title} className="text-center hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-aviation-sky">
                <Link href={tile.href}>
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 bg-aviation-sky/10 rounded-full w-fit">
                      <div className="text-aviation-sky">
                        {tile.icon}
                      </div>
                    </div>
                    <CardTitle className="text-aviation-navy">{tile.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 text-base">
                      {tile.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-aviation-navy mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Connect, learn, and grow with the Hidden Treasures community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Virtual Career Panel: Paths in Aviation",
                date: "January 15, 2025",
                location: "Online",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
              },
              {
                title: "Hands-On STEM Workshop: Build a Drone",
                date: "January 22, 2025",
                location: "Tampa Bay, FL",
                image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop"
              },
              {
                title: "Discovery Flight Day for Students",
                date: "February 5, 2025",
                location: "Various Locations",
                image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
              }
            ].map((event) => (
              <Card key={event.title} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-heading text-xl font-bold text-aviation-navy mb-3">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-aviation-sky" />
                      {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-aviation-sky" />
                      {event.location}
                    </p>
                  </div>
                  <Button className="w-full mt-4 bg-aviation-sky hover:bg-aviation-sky/90">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button variant="outline" className="border-2 border-aviation-navy text-aviation-navy hover:bg-aviation-navy hover:text-white">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailCapture
            source="homepage"
            title="Stay in the Loop"
            description="Be the first to hear about new tour stops, scholarships, and opportunities as we build a global movement in aviation & STEM education."
            buttonText="Subscribe"
            className="text-center text-white"
          />
        </div>
      </section>
    </div>
  )
}
