"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHero } from "@/components/marketing/PageHero"
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react"
import { submitContactMessage } from "@/lib/db-contact"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      await submitContactMessage(formData)
      setStatus("success")
      setFormData({
        name: "",
        email: "",
        organization: "",
        role: "",
        message: "",
      })
    } catch (error: any) {
      setStatus("error")
      setErrorMessage(error.message || "Failed to send message. Please try again.")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Get in Touch"
        description="Have questions? Want to partner with us? We'd love to hear from you."
      />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 1-2 business days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {status === "success" ? (
                    <div className="text-center py-8">
                      <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-aviation-navy mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-700 mb-6">
                        Thank you for reaching out. We'll get back to you soon.
                      </p>
                      <Button onClick={() => setStatus("idle")} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          disabled={status === "loading"}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          disabled={status === "loading"}
                        />
                      </div>

                      <div>
                        <Label htmlFor="organization">Organization (Optional)</Label>
                        <Input
                          id="organization"
                          type="text"
                          value={formData.organization}
                          onChange={(e) => handleChange("organization", e.target.value)}
                          disabled={status === "loading"}
                        />
                      </div>

                      <div>
                        <Label htmlFor="role">I am a... *</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => handleChange("role", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Student">Student / Family</SelectItem>
                            <SelectItem value="Mentor">Mentor / Professional</SelectItem>
                            <SelectItem value="Organization">School / Organization</SelectItem>
                            <SelectItem value="Sponsor">Sponsor / Partner</SelectItem>
                            <SelectItem value="Media">Media / Press</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          rows={6}
                          disabled={status === "loading"}
                          placeholder="Tell us how we can help..."
                        />
                      </div>

                      {status === "error" && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                          {errorMessage}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-aviation-sky hover:bg-aviation-sky/90"
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us directly through any of these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-aviation-sky/10 rounded-lg">
                      <Mail className="h-6 w-6 text-aviation-sky" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-aviation-navy mb-1">General Inquiries</h3>
                      <a
                        href="mailto:info@hiddentreasuresnetwork.org"
                        className="text-aviation-sky hover:underline"
                      >
                        info@hiddentreasuresnetwork.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-aviation-gold/10 rounded-lg">
                      <Mail className="h-6 w-6 text-aviation-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-aviation-navy mb-1">
                        Sponsorship & Partnerships
                      </h3>
                      <a
                        href="mailto:partnerships@hiddentreasuresnetwork.org"
                        className="text-aviation-sky hover:underline"
                      >
                        partnerships@hiddentreasuresnetwork.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Mail className="h-6 w-6 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-aviation-navy mb-1">Media & Press</h3>
                      <a
                        href="mailto:media@hiddentreasuresnetwork.org"
                        className="text-aviation-sky hover:underline"
                      >
                        media@hiddentreasuresnetwork.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Phone className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-aviation-navy mb-1">Phone</h3>
                      <a href="tel:+18135551234" className="text-aviation-sky hover:underline">
                        (813) 555-1234
                      </a>
                      <p className="text-sm text-gray-600 mt-1">Mon-Fri, 9am-5pm ET</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-aviation-navy mb-1">Headquarters</h3>
                      <p className="text-gray-700">
                        Infinity Aero Club Tampa Bay, Inc.
                        <br />
                        Tampa Bay, Florida
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-aviation-navy to-blue-900 text-white">
                <CardHeader>
                  <CardTitle className="text-xl">Hours of Operation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 5:00 PM ET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Saturday:</span>
                    <span className="font-semibold">10:00 AM - 2:00 PM ET</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sunday:</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
