import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/marketing/PageHero"
import { SectionHeading } from "@/components/marketing/SectionHeading"
import {
  Users,
  Heart,
  Target,
  Award,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "For Mentors",
  description: "Share your aviation and STEM expertise. Mentor the next generation and make a lasting impact through the Hidden Treasures Network.",
  openGraph: {
    title: "For Mentors | Hidden Treasures Network",
    description: "Use your experience to inspire and guide future aviation professionals.",
  },
}

export default function MentorsPage() {
  const ways = [
    {
      icon: Users,
      title: "One-on-One Mentoring",
      description: "Guide individual students through their educational and career journey",
      commitment: "2-4 hours/month",
    },
    {
      icon: Target,
      title: "Group Workshops",
      description: "Lead hands-on workshops in your area of expertise",
      commitment: "Flexible schedule",
    },
    {
      icon: Clock,
      title: "Career Panels",
      description: "Participate in virtual or in-person career exploration events",
      commitment: "1-2 hours per event",
    },
    {
      icon: Award,
      title: "Program Support",
      description: "Help organizations develop curricula and program materials",
      commitment: "Project-based",
    },
  ]

  const benefits = [
    "Give back to your industry and community",
    "Develop leadership and coaching skills",
    "Network with aviation and STEM professionals",
    "Recognition for your contributions",
    "Flexible commitment levels",
    "Make a measurable impact on students' lives",
  ]

  const qualifications = [
    { label: "Professional Experience", description: "Working in aviation, aerospace, STEM, or related field" },
    { label: "Passion for Education", description: "Desire to inspire and guide the next generation" },
    { label: "Background Check", description: "Required for direct student interaction" },
    { label: "Time Commitment", description: "Minimum 2 hours per month (flexible)" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="For Mentors & Professionals"
        description="Share your expertise. Inspire the next generation. Create lasting impact through mentorship."
      />

      {/* Why Mentor */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                alt="Mentor and student"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-aviation-navy mb-4">
                Your Experience Can Change Lives
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                As an aviation or STEM professional, you have knowledge and experience that can open doors
                for the next generation. By mentoring with Hidden Treasures Network, you become part of a
                global movement to make these careers accessible to all.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Whether you're a pilot, engineer, mechanic, drone operator, or work in any aviation-related
                field, your guidance can help students discover their potential and navigate their career path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Mentor */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Ways to Mentor"
            subtitle="Choose the mentoring style that fits your schedule and expertise"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {ways.map((way) => {
              const Icon = way.icon
              return (
                <Card key={way.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-aviation-sky/10 rounded-lg">
                        <Icon className="h-6 w-6 text-aviation-sky" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{way.title}</CardTitle>
                        <p className="text-sm text-aviation-gold font-semibold">{way.commitment}</p>
                      </div>
                    </div>
                    <CardDescription className="text-base">{way.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Benefits of Mentoring"
            subtitle="What you gain by giving back"
          />

          <Card className="border-2 border-aviation-sky">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Qualifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Mentor Qualifications"
            subtitle="What we look for in our mentors"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {qualifications.map((qual) => (
              <Card key={qual.label}>
                <CardHeader>
                  <CardTitle className="text-lg text-aviation-navy">{qual.label}</CardTitle>
                  <CardDescription className="text-base">{qual.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6 text-aviation-gold" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Join hundreds of professionals mentoring the next generation of aviation and STEM leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=mentor">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Apply to Become a Mentor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
