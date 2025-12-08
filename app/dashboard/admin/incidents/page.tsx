'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  User,
  MapPin,
  Calendar,
  FileText,
} from 'lucide-react'
import {
  getIncidents,
  getOpenIncidents,
  getHighPriorityIncidents,
  updateIncidentStatus,
  assignIncident,
  updateIncidentPriority,
} from '@/lib/db-incidents'
import { Incident, IncidentPriority, IncidentStatus } from '@/types'

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    loadIncidents()
  }, [])

  useEffect(() => {
    filterIncidents()
  }, [incidents, statusFilter, priorityFilter])

  async function loadIncidents() {
    try {
      setLoading(true)
      const data = await getIncidents()
      setIncidents(data)
    } catch (error) {
      console.error('Error loading incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterIncidents() {
    let filtered = [...incidents]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(i => i.priority === priorityFilter)
    }

    setFilteredIncidents(filtered)
  }

  function getPriorityColor(priority: IncidentPriority) {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  function getStatusColor(status: IncidentStatus) {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const openCount = incidents.filter(i => i.status === 'open').length
  const underReviewCount = incidents.filter(i => i.status === 'under_review').length
  const criticalCount = incidents.filter(i => i.priority === 'critical').length
  const withMinorsCount = incidents.filter(i => i.minorsInvolved).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto mb-4"></div>
          <p className="text-gray-600">Loading incidents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-aviation-navy">
          Incident Reports
        </h1>
        <p className="mt-2 text-gray-600">
          Safety and compliance incident management
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open</p>
                <p className="text-2xl font-bold text-yellow-600">{openCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{underReviewCount}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Priority</p>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Involving Minors</p>
                <p className="text-2xl font-bold text-purple-600">{withMinorsCount}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No incidents found</p>
            </CardContent>
          </Card>
        ) : (
          filteredIncidents.map(incident => (
            <Card
              key={incident.id}
              className={`hover:shadow-md transition-shadow ${
                incident.minorsInvolved ? 'border-2 border-purple-300' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Incident Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          incident.priority === 'critical'
                            ? 'text-red-600'
                            : incident.priority === 'high'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}
                      />
                      <h3 className="text-lg font-semibold text-aviation-navy">
                        {incident.title}
                      </h3>
                      {incident.minorsInvolved && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          Minors Involved
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 space-y-2 mb-3">
                      <p className="line-clamp-2">{incident.description}</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="capitalize">{incident.type.replace('_', ' ')}</span>
                        </div>
                        
                        {incident.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{incident.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Reported by {incident.reportedByName}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date((incident.createdAt as any)?.toDate()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                          incident.priority
                        )}`}
                      >
                        {incident.priority.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          incident.status
                        )}`}
                      >
                        {incident.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {incident.assignedToName && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          Assigned to {incident.assignedToName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      View Details
                    </Button>
                    {(incident.status === 'open' || incident.status === 'under_review') && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={async () => {
                          await updateIncidentStatus(incident.id, 'resolved')
                          loadIncidents()
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle
                  className={`h-6 w-6 ${
                    selectedIncident.priority === 'critical'
                      ? 'text-red-600'
                      : selectedIncident.priority === 'high'
                      ? 'text-orange-600'
                      : 'text-yellow-600'
                  }`}
                />
                {selectedIncident.title}
              </CardTitle>
              <CardDescription>Incident #{selectedIncident.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Type</p>
                  <p className="capitalize">{selectedIncident.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Priority</p>
                  <p className="capitalize">{selectedIncident.priority}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="capitalize">{selectedIncident.status.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Minors Involved</p>
                  <p>{selectedIncident.minorsInvolved ? 'Yes' : 'No'}</p>
                </div>
                {selectedIncident.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p>{selectedIncident.location}</p>
                  </div>
                )}
                {selectedIncident.organizationName && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Organization</p>
                    <p>{selectedIncident.organizationName}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                <p className="text-gray-600">{selectedIncident.description}</p>
              </div>

              {/* Reporter */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Reported By</p>
                <p className="text-gray-600">
                  {selectedIncident.reportedByName} ({selectedIncident.reportedByRole})
                </p>
                <p className="text-sm text-gray-500">
                  {new Date((selectedIncident.createdAt as any)?.toDate()).toLocaleString()}
                </p>
              </div>

              {/* Notes */}
              {selectedIncident.notes && selectedIncident.notes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                  <div className="space-y-2">
                    {selectedIncident.notes.map(note => (
                      <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">{note.note}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {note.userName} -{' '}
                          {new Date((note.timestamp as any)?.toDate()).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
