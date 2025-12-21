'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileBarChart,
  Plus,
  ArrowLeft,
  RefreshCw,
  Edit,
  Trash2,
  Play,
  Download,
  Clock,
  Share2,
  Lock,
  Globe,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Table,
  Map,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  getUserReports,
  getPublicReports,
  createReport,
  deleteReport,
  formatNumber,
} from '@/lib/db-analytics'
import type {
  CustomReport,
  ReportDataSource,
  ChartType,
  ReportVisibility,
  DateRangeType,
} from '@/types'
import { Timestamp } from 'firebase/firestore'

// Chart type icon component
function ChartTypeIcon({ type }: { type: ChartType }) {
  const icons = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart,
    table: Table,
    heatmap: Map,
    area: LineChart,
  }
  const Icon = icons[type] || BarChart3
  return <Icon className="h-4 w-4" />
}

// Visibility badge component
function VisibilityBadge({ visibility }: { visibility: ReportVisibility }) {
  const config = {
    private: { icon: Lock, label: 'Private', className: 'bg-gray-100 text-gray-600' },
    shared: { icon: Users, label: 'Shared', className: 'bg-blue-100 text-blue-600' },
    public: { icon: Globe, label: 'Public', className: 'bg-green-100 text-green-600' },
  }

  const { icon: Icon, label, className } = config[visibility]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

// Report Card component
function ReportCard({
  report,
  onRun,
  onEdit,
  onDelete,
}: {
  report: CustomReport
  onRun: (report: CustomReport) => void
  onEdit: (report: CustomReport) => void
  onDelete: (report: CustomReport) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-aviation-navy">{report.name}</h3>
              <VisibilityBadge visibility={report.visibility} />
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{report.description}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <ChartTypeIcon type={report.config.chartType} />
          </div>
        </div>

        {/* Config Summary */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500">Data Source</p>
            <p className="font-medium capitalize">{report.config.dataSource}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-gray-500">Date Range</p>
            <p className="font-medium capitalize">
              {report.config.dateRange.type.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            {report.runCount} runs
          </span>
          {report.lastRun && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {report.lastRun.toDate().toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-aviation-navy hover:bg-aviation-navy/90"
            onClick={() => onRun(report)}
          >
            <Play className="mr-1 h-3 w-3" />
            Run
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(report)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(report)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Create Report Form
function ReportForm({
  report,
  onSave,
  onCancel,
}: {
  report?: CustomReport | null
  onSave: (data: Partial<CustomReport>) => Promise<void>
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: report?.name || '',
    description: report?.description || '',
    dataSource: report?.config.dataSource || ('students' as ReportDataSource),
    dateRangeType: report?.config.dateRange.type || ('last30days' as DateRangeType),
    chartType: report?.config.chartType || ('bar' as ChartType),
    visibility: report?.visibility || ('private' as ReportVisibility),
    groupBy: report?.config.groupBy || '',
    sortBy: report?.config.sortBy || 'createdAt',
    sortOrder: report?.config.sortOrder || ('desc' as 'asc' | 'desc'),
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        name: formData.name,
        description: formData.description,
        config: {
          dataSource: formData.dataSource,
          dateRange: {
            type: formData.dateRangeType,
          },
          filters: {},
          metrics: ['count', 'total'],
          groupBy: formData.groupBy as any,
          sortBy: formData.sortBy,
          sortOrder: formData.sortOrder,
          chartType: formData.chartType,
          exportFormat: 'csv',
        },
        visibility: formData.visibility,
        sharedWith: [],
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{report ? 'Edit Report' : 'Create Custom Report'}</CardTitle>
        <CardDescription>
          {report
            ? 'Update the report configuration'
            : 'Build a custom report to analyze platform data'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
                placeholder="e.g., Monthly Student Progress"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visibility: e.target.value as ReportVisibility,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="private">Private - Only me</option>
                <option value="shared">Shared - Specific users</option>
                <option value="public">Public - All admins</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              rows={2}
              placeholder="Describe what this report shows"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Source
              </label>
              <select
                value={formData.dataSource}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dataSource: e.target.value as ReportDataSource,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="students">Students</option>
                <option value="programs">Programs</option>
                <option value="donations">Donations</option>
                <option value="sessions">Sessions</option>
                <option value="schools">Schools</option>
                <option value="organizations">Organizations</option>
                <option value="events">Events</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={formData.dateRangeType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateRangeType: e.target.value as DateRangeType,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="thisYear">This Year</option>
                <option value="allTime">All Time</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                value={formData.chartType}
                onChange={(e) =>
                  setFormData({ ...formData, chartType: e.target.value as ChartType })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="table">Data Table</option>
                <option value="area">Area Chart</option>
                <option value="heatmap">Heat Map</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group By
              </label>
              <select
                value={formData.groupBy}
                onChange={(e) =>
                  setFormData({ ...formData, groupBy: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="">None</option>
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="school">School</option>
                <option value="program">Program</option>
                <option value="organization">Organization</option>
                <option value="state">State</option>
                <option value="grade">Grade Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={formData.sortBy}
                onChange={(e) =>
                  setFormData({ ...formData, sortBy: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="createdAt">Date Created</option>
                <option value="name">Name</option>
                <option value="count">Count</option>
                <option value="total">Total</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <select
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: e.target.value as 'asc' | 'desc',
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-aviation-navy hover:bg-aviation-navy/90"
              disabled={saving}
            >
              {saving ? 'Saving...' : report ? 'Update Report' : 'Create Report'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Report Results Modal/Panel
function ReportResults({
  report,
  onClose,
  onExport,
}: {
  report: CustomReport
  onClose: () => void
  onExport: (format: string) => void
}) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading report data
    const timer = setTimeout(() => {
      // Generate sample data based on data source
      const sampleData = [
        { name: 'January', value: 120, growth: 5.2 },
        { name: 'February', value: 145, growth: 8.3 },
        { name: 'March', value: 162, growth: 11.7 },
        { name: 'April', value: 178, growth: 9.9 },
        { name: 'May', value: 195, growth: 9.6 },
        { name: 'June', value: 210, growth: 7.7 },
      ]
      setData(sampleData)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [report])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{report.name}</CardTitle>
            <CardDescription>
              {report.config.dateRange.type} | {report.config.dataSource}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
              <Download className="mr-1 h-3 w-3" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
              <Download className="mr-1 h-3 w-3" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aviation-navy mx-auto mb-4" />
            <p className="text-gray-500">Generating report...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Simple bar chart visualization */}
            <div className="space-y-3">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-gray-600">{item.name}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-aviation-navy to-aviation-gold rounded flex items-center justify-end pr-2"
                      style={{ width: `${(item.value / 210) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {item.value}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.growth > 0 ? '+' : ''}
                    {item.growth}%
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-aviation-navy">
                  {data.reduce((sum, d) => sum + d.value, 0)}
                </p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-aviation-navy">
                  {Math.round(
                    data.reduce((sum, d) => sum + d.value, 0) / data.length
                  )}
                </p>
                <p className="text-sm text-gray-500">Average</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  +
                  {(
                    data.reduce((sum, d) => sum + d.growth, 0) / data.length
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-sm text-gray-500">Avg Growth</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<CustomReport[]>([])
  const [publicReports, setPublicReports] = useState<CustomReport[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingReport, setEditingReport] = useState<CustomReport | null>(null)
  const [runningReport, setRunningReport] = useState<CustomReport | null>(null)
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my')

  // Mock user ID for demo
  const currentUserId = 'demo-user'

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [userReports, pubReports] = await Promise.all([
        getUserReports(currentUserId),
        getPublicReports(),
      ])
      setReports(userReports)
      setPublicReports(pubReports)
    } catch (err) {
      console.error('Error fetching reports:', err)
      setError('Failed to load reports. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (data: Partial<CustomReport>) => {
    try {
      await createReport({
        ...data,
        createdBy: currentUserId,
        createdByName: 'Demo User',
      } as any)
      setShowForm(false)
      setEditingReport(null)
      await fetchData()
    } catch (err) {
      console.error('Error saving report:', err)
      setError('Failed to save report.')
    }
  }

  const handleDelete = async (report: CustomReport) => {
    if (!confirm(`Are you sure you want to delete "${report.name}"?`)) {
      return
    }
    try {
      await deleteReport(report.reportId)
      await fetchData()
    } catch (err) {
      console.error('Error deleting report:', err)
      setError('Failed to delete report.')
    }
  }

  const handleRun = (report: CustomReport) => {
    setRunningReport(report)
  }

  const handleExport = (format: string) => {
    // In production, this would trigger actual export
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  const displayedReports = activeTab === 'my' ? reports : publicReports

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/analytics">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-aviation-navy flex items-center gap-2">
              <FileBarChart className="h-6 w-6 text-aviation-gold" />
              Custom Reports
            </h1>
            <p className="text-gray-500">
              Build and run custom analytics reports
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            className="bg-aviation-navy hover:bg-aviation-navy/90"
            onClick={() => {
              setEditingReport(null)
              setShowForm(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'my'
              ? 'border-aviation-navy text-aviation-navy'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('my')}
        >
          My Reports ({reports.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'public'
              ? 'border-aviation-navy text-aviation-navy'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('public')}
        >
          Public Reports ({publicReports.length})
        </button>
      </div>

      {/* Running Report Results */}
      {runningReport && (
        <ReportResults
          report={runningReport}
          onClose={() => setRunningReport(null)}
          onExport={handleExport}
        />
      )}

      {/* Form */}
      {showForm && (
        <ReportForm
          report={editingReport}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingReport(null)
          }}
        />
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reports Grid */}
      {!loading && (
        <>
          {displayedReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileBarChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {activeTab === 'my'
                      ? 'You haven\'t created any reports yet'
                      : 'No public reports available'}
                  </p>
                  {activeTab === 'my' && (
                    <Button
                      onClick={() => {
                        setEditingReport(null)
                        setShowForm(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Report
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedReports.map((report) => (
                <ReportCard
                  key={report.reportId}
                  report={report}
                  onRun={handleRun}
                  onEdit={(r) => {
                    setEditingReport(r)
                    setShowForm(true)
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <CardDescription>
            Start with a pre-configured report template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => {
                setEditingReport(null)
                setShowForm(true)
                // Could pre-fill form with template data
              }}
              className="p-4 border rounded-lg text-left hover:border-aviation-gold hover:bg-aviation-gold/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Student Progress</h3>
              </div>
              <p className="text-sm text-gray-500">
                Track student XP, badges, and completion rates
              </p>
            </button>
            <button
              onClick={() => {
                setEditingReport(null)
                setShowForm(true)
              }}
              className="p-4 border rounded-lg text-left hover:border-aviation-gold hover:bg-aviation-gold/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-green-100 p-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium">Donation Analysis</h3>
              </div>
              <p className="text-sm text-gray-500">
                Analyze donation trends and sponsor contributions
              </p>
            </button>
            <button
              onClick={() => {
                setEditingReport(null)
                setShowForm(true)
              }}
              className="p-4 border rounded-lg text-left hover:border-aviation-gold hover:bg-aviation-gold/5 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-purple-100 p-2">
                  <LineChart className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium">Program Engagement</h3>
              </div>
              <p className="text-sm text-gray-500">
                Measure program attendance and engagement
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
