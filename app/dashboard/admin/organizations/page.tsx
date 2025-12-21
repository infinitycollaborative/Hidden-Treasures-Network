'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {
  deleteOrganization,
  getAllOrganizations,
  createOrganization,
  updateOrganization,
  OrganizationRecord,
  OrganizationStatus,
} from '@/lib/db-organizations'
import { useAuth } from '@/hooks/use-auth'
import { getFirebaseStorage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createNotification } from '@/lib/db-notifications'

const programOptions = ['Flight', 'STEM', 'Aircraft Maintenance', 'Drone', 'Entrepreneurship'] as const
const statusOptions = ['pending', 'approved', 'active'] as const

const organizationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  programTypes: z.array(z.enum(programOptions)).optional(),
  status: z.enum(statusOptions).optional(),
  studentsServed: z.string().optional(),
  certificationsAwarded: z.string().optional(),
  volunteerHours: z.string().optional(),
})

type OrganizationFormValues = z.infer<typeof organizationSchema>

export default function AdminOrganizationsPage() {
  const { role, loading: authLoading } = useAuth()
  const router = useRouter()
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      country: '',
      state: '',
      city: '',
      lat: '',
      lng: '',
      programTypes: [],
      status: 'pending',
      studentsServed: '',
      certificationsAwarded: '',
      volunteerHours: '',
    },
  })

  useEffect(() => {
    if (!authLoading && role && role !== 'admin') {
      router.push('/login')
    }
  }, [authLoading, role, router])

  useEffect(() => {
    const load = async () => {
      const data = await getAllOrganizations()
      setOrganizations(data)
    }
    load()
  }, [])

  const uploadAsset = async (path: string, file: File) => {
    const storage = getFirebaseStorage()
    if (!storage) throw new Error('Storage not configured')
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const onSubmit = async (values: OrganizationFormValues) => {
    setLoading(true)
    try {
      const payload: OrganizationRecord = {
        name: values.name,
        description: values.description,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone,
        website: values.website || undefined,
        location: {
          country: values.country,
          state: values.state,
          city: values.city,
          coordinates:
            values.lat && values.lng
              ? {
                  lat: parseFloat(values.lat),
                  lng: parseFloat(values.lng),
                }
              : undefined,
        },
        programTypes: values.programTypes,
        status: values.status,
        impact: {
          studentsServed: values.studentsServed ? parseInt(values.studentsServed) : undefined,
          certificationsAwarded: values.certificationsAwarded ? parseInt(values.certificationsAwarded) : undefined,
          volunteerHours: values.volunteerHours ? parseInt(values.volunteerHours) : undefined,
        },
        media: {},
      }

      if (logoFile) {
        const url = await uploadAsset(`organizations/${Date.now()}-logo-${logoFile.name}`, logoFile)
        payload.media = { ...(payload.media || {}), logoUrl: url }
      }

      if (galleryFiles && galleryFiles.length) {
        const uploads = await Promise.all(
          Array.from(galleryFiles).map((file) => uploadAsset(`organizations/gallery/${Date.now()}-${file.name}`, file))
        )
        payload.media = { ...(payload.media || {}), gallery: uploads }
      }

      if (editingId) {
        await updateOrganization(editingId, payload)
      } else {
        await createOrganization(payload)
      }

      const refreshed = await getAllOrganizations()
      setOrganizations(refreshed)
      form.reset()
      setEditingId(null)
      setLogoFile(null)
      setGalleryFiles(null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (org: OrganizationRecord) => {
    setEditingId(org.id || null)
    form.reset({
      name: org.name,
      description: org.description || '',
      contactEmail: org.contactEmail || '',
      contactPhone: org.contactPhone || '',
      website: org.website || '',
      country: org.location?.country || '',
      state: org.location?.state || '',
      city: org.location?.city || '',
      lat: org.location?.coordinates?.lat ? org.location.coordinates.lat.toString() : '',
      lng: org.location?.coordinates?.lng ? org.location.coordinates.lng.toString() : '',
      programTypes: (org.programTypes as OrganizationFormValues['programTypes']) || [],
      status: (org.status as OrganizationFormValues['status']) || 'pending',
      studentsServed: org.impact?.studentsServed?.toString() || '',
      certificationsAwarded: org.impact?.certificationsAwarded?.toString() || '',
      volunteerHours: org.impact?.volunteerHours?.toString() || '',
    })
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    await deleteOrganization(id)
    const refreshed = await getAllOrganizations()
    setOrganizations(refreshed)
  }

  const handleStatusChange = async (id: string, status: OrganizationStatus) => {
    await updateOrganization(id, { status })
    if (status === 'approved') {
      await createNotification(id, {
        title: 'Organization approved',
        message: 'Your organization has been approved. Welcome aboard!',
        type: 'organization_approved',
        link: '/dashboard/organization/impact',
      })
    }
    if (status === 'pending') {
      await createNotification(id, {
        title: 'Organization needs attention',
        message: 'Your organization is pending review. Please verify your submission details.',
        type: 'organization_rejected',
        link: '/dashboard/organization',
      })
    }
    const refreshed = await getAllOrganizations()
    setOrganizations(refreshed)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div>
          <p className="text-sm uppercase text-aviation-gold font-semibold">Admin</p>
          <h1 className="text-3xl font-heading font-bold text-aviation-navy">Organization Management</h1>
          <p className="text-gray-600 mt-2">Add, edit, or approve organizations across the network.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="text-lg">Organizations</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Name</th>
                    <th className="py-2">City</th>
                    <th className="py-2">Country</th>
                    <th className="py-2">Programs</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr key={org.id} className="border-b last:border-b-0">
                      <td className="py-2 font-semibold">{org.name}</td>
                      <td className="py-2">{org.location?.city}</td>
                      <td className="py-2">{org.location?.country}</td>
                      <td className="py-2">
                        <div className="flex flex-wrap gap-1">
                          {org.programTypes?.map((type) => (
                            <span key={type} className="px-2 py-1 bg-blue-50 rounded-full text-[11px] border">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2">
                          <select
                            value={org.status}
                            onChange={(e) => org.id && handleStatusChange(org.id, e.target.value as OrganizationStatus)}
                            className="rounded-md border px-2 py-1 text-sm"
                          >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(org)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(org.id)} className="text-red-600">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="order-1 lg:order-2">
            <CardHeader>
              <CardTitle className="text-lg">{editingId ? 'Edit Organization' : 'Add Organization'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                  <Label>Name</Label>
                  <Input placeholder="Organization name" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Mission and offerings"
                    {...form.register('description')}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Contact Email</Label>
                    <Input type="email" placeholder="contact@example.com" {...form.register('contactEmail')} />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input placeholder="(555) 555-5555" {...form.register('contactPhone')} />
                  </div>
                </div>

                <div>
                  <Label>Website</Label>
                  <Input placeholder="https://" {...form.register('website')} />
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <Label>Country</Label>
                    <Input {...form.register('country')} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input {...form.register('state')} />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input {...form.register('city')} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Latitude</Label>
                    <Input {...form.register('lat')} />
                  </div>
                  <div>
                    <Label>Longitude</Label>
                    <Input {...form.register('lng')} />
                  </div>
                </div>

                <div>
                  <Label>Program Types</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {programOptions.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          value={type}
                          checked={form.watch('programTypes')?.includes(type)}
                          onChange={(e) => {
                            const current = form.watch('programTypes') || []
                            if (e.target.checked) form.setValue('programTypes', [...current, type])
                            else form.setValue('programTypes', current.filter((item) => item !== type))
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <select
                    {...form.register('status')}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    defaultValue={form.watch('status')}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <Label>Students Served</Label>
                    <Input type="number" min={0} {...form.register('studentsServed')} />
                  </div>
                  <div>
                    <Label>Certifications Awarded</Label>
                    <Input type="number" min={0} {...form.register('certificationsAwarded')} />
                  </div>
                  <div>
                    <Label>Volunteer Hours</Label>
                    <Input type="number" min={0} {...form.register('volunteerHours')} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Logo Upload</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <Label>Media Gallery</Label>
                    <Input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles(e.target.files)} />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {editingId && (
                    <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
                  )}
                  <Button type="submit" className="bg-aviation-navy text-white" disabled={loading}>
                    {editingId ? 'Update Organization' : 'Create Organization'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
