"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHero } from "@/components/marketing/PageHero"
import { SectionHeading } from "@/components/marketing/SectionHeading"
import { EmailCapture } from "@/components/marketing/EmailCapture"
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react"
import { getPublishedPosts, BlogPost } from "@/lib/db-blog"
import { format } from "date-fns"

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getPublishedPosts(20)
        setPosts(fetchedPosts)
      } catch (error) {
        console.error("Failed to load blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
      return format(date, "MMMM d, yyyy")
    } catch {
      return "Recent"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Stories & News"
        description="Updates, success stories, and insights from the Hidden Treasures Network community."
      />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading stories...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-fit">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-aviation-navy mb-2">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                We're working on bringing you inspiring stories and updates from our community.
              </p>
              <EmailCapture
                source="blog"
                title="Stay Updated"
                description="Subscribe to be notified when we publish new stories."
                className="max-w-lg mx-auto"
              />
            </div>
          ) : (
            <>
              <SectionHeading
                title="Latest Stories"
                subtitle="Read about the lives being transformed through aviation and STEM education"
              />

              {/* Featured Post */}
              {posts[0] && (
                <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-64 md:h-auto">
                      <Image
                        src={
                          posts[0].coverImageUrl ||
                          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
                        }
                        alt={posts[0].title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-3 bg-aviation-gold text-aviation-navy">
                        Featured Story
                      </Badge>
                      <h2 className="text-3xl font-heading font-bold text-aviation-navy mb-3">
                        {posts[0].title}
                      </h2>
                      <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                        {posts[0].summary}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                        {posts[0].authorName && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{posts[0].authorName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(posts[0].publishedAt)}</span>
                        </div>
                      </div>
                      <Link href={`/blog/${posts[0].slug}`}>
                        <span className="text-aviation-sky hover:text-aviation-sky/80 font-semibold inline-flex items-center gap-2">
                          Read Full Story
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}

              {/* Grid of Posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                    {post.coverImageUrl && (
                      <div className="relative h-48">
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <CardHeader className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl mb-2 line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="text-base line-clamp-3">
                        {post.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {post.authorName && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.authorName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <span className="text-aviation-sky hover:text-aviation-sky/80 font-semibold text-sm inline-flex items-center gap-2">
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Subscribe */}
      {posts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <EmailCapture
              source="blog"
              title="Never Miss a Story"
              description="Subscribe to our newsletter for the latest updates, success stories, and opportunities."
              className="text-center text-white"
            />
          </div>
        </section>
      )}
    </div>
  )
}
