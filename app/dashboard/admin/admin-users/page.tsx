'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Shield, Building2, Globe } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-aviation-navy">
          Admin User Management
        </h1>
        <p className="mt-2 text-gray-600">
          Manage administrator roles and permissions
        </p>
      </div>

      {/* Role Hierarchy Info */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-aviation-gold" />
              <h3 className="font-semibold">Super Admin</h3>
            </div>
            <p className="text-sm text-gray-600">
              Full network access and control
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-8 w-8 text-aviation-sky" />
              <h3 className="font-semibold">Country Admin</h3>
            </div>
            <p className="text-sm text-gray-600">
              Manages organizations in their country
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold">Regional Admin</h3>
            </div>
            <p className="text-sm text-gray-600">
              Oversees regional organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold">Org Admin</h3>
            </div>
            <p className="text-sm text-gray-600">
              Manages single organization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin List */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>Platform administrators and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Admin user management interface</p>
            <p className="text-sm text-gray-500">
              This feature allows super admins to assign roles, manage permissions,
              and control access across the network.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Scope Reference</CardTitle>
          <CardDescription>What each role can do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Super Admin</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Full visibility across entire network</li>
                <li>Approve/decline affiliates globally</li>
                <li>Manage all admin roles</li>
                <li>Issue warnings and deactivate users</li>
                <li>Access all audit logs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Country Admin</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>View all organizations in assigned country</li>
                <li>Manage regional admins</li>
                <li>Handle compliance reviews</li>
                <li>Send country-wide communications</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Regional Admin</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>View organizations in assigned regions</li>
                <li>Approve mentors</li>
                <li>Oversee events and training quality</li>
                <li>Send regional communications</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Organization Admin</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Manage their own organization users</li>
                <li>Upload compliance documents</li>
                <li>View organization health dashboard</li>
                <li>Report incidents</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
