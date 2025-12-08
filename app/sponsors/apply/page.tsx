'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Building2, CheckCircle, Upload } from 'lucide-react'
import { getAllSponsorTiers } from '@/lib/db-sponsors'
import { createSponsorApplication } from '@/lib/db-sponsors'
import type { SponsorTier } from '@/types/sponsor'

export default function SponsorApplicationPage() {
  const router = useRouter()
  const [tiers, setTiers] = useState<SponsorTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    tierId: '',
    region: '',
    programSupport: '',
    message: '',
  })

  useEffect(() => {
    loadTiers()
  }, [])

  const loadTiers = async () => {
    try {
      const allTiers = await getAllSponsorTiers(true)
      setTiers(allTiers)
    } catch (error) {
      console.error('Error loading tiers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (
        !formData.orgName ||
        !formData.contactName ||
        !formData.contactEmail ||
        !formData.tierId
      ) {
        alert('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      // Create sponsor application
      await createSponsorApplication({
        orgName: formData.orgName,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        tierId: formData.tierId,
        region: formData.region,
        programSupport: formData.programSupport,
        message: formData.message,
      })

      // Redirect to success page
      router.push('/sponsors/apply/success')
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('An error occurred while submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTier = tiers.find((t) => t.id === formData.tierId)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Become a Sponsor
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Join us in empowering the next generation of aviation and STEM leaders.
            Complete this application to start your sponsorship journey.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-aviation-sky" />
              Sponsorship Application
            </CardTitle>
            <CardDescription>
              Please provide your organization details and sponsorship preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-aviation-navy">
                  Organization Information
                </h3>

                <div>
                  <Label htmlFor="orgName">
                    Organization Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="orgName"
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleInputChange}
                    placeholder="Your organization name"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-aviation-navy">
                  Contact Information
                </h3>

                <div>
                  <Label htmlFor="contactName">
                    Contact Person <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    required
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="contact@organization.com"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Sponsorship Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-aviation-navy">
                  Sponsorship Preferences
                </h3>

                <div>
                  <Label htmlFor="tierId">
                    Sponsorship Tier <span className="text-red-500">*</span>
                  </Label>
                  {isLoading ? (
                    <div className="text-sm text-gray-500 mt-2">Loading tiers...</div>
                  ) : (
                    <Select
                      value={formData.tierId}
                      onValueChange={(value) => handleSelectChange('tierId', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a sponsorship tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiers.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.name} - ${(tier.amountMin / 100).toLocaleString()}+
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedTier && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-aviation-navy mb-2">
                      {selectedTier.name} Benefits
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {selectedTier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <Label htmlFor="region">Region or Area of Focus</Label>
                  <Input
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="e.g., Southeast US, Global, etc."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="programSupport">Programs You'd Like to Support</Label>
                  <Input
                    id="programSupport"
                    name="programSupport"
                    value={formData.programSupport}
                    onChange={handleInputChange}
                    placeholder="e.g., Flight training, STEM education, etc."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your sponsorship goals and how you'd like to contribute..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  By submitting this application, you agree to be contacted by our team regarding
                  sponsorship opportunities. We typically respond within 2-3 business days.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
