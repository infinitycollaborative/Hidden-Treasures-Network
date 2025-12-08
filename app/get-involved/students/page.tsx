import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/marketing/PageHero"
import { SectionHeading } from "@/components/marketing/SectionHeading"
import {
  GraduationCap,
  Plane,
  Radio,
  Code,
  Users,
  Award,
  MapPin,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Students",
  description: "Dream of flying? Love drones? Curious about engineering? Discover aviation and STEM programs through the Hidden Treasures Network.",
  openGraph: {
    title: "For Students | Hidden Treasures Network",
    description: "Start your aviation and STEM journey with programs designed for students like you.",
  },
}

export default function StudentsPage() {
  const opportunities = [
    {
      icon: Plane,
      title: "Discovery Flights",
      description: "Experience flying firsthand with an introductory flight lesson",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Radio,
      title: "Drone Training",
      description: "Learn to operate drones and earn FAA certifications",
      color: "from-sky-500 to-sky-700",
    },
    {
      icon: Code,
      title: "STEM Workshops",
      description: "Hands-on coding, robotics, and engineering projects",
      color: "from-green-500 to-green-700",
    },
    {
      icon: Users,
      title: "Mentorship",
      description: "Connect with aviation professionals who guide your journey",
      color: "from-purple-500 to-purple-700",
    },
    {
      icon: Award,
      title: "Scholarships",
      description: "Financial support for flight training and certifications",
      color: "from-aviation-gold to-orange-600",
    },
    {
      icon: GraduationCap,
      title: "Career Pathways",
      description: "Explore careers in aviation, aerospace, and technology",
      color: "from-pink-500 to-pink-700",
    },
  ]

  const pathways = [
    {
      title: "Pilot",
      description: "Commercial airline pilot, cargo pilot, flight instructor",
      icon: "✈️",
    },
    {
      title: "Drone Operator",
      description: "Aerial photography, surveying, inspection, delivery",
      icon: "🚁",
    },
    {
      title: "Aircraft Mechanic",
      description: "Maintenance technician, avionics specialist, inspector",
      icon: "🔧",
    },
    {
      title: "Aerospace Engineer",
      description: "Design and develop aircraft, spacecraft, and systems",
      icon: "🚀",
    },
    {
      title: "Air Traffic Controller",
      description: "Coordinate aircraft movements for safe operations",
      icon: "📡",
    },
    {
      title: "Aviation Manager",
      description: "Airport operations, airline management, business aviation",
      icon: "💼",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="For Students & Families"
        description="Your journey to the skies starts here. Explore programs, connect with mentors, and discover your potential."
      />

      {/* Why Join Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-aviation-gold/10 px-4 py-2 rounded-full mb-4">
                <Sparkles className="h-5 w-5 text-aviation-gold" />
                <span className="text-sm font-semibold text-aviation-gold">Your Future Awaits</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-aviation-navy mb-4">
                Dream of Flying? Love Drones? Curious About Engineering?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Hidden Treasures Network connects you with <strong>free and low-cost programs</strong> that
                make aviation and STEM education accessible to everyone, regardless of background or
                financial situation.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Whether you're dreaming of becoming a pilot, building robots, or launching into aerospace
                engineering, we'll help you find the right program and mentors to support your journey.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
                alt="Students in STEM program"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What's Available to You"
            subtitle="Explore programs and opportunities designed specifically for students"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => {
              const Icon = opportunity.icon
              return (
                <Card
                  key={opportunity.title}
                  className="hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${opportunity.color} w-fit mb-3`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                    <CardDescription className="text-base">{opportunity.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Career Pathways */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Career Pathways"
            subtitle="Aviation and STEM offer diverse, high-demand careers with excellent growth potential"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathways.map((pathway) => (
              <Card key={pathway.title} className="border-2 border-transparent hover:border-aviation-sky transition-all">
                <CardHeader>
                  <div className="text-4xl mb-3">{pathway.icon}</div>
                  <CardTitle className="text-xl mb-2">{pathway.title}</CardTitle>
                  <CardDescription className="text-base">{pathway.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How to Get Started"
            subtitle="Three simple steps to begin your aviation and STEM journey"
          />

          <div className="space-y-6">
            <Card className="border-l-4 border-aviation-sky">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-aviation-sky text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Create Your Free Account</CardTitle>
                    <CardDescription className="text-base">
                      Sign up to access our network of programs, connect with mentors, and track your progress.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-aviation-gold">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-aviation-gold text-aviation-navy flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Explore Programs Near You</CardTitle>
                    <CardDescription className="text-base">
                      Browse our directory of organizations offering aviation and STEM programs in your area or online.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-green-500">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Apply & Start Learning</CardTitle>
                    <CardDescription className="text-base">
                      Submit applications to programs that interest you and begin your journey toward an exciting career.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/register?role=student">
              <Button size="lg" className="bg-aviation-sky hover:bg-aviation-sky/90 text-lg px-8">
                Create Free Student Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-aviation-sky hover:underline font-semibold">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Find Programs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-aviation-navy to-blue-900 text-white border-0">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-3" />
                <CardTitle className="text-2xl mb-2">Explore Network Map</CardTitle>
                <CardDescription className="text-gray-200 text-base">
                  See all organizations offering programs worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/map">
                  <Button size="lg" variant="secondary">
                    View Map
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-aviation-gold to-orange-600 text-white border-0">
              <CardHeader className="text-center">
                <GraduationCap className="h-12 w-12 mx-auto mb-3" />
                <CardTitle className="text-2xl mb-2">Browse Programs</CardTitle>
                <CardDescription className="text-aviation-navy text-base">
                  Discover flight training, drones, STEM labs, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/programs">
                  <Button size="lg" variant="secondary">
                    View Programs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-aviation-sky/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
              alt="Student testimonial"
              width={120}
              height={120}
              className="rounded-full mx-auto border-4 border-white shadow-lg"
            />
          </div>
          <blockquote className="text-2xl font-heading text-aviation-navy mb-4 italic">
            "I never thought someone like me could become a pilot. Hidden Treasures showed me it was
            possible and connected me with a program that changed my life."
          </blockquote>
          <p className="text-lg font-semibold text-aviation-sky mb-1">Maria Rodriguez</p>
          <p className="text-gray-600">Now pursuing Commercial Pilot License</p>
        </div>
      </section>
    </div>
  )
}
