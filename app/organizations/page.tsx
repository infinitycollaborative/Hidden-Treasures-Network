import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, MapPin, Users, BookOpen, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function OrganizationsPage() {
  // Sample organizations - in production, fetch from Firestore
  const organizations = [
    {
      id: "1",
      name: "Infinity Aero Club Tampa Bay",
      location: "Tampa Bay, Florida, USA",
      type: "Aviation Education",
      description: "Parent organization of Hidden Treasures Network, dedicated to inspiring youth through aviation and STEM education.",
      students: 500,
      programs: ["Flight Training", "STEM Workshops", "Career Mentorship"],
      website: "https://infinityaeroclub.org"
    },
    {
      id: "2",
      name: "Wings of Tomorrow Foundation",
      location: "Los Angeles, California, USA",
      type: "Youth Aviation",
      description: "Providing underprivileged youth with aviation career pathways and mentorship opportunities.",
      students: 350,
      programs: ["Pilot Training", "Aviation Careers", "Summer Camps"],
      website: "#"
    },
    {
      id: "3",
      name: "STEM Skyward Initiative",
      location: "London, United Kingdom",
      type: "STEM Education",
      description: "Integrating aviation concepts into STEM curriculum for secondary schools across the UK.",
      students: 1200,
      programs: ["School Programs", "Teacher Training", "Aviation STEM"],
      website: "#"
    },
    {
      id: "4",
      name: "Eagle Flight Academy",
      location: "Sydney, Australia",
      type: "Flight Training",
      description: "Youth-focused flight training academy with scholarship programs for underserved communities.",
      students: 280,
      programs: ["PPL Training", "Scholarships", "Mentorship"],
      website: "#"
    },
    {
      id: "5",
      name: "Aviation Dreams Africa",
      location: "Nairobi, Kenya",
      type: "Aviation Education",
      description: "Bringing aviation education and career opportunities to African youth.",
      students: 450,
      programs: ["Career Guidance", "STEM Education", "Industry Partnerships"],
      website: "#"
    },
    {
      id: "6",
      name: "Future Pilots of America",
      location: "Chicago, Illinois, USA",
      type: "Youth Development",
      description: "Building the next generation of diverse aviation professionals through education and mentorship.",
      students: 680,
      programs: ["Mentorship", "Flight Experience", "College Prep"],
      website: "#"
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Network Organizations
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Discover aviation and STEM education organizations around the world.
            Connect, collaborate, and amplify your impact together.
          </p>
          <Link href="/register">
            <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
              Add Your Organization
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card key={org.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Plane className="h-8 w-8 text-aviation-sky" />
                  <Badge variant="secondary">{org.type}</Badge>
                </div>
                <CardTitle className="text-xl mb-2">{org.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {org.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{org.description}</p>

                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{org.students.toLocaleString()} students impacted</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                    <BookOpen className="h-4 w-4" />
                    Programs:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {org.programs.map((program, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {program}
                      </Badge>
                    ))}
                  </div>
                </div>

                {org.website !== "#" && (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-aviation-sky hover:underline text-sm flex items-center gap-1"
                  >
                    Visit Website <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
            <CardHeader>
              <CardTitle className="text-2xl mb-2">Join the Network</CardTitle>
              <CardDescription className="text-gray-300">
                Is your organization dedicated to aviation or STEM education?
                Join the Hidden Treasures Network to amplify your impact and connect with partners worldwide.
              </CardDescription>
              <div className="mt-4">
                <Link href="/register">
                  <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                    Register Your Organization
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
