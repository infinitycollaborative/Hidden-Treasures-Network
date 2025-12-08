'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react'
import { getAllSponsorTiers, createSponsorTier, updateSponsorTier } from '@/lib/db-sponsors'
import type { SponsorTier } from '@/types/sponsor'

export default function AdminSponsorTiersPage() {
  const [tiers, setTiers] = useState<SponsorTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTier, setEditingTier] = useState<SponsorTier | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amountMin: 0,
    amountMax: 0,
    description: '',
    benefits: [''],
    color: '',
    displayOrder: 0,
    isActive: true,
  })

  useEffect(() => {
    loadTiers()
  }, [])

  const loadTiers = async () => {
    try {
      const allTiers = await getAllSponsorTiers()
      setTiers(allTiers)
    } catch (error) {
      console.error('Error loading tiers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (tier?: SponsorTier) => {
    if (tier) {
      setEditingTier(tier)
      setFormData({
        name: tier.name,
        amountMin: tier.amountMin,
        amountMax: tier.amountMax || 0,
        description: tier.description,
        benefits: tier.benefits,
        color: tier.color || '',
        displayOrder: tier.displayOrder,
        isActive: tier.isActive,
      })
    } else {
      setEditingTier(null)
      setFormData({
        name: '',
        amountMin: 0,
        amountMax: 0,
        description: '',
        benefits: [''],
        color: '',
        displayOrder: tiers.length,
        isActive: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData({ ...formData, benefits: newBenefits })
  }

  const handleAddBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] })
  }

  const handleRemoveBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index)
    setFormData({ ...formData, benefits: newBenefits })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const tierData = {
        name: formData.name,
        amountMin: formData.amountMin * 100, // Convert to cents
        amountMax: formData.amountMax ? formData.amountMax * 100 : undefined,
        description: formData.description,
        benefits: formData.benefits.filter((b) => b.trim() !== ''),
        color: formData.color || undefined,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      }

      if (editingTier) {
        await updateSponsorTier(editingTier.id, tierData)
      } else {
        await createSponsorTier(tierData)
      }

      setIsDialogOpen(false)
      loadTiers()
    } catch (error) {
      console.error('Error saving tier:', error)
      alert('Failed to save tier')
    }
  }

  const handleToggleActive = async (tier: SponsorTier) => {
    try {
      await updateSponsorTier(tier.id, { isActive: !tier.isActive })
      loadTiers()
    } catch (error) {
      console.error('Error toggling tier status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-aviation-navy">Sponsor Tier Management</h1>
            <p className="text-gray-600 mt-2">Create and manage sponsorship tiers and benefits</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-aviation-navy hover:bg-aviation-navy/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTier ? 'Edit Sponsor Tier' : 'Create New Sponsor Tier'}
                </DialogTitle>
                <DialogDescription>
                  Configure the sponsorship tier details and benefits
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Tier Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Gold Sponsor"
                    required
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amountMin">Minimum Amount ($) *</Label>
                    <Input
                      id="amountMin"
                      type="number"
                      min="0"
                      value={formData.amountMin}
                      onChange={(e) =>
                        setFormData({ ...formData, amountMin: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="10000"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amountMax">Maximum Amount ($)</Label>
                    <Input
                      id="amountMax"
                      type="number"
                      min="0"
                      value={formData.amountMax}
                      onChange={(e) =>
                        setFormData({ ...formData, amountMax: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="Optional"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Champion of Workforce Training and STEM Pathways"
                    required
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color Class (Tailwind)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="from-aviation-gold to-orange-600"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tailwind gradient classes (e.g., from-gold-400 to-gold-600)
                  </p>
                </div>

                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Benefits *</Label>
                    <Button type="button" onClick={handleAddBenefit} size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Benefit
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          placeholder="Enter benefit description"
                          required
                        />
                        {formData.benefits.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => handleRemoveBenefit(index)}
                            variant="destructive"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active (visible to public)</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-aviation-navy hover:bg-aviation-navy/90"
                  >
                    {editingTier ? 'Update Tier' : 'Create Tier'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tiers List */}
        {tiers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 mb-4">No sponsor tiers created yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Tier
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tiers.map((tier) => (
              <Card key={tier.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{tier.name}</CardTitle>
                        <Badge variant={tier.isActive ? 'default' : 'secondary'}>
                          {tier.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription>
                        ${(tier.amountMin / 100).toLocaleString()}
                        {tier.amountMax && ` - $${(tier.amountMax / 100).toLocaleString()}`}
                      </CardDescription>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleOpenDialog(tier)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleToggleActive(tier)}
                        variant={tier.isActive ? 'secondary' : 'default'}
                        size="sm"
                      >
                        {tier.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{tier.description}</p>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Benefits:</h4>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
