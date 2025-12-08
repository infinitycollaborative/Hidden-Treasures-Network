import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/marketing/PageHero"
import { SectionHeading } from "@/components/marketing/SectionHeading"
import {
  Plane,
  Radio,
  Wrench,
  Code,
  Briefcase,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Users,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Aviation & STEM Programs",
  description: "Discover flight training, drone certification, aircraft maintenance, STEM education, and entrepreneurship programs through the Hidden Treasures Network.",
  openGraph: {
    title: "Aviation & STEM Programs | Hidden Treasures Network",
    description: "Explore our comprehensive pathways in aviation and STEM education.",
  },
}

export default function ProgramsPage() {
  const programs = [
    {
      icon: Plane,
      title: "Flight Training",
      tagline: "Learn to Fly",
      description: "From discovery flights to commercial pilot licenses, we connect students with quality flight training programs worldwide.",
      age: "14+",
      duration: "Varies by certification",
      outcomes: [
        "Private Pilot License (PPL)",
        "Instrument Rating",
        "Commercial Pilot License (CPL)",
        "Flight Instructor Certification",
      ],
      color: "from-blue-500 to-blue-700",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
    },
    {
      icon: Radio,
      title: "Drone & UAS Training",
      tagline: "Master the Skies",
      description: "Learn drone operation, aerial photography, and prepare for FAA Part 107 certification with hands-on training.",
      age: "12+",
      duration: "4-8 weeks",
      outcomes: [
        "FAA TRUST Certificate",
        "FAA Part 107 License",
        "Drone Operations Skills",
        "Aerial Photography Basics",
      ],
      color: "from-sky-500 to-sky-700",
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop",
    },
    {
      icon: Wrench,
      title: "Aircraft Maintenance",
      tagline: "Keep Them Flying",
      description: "Hands-on training in aircraft maintenance, inspection, and repair. Learn the skills that keep aviation safe.",
      age: "16+",
      duration: "6-24 months",
      outcomes: [
        "Light Sport Repair & Maintenance",
        "A&P Mechanic Training",
        "Aviation Maintenance Technician",
        "Inspection Authorization",
      ],
      color: "from-orange-500 to-orange-700",
      image: "https://images.unsplash.com/photo-1581092160607-ee67fc99c4b4?q=80&w=2070&auto=format&fit=crop",
    },
    {
      icon: Code,
      title: "STEM & Coding Labs",
      tagline: "Build the Future",
      description: "Interactive workshops in coding, robotics, aerospace engineering, and emerging technologies.",
      age: "10+",
      duration: "8-12 weeks",
      outcomes: [
        "Programming Fundamentals",
        "Robotics & Automation",
        "Aerospace Engineering Basics",
        "3D Design & Printing",
      ],
      color: "from-green-500 to-green-700",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    },
    {
      icon: Briefcase,
      title: "Entrepreneurship & Leadership",
      tagline: "Lead the Way",
      description: "Develop business skills, leadership capabilities, and learn the business side of aviation.",
      age: "15+",
      duration: "10-16 weeks",
      outcomes: [
        "Business Planning & Strategy",
        "Leadership Development",
        "Aviation Business Fundamentals",
        "Public Speaking & Presentation",
      ],
      color: "from-purple-500 to-purple-700",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    },
    {
      icon: GraduationCap,
      title: "Mission Aviation Academy Online",
      tagline: "Learn Anywhere",
      description: "Virtual courses in aviation fundamentals, STEM topics, and career preparation accessible from anywhere.",
      age: "12+",
      duration: "Self-paced",
      outcomes: [
        "Aviation Fundamentals",
        "STEM Career Pathways",
        "College & Career Readiness",
        "Industry Certifications",
      ],
      color: "from-aviation-gold to-orange-600",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Aviation & STEM Programs"
        description="Comprehensive pathways to launch your future in aviation, aerospace, and emerging technologies."
      />

      {/* Programs Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Program Pathways"
            subtitle="From first flight to career launch, we offer programs for every stage of your journey"
          />

          <div className="space-y-12">
            {programs.map((program, index) => {
              const Icon = program.icon
              const isEven = index % 2 === 0

              return (
                <Card key={program.title} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`grid md:grid-cols-2 gap-0 ${isEven ? "" : "md:flex-row-reverse"}`}>
                    {/* Image */}
                    <div className={`relative h-64 md:h-auto ${!isEven ? "md:order-2" : ""}`}>
                      <Image
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r ${program.color} opacity-20`} />
                    </div>

                    {/* Content */}
                    <div className={`p-6 md:p-8 ${!isEven ? "md:order-1" : ""}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${program.color}`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-heading font-bold text-aviation-navy">
                            {program.title}
                          </h3>
                          <p className="text-sm text-aviation-sky font-semibold">{program.tagline}</p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                        {program.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Badge variant="secondary" className="text-sm">
                          Ages {program.age}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                          {program.duration}
                        </Badge>
                      </div>

                      {/* Outcomes */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-aviation-navy mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          What You'll Achieve
                        </h4>
                        <ul className="space-y-2">
                          {program.outcomes.map((outcome) => (
                            <li key={outcome} className="text-gray-700 text-sm flex items-start gap-2">
                              <span className="text-aviation-sky mt-1">•</span>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Find a Program Near You"
            subtitle="Our network of organizations offers programs in communities worldwide"
          />

          <Card className="border-2 border-aviation-sky">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-aviation-sky/10 rounded-full w-fit">
                <Users className="h-12 w-12 text-aviation-sky" />
              </div>
              <CardTitle className="text-2xl mb-2">Connect with a Network Organization</CardTitle>
              <CardDescription className="text-base">
                Browse our directory of organizations offering aviation and STEM programs in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/map">
                  <Button size="lg" className="bg-aviation-sky hover:bg-aviation-sky/90">
                    Explore Network Map
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/network/directory">
                  <Button size="lg" variant="outline">
                    Browse Directory
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-600">
                Not sure where to start?{" "}
                <Link href="/register?role=student" className="text-aviation-sky hover:underline font-semibold">
                  Create a free student account
                </Link>{" "}
                and we'll help match you with programs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Join thousands of students discovering their potential through aviation and STEM education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=student">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
