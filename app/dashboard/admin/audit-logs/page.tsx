'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Send, Users, Globe, Building2 } from 'lucide-react'
import { getAuditLogs } from '@/lib/db-auditLogs'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    try {
      setLoading(true)
      const data = await getAuditLogs({ limit: 100 })
      setLogs(data)
    } catch (error) {
      console.error('Error loading audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-aviation-navy">
          Audit Logs
        </h1>
        <p className="mt-2 text-gray-600">
          Security and activity tracking across the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Administrative actions and security events</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No audit logs yet</p>
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{log.action.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">
                      {log.userName} ({log.userRole})
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date((log.timestamp as any)?.toDate()).toLocaleString()}
                    </p>
                  </div>
                  {log.targetName && (
                    <span className="text-sm text-gray-600">{log.targetName}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
