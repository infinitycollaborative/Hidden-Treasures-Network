'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  ExternalLink,
} from 'lucide-react'
import {
  getPendingComplianceSubmissions,
  getExpiringComplianceSubmissions,
  approveComplianceSubmission,
  rejectComplianceSubmission,
} from '@/lib/db-compliance'
import { ComplianceSubmission } from '@/types'

export default function CompliancePage() {
  const [pendingSubmissions, setPendingSubmissions] = useState<ComplianceSubmission[]>([])
  const [expiringSubmissions, setExpiringSubmissions] = useState<ComplianceSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ComplianceSubmission | null>(null)
  const [reviewMode, setReviewMode] = useState<'approve' | 'reject' | null>(null)
  const [reviewComments, setReviewComments] = useState('')
  const [expirationDate, setExpirationDate] = useState('')

  useEffect(() => {
    loadComplianceData()
  }, [])

  async function loadComplianceData() {
    try {
      setLoading(true)
      const [pending, expiring] = await Promise.all([
        getPendingComplianceSubmissions(),
        getExpiringComplianceSubmissions(30),
      ])
      setPendingSubmissions(pending)
      setExpiringSubmissions(expiring)
    } catch (error) {
      console.error('Error loading compliance data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove() {
    if (!selectedSubmission) return

    try {
      // TODO: Replace with actual admin context from useAuth or similar
      // const { user, profile } = useAuth()
      // const adminId = user?.uid || ''
      // const adminName = profile?.displayName || 'Admin'
      await approveComplianceSubmission(
        selectedSubmission.id,
        'admin-user-id', // TODO: Get from auth context
        'Admin User',    // TODO: Get from auth context
        reviewComments,
        expirationDate ? new Date(expirationDate) : undefined
      )
      
      setSelectedSubmission(null)
      setReviewMode(null)
      setReviewComments('')
      setExpirationDate('')
      loadComplianceData()
    } catch (error) {
      console.error('Error approving submission:', error)
    }
  }

  async function handleReject() {
    if (!selectedSubmission) return

    try {
      // TODO: Replace with actual admin context from useAuth or similar
      await rejectComplianceSubmission(
        selectedSubmission.id,
        'admin-user-id', // TODO: Get from auth context
        'Admin User',    // TODO: Get from auth context
        reviewComments
      )
      
      setSelectedSubmission(null)
      setReviewMode(null)
      setReviewComments('')
      loadComplianceData()
    } catch (error) {
      console.error('Error rejecting submission:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aviation-sky mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compliance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-aviation-navy">
          Compliance Management
        </h1>
        <p className="mt-2 text-gray-600">
          Review and manage compliance document submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingSubmissions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{expiringSubmissions.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Action Needed</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingSubmissions.length + expiringSubmissions.length}
                </p>
              </div>
              <FileCheck className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            Document submissions awaiting admin approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending submissions
            </p>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map(submission => (
                <div
                  key={submission.id}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-5 w-5 text-aviation-sky" />
                      <h3 className="font-semibold">{submission.requirementName}</h3>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Organization:</span> Org ID: {submission.orgId}
                      </p>
                      <p>
                        <span className="font-medium">Submitted by:</span> {submission.submittedByName}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{' '}
                        {new Date((submission.submittedAt as any)?.toDate()).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">File:</span> {submission.fileName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(submission.fileUrl, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setReviewMode('approve')
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setReviewMode('reject')
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents Expiring Soon</CardTitle>
          <CardDescription>
            Approved documents expiring in the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expiringSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No documents expiring soon
            </p>
          ) : (
            <div className="space-y-3">
              {expiringSubmissions.map(submission => (
                <div
                  key={submission.id}
                  className="flex items-start justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold">{submission.requirementName}</h3>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Organization:</span> Org ID: {submission.orgId}
                      </p>
                      <p>
                        <span className="font-medium">Expires:</span>{' '}
                        <span className="text-orange-600 font-semibold">
                          {submission.expirationDate
                            ? new Date((submission.expirationDate as any)?.toDate()).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Org
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedSubmission && reviewMode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>
                {reviewMode === 'approve' ? 'Approve' : 'Reject'} Submission
              </CardTitle>
              <CardDescription>{selectedSubmission.requirementName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviewMode === 'approve' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                    value={expirationDate}
                    onChange={e => setExpirationDate(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments {reviewMode === 'reject' && <span className="text-red-600">*</span>}
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-sky focus:border-transparent"
                  rows={4}
                  value={reviewComments}
                  onChange={e => setReviewComments(e.target.value)}
                  placeholder={
                    reviewMode === 'approve'
                      ? 'Add any notes about this approval...'
                      : 'Please provide a reason for rejection...'
                  }
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(null)
                    setReviewMode(null)
                    setReviewComments('')
                    setExpirationDate('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className={
                    reviewMode === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }
                  onClick={reviewMode === 'approve' ? handleApprove : handleReject}
                  disabled={reviewMode === 'reject' && !reviewComments.trim()}
                >
                  {reviewMode === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
