"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft, Share2, Eye } from "lucide-react"
import { getPostBySlug, incrementPostViews, BlogPost } from "@/lib/db-blog"
import { format } from "date-fns"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return

      try {
        const fetchedPost = await getPostBySlug(slug)
        if (!fetchedPost) {
          notFound()
          return
        }

        setPost(fetchedPost)

        // Increment view count
        await incrementPostViews(fetchedPost.id)
      } catch (error) {
        console.error("Failed to load blog post:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
      return format(date, "MMMM d, yyyy")
    } catch {
      return "Recent"
    }
  }

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      {post.coverImageUrl && (
        <div className="relative h-96 w-full">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-aviation-sky hover:text-aviation-sky/80 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stories</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-aviation-navy mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Summary */}
          <p className="text-xl text-gray-700 leading-relaxed mb-6">{post.summary}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-t border-b border-gray-200 py-4">
            {post.authorName && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">{post.authorName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            {post.views && post.views > 0 && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="ml-auto"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Article Content */}
        <Card>
          <CardContent className="prose prose-lg max-w-none p-8">
            {/* Convert content from string to rendered HTML/markdown */}
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-br from-aviation-navy to-blue-900 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-heading font-bold mb-3">
            Inspired by This Story?
          </h3>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Join the Hidden Treasures Network and be part of the movement to impact one million lives
            through aviation and STEM education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Join the Network
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Read More Stories
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
