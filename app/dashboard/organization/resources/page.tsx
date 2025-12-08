'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ResourceForm, ResourceFormValues } from '@/components/resources/ResourceForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { createResource, deleteResource, getResources, updateResource } from '@/lib/db-resources'
import { uploadResourceFile } from '@/lib/storage'
import { Resource } from '@/types/resource'

export default function OrganizationResourcesPage() {
  const { role, user, profile } = useAuth()
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [editing, setEditing] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role && role !== 'organization') {
      router.push('/login')
    }
  }, [role, router])

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      const orgResources = await getResources({ organizationId: user.uid })
      setResources(orgResources)
    }
    load()
  }, [user?.uid])

  const handleSubmit = async (values: ResourceFormValues, file: File | null) => {
    if (!user?.uid) return
    if (!file && !values.externalLink && !editing?.fileUrl) {
      alert('Please upload a file or provide an external link')
      return
    }
    setLoading(true)
    try {
      let fileUrl = editing?.fileUrl || values.externalLink || ''
      const fileType = values.externalLink ? 'link' : editing?.fileType || 'other'
      const resourceId = editing?.id || crypto.randomUUID()

      if (file) {
        fileUrl = await uploadResourceFile(file, `resources/${resourceId}/${file.name}`)
      }

      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        audience: values.audience,
        difficulty: values.difficulty,
        durationMinutes: values.durationMinutes,
        language: values.language,
        tags: values.tags || [],
        fileUrl,
        fileType: values.externalLink ? 'link' : fileType,
        uploadedBy: user.uid,
        uploadedByName: profile?.displayName || profile?.email,
        organizationId: user.uid,
        isFeatured: false,
      }

      if (editing) {
        await updateResource(editing.id, payload)
      } else {
        await createResource({ id: resourceId, ...payload, views: 0, downloads: 0 })
      }

      const refreshed = await getResources({ organizationId: user.uid })
      setResources(refreshed)
      setEditing(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteResource(id)
    setResources((prev) => prev.filter((res) => res.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Organization</p>
        <h1 className="text-3xl font-bold text-aviation-navy">Your Resources</h1>
        <p className="text-gray-600">Upload and manage the materials your teams rely on.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit resource' : 'Add new resource'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceForm defaultValues={editing || undefined} onSubmit={handleSubmit} submitting={loading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Title</th>
                <th>Category</th>
                <th>Audience</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => (
                <tr key={res.id} className="border-t">
                  <td className="py-2 font-medium">{res.title}</td>
                  <td className="capitalize">{res.category}</td>
                  <td className="capitalize">{res.audience?.join(', ')}</td>
                  <td>{res.downloads || 0}</td>
                  <td className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(res)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(res.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
