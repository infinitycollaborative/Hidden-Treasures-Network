import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, FileText, Video, Link as LinkIcon, Presentation } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const resourceCategories = [
    {
      id: "curricula",
      title: "Curricula & Lesson Plans",
      icon: BookOpen,
      description: "Ready-to-use educational materials for aviation and STEM programs",
      resources: [
        { name: "Introduction to Aviation - 12-Week Curriculum", type: "PDF", size: "2.5 MB" },
        { name: "STEM Through Flight - Lesson Plans", type: "PDF", size: "1.8 MB" },
        { name: "Entrepreneurship in Aviation", type: "PDF", size: "3.2 MB" },
      ]
    },
    {
      id: "training",
      title: "Training Materials",
      icon: Presentation,
      description: "Resources for training mentors, instructors, and volunteers",
      resources: [
        { name: "Mentor Training Guide", type: "PDF", size: "1.5 MB" },
        { name: "Safety Protocols for Youth Programs", type: "PDF", size: "900 KB" },
        { name: "Effective Teaching in Aviation", type: "Video", size: "45 min" },
      ]
    },
    {
      id: "templates",
      title: "Program Templates",
      icon: FileText,
      description: "Templates and frameworks for building successful programs",
      resources: [
        { name: "Summer Camp Program Template", type: "DOCX", size: "450 KB" },
        { name: "Mentorship Program Framework", type: "PDF", size: "1.2 MB" },
        { name: "Grant Application Template", type: "DOCX", size: "380 KB" },
      ]
    },
    {
      id: "videos",
      title: "Educational Videos",
      icon: Video,
      description: "Inspiring videos and documentaries for students and educators",
      resources: [
        { name: "Careers in Aviation Series", type: "Video", size: "6 episodes" },
        { name: "STEM Success Stories", type: "Video", size: "12 videos" },
        { name: "Flight Training Fundamentals", type: "Video", size: "8 modules" },
      ]
    },
  ]

  const bestPractices = [
    "Building Sustainable Aviation Education Programs",
    "Recruiting and Retaining Quality Mentors",
    "Fundraising Strategies for Nonprofit Aviation Programs",
    "Engaging Underserved Communities in STEM",
    "Measuring and Reporting Program Impact",
    "Partnership Development with Industry",
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Resource Library
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Access and share educational materials, curricula, best practices, and program
            templates. Together, we amplify our resources and multiply our impact.
          </p>
          <Link href="/register">
            <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
              Contribute Resources
            </Button>
          </Link>
        </div>

        {/* Resource Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {resourceCategories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-8 w-8 text-aviation-sky" />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                          <p className="text-xs text-gray-500">
                            {resource.type} • {resource.size}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="ml-2">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All in Category
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Best Practices */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <LinkIcon className="h-6 w-6 text-aviation-sky" />
              Best Practices & Guides
            </CardTitle>
            <CardDescription>
              Learn from successful programs and implement proven strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestPractices.map((practice, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-900">{practice}</p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-aviation-sky">
                      Read Guide →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Share Your Resources</CardTitle>
            <CardDescription className="text-gray-300">
              Have valuable materials to share with the network? Your contributions help
              organizations worldwide deliver better programs and impact more lives.
            </CardDescription>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                  Submit Resources
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Sign In to Access
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
