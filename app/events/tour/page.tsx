'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Plane, Users, Wrench, Sparkles, Heart, ArrowRight } from 'lucide-react'

import { EventCard } from '@/components/events/EventCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeading } from '@/components/marketing/SectionHeading'
import { getUpcomingEvents } from '@/lib/db-events'
import { Event } from '@/types/event'

export default function HiddenTreasuresTourPage() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await getUpcomingEvents({ isHiddenTreasuresTourStop: true })
      setEvents(data)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-aviation-navy to-aviation-sky text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm uppercase tracking-wide mb-4">
            <Plane className="h-6 w-6" />
            <span>Hidden Treasures Tour</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            A Flying Tribute Inspiring the Next Generation
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mb-6">
            The Hidden Treasures Tour travels nationwide honoring the legacy of the Tuskegee Airmen
            and aviation pioneers of color while bringing hands-on aviation experiences to students
            in communities everywhere.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/events/calendar">
              <Button variant="secondary" size="lg">
                View Full Calendar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* About the Aircraft */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
                alt="Red Tail tribute aircraft"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-aviation-navy mb-4">
                The Red Tail Tribute
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Our Cessna 172 tribute aircraft honors the Tuskegee Airmen and their iconic "Red Tail"
                P-51 Mustangs. This flying classroom brings history to life while introducing students
                to the possibilities of aviation careers.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                The aircraft represents more than flight—it symbolizes breaking barriers, overcoming
                adversity, and achieving excellence despite the odds. Every tour stop celebrates this
                legacy while creating new opportunities for today's youth.
              </p>
              <div className="bg-aviation-gold/10 p-4 rounded-lg border-l-4 border-aviation-gold">
                <p className="text-aviation-navy font-semibold mb-1">Honoring Legacy, Creating Future</p>
                <p className="text-gray-700 text-sm">
                  A tribute to the Tuskegee Airmen and all aviation pioneers of color
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Experience */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Happens at a Tour Stop"
            subtitle="Every tour event brings hands-on aviation experiences and inspiration to the community"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Plane className="h-10 w-10 text-aviation-sky mb-3" />
                <CardTitle className="text-lg">Discovery Flights</CardTitle>
                <CardDescription>
                  Students experience flight firsthand with introductory flight lessons
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-aviation-gold mb-3" />
                <CardTitle className="text-lg">Meet & Greet</CardTitle>
                <CardDescription>
                  Connect with pilots, engineers, and aviation professionals from the community
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Wrench className="h-10 w-10 text-green-600 mb-3" />
                <CardTitle className="text-lg">Aircraft Tours</CardTitle>
                <CardDescription>
                  Up-close look at aircraft systems, instruments, and maintenance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-purple-600 mb-3" />
                <CardTitle className="text-lg">Legacy Stories</CardTitle>
                <CardDescription>
                  Learn about the Tuskegee Airmen and aviation history that inspires today
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Stops */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Upcoming Tour Stops"
            subtitle="See where the Hidden Treasures Tour is headed next"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            {events.length === 0 && (
              <div className="col-span-full text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Tour schedule is being finalized.</p>
                <p className="text-sm text-gray-500">Check back soon for upcoming tour stops!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Host the Tour CTA */}
      <section className="py-16 bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-aviation-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Bring the Tour to Your City
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Organizations, schools, and community groups can host a Hidden Treasures Tour stop.
            Bring inspiration, hands-on aviation experiences, and career opportunities to your students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy font-semibold">
                Request a Tour Stop
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/get-involved/organizations">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn About Hosting
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
