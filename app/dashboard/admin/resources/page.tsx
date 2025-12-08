'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ResourceForm, ResourceFormValues } from '@/components/resources/ResourceForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from '@/lib/db-resources'
import { uploadResourceFile } from '@/lib/storage'
import { useAuth } from '@/hooks/use-auth'
import { Resource } from '@/types/resource'

export default function AdminResourcesPage() {
  const { role, user } = useAuth()
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [editing, setEditing] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role && role !== 'admin') {
      router.push('/login')
    }
  }, [role, router])

  useEffect(() => {
    const load = async () => {
      const data = await getResources({ sortBy: 'newest' })
      setResources(data)
    }
    load()
  }, [])

  const totalDownloads = useMemo(
    () => resources.reduce((sum, res) => sum + (res.downloads || 0), 0),
    [resources]
  )

  const handleSubmit = async (values: ResourceFormValues, file: File | null) => {
    if (!file && !values.externalLink && !editing?.fileUrl) {
      alert('Please upload a file or provide an external link')
      return
    }
    setLoading(true)
    try {
      let fileUrl = editing?.fileUrl || ''
      let fileType = editing?.fileType || 'other'

      if (file) {
        const id = editing?.id || crypto.randomUUID()
        fileUrl = await uploadResourceFile(file, `resources/${id}/${file.name}`)
        const extension = file.name.split('.').pop()?.toLowerCase()
        fileType =
          extension === 'pdf'
            ? 'pdf'
            : extension === 'ppt' || extension === 'pptx'
              ? 'pptx'
              : extension === 'doc' || extension === 'docx'
                ? 'docx'
                : 'other'

        if (!editing) {
          // ensure id consistency for new uploads
          await createResource({
            id,
            title: values.title,
            description: values.description,
            category: values.category,
            audience: values.audience,
            difficulty: values.difficulty,
            durationMinutes: values.durationMinutes,
            language: values.language,
            tags: values.tags || [],
            fileUrl,
            fileType,
            uploadedBy: user?.uid || 'admin',
            uploadedByName: user?.email || undefined,
            organizationId: undefined,
            downloads: 0,
            views: 0,
            isFeatured: values.isFeatured || false,
          })
        }
      }

      if (editing) {
        await updateResource(editing.id, {
          title: values.title,
          description: values.description,
          category: values.category,
          audience: values.audience,
          difficulty: values.difficulty,
          durationMinutes: values.durationMinutes,
          language: values.language,
          tags: values.tags || [],
          fileUrl: values.externalLink || fileUrl,
          fileType: values.externalLink ? 'link' : fileType,
          isFeatured: values.isFeatured,
        })
      } else if (!file) {
        await createResource({
          title: values.title,
          description: values.description,
          category: values.category,
          audience: values.audience,
          difficulty: values.difficulty,
          durationMinutes: values.durationMinutes,
          language: values.language,
          tags: values.tags || [],
          fileUrl: values.externalLink || '',
          fileType: values.externalLink ? 'link' : 'other',
          uploadedBy: user?.uid || 'admin',
          uploadedByName: user?.email || undefined,
          isFeatured: values.isFeatured || false,
          views: 0,
          downloads: 0,
        })
      } else if (editing) {
        // handled above
      }

      const refreshed = await getResources({ sortBy: 'newest' })
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
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-aviation-sky font-semibold">Admin</p>
        <h1 className="text-3xl font-bold text-aviation-navy">Manage Resources</h1>
        <p className="text-gray-600">Create, edit, and feature resources across the network.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editing ? 'Edit resource' : 'Add new resource'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceForm defaultValues={editing || undefined} onSubmit={handleSubmit} submitting={loading} isAdmin />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 overflow-x-auto">
          <div className="text-sm text-gray-600">Total downloads: {totalDownloads}</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Title</th>
                <th>Category</th>
                <th>Audience</th>
                <th>Downloads</th>
                <th>Featured</th>
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
                  <td>{res.isFeatured ? 'Yes' : 'No'}</td>
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
