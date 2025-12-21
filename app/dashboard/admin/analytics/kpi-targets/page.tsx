'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Target,
  Plus,
  ArrowLeft,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell,
  BellOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  getAllKPITargets,
  createKPITarget,
  updateKPITarget,
  deleteKPITarget,
  formatNumber,
  formatPercentage,
  getStatusColor,
} from '@/lib/db-analytics'
import type { KPITarget, KPIStatus, KPIPeriod } from '@/types'
import { Timestamp } from 'firebase/firestore'

// Status badge component
function StatusBadge({ status }: { status: KPIStatus }) {
  const config = {
    achieved: { icon: CheckCircle, label: 'Achieved' },
    'on-track': { icon: TrendingUp, label: 'On Track' },
    'at-risk': { icon: Clock, label: 'At Risk' },
    critical: { icon: AlertTriangle, label: 'Critical' },
  }

  const { icon: Icon, label } = config[status]

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

// KPI Card component
function KPICard({
  kpi,
  onEdit,
  onDelete,
}: {
  kpi: KPITarget
  onEdit: (kpi: KPITarget) => void
  onDelete: (kpi: KPITarget) => void
}) {
  const progressPercent = Math.min(100, kpi.percentageComplete)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-aviation-navy">{kpi.name}</h3>
              <StatusBadge status={kpi.status} />
            </div>
            <p className="text-sm text-gray-500">{kpi.description}</p>
          </div>
          <div className="flex items-center gap-1">
            {kpi.alerts.enabled ? (
              <Bell className="h-4 w-4 text-aviation-gold" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-300" />
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">
              {formatNumber(kpi.currentValue)} / {formatNumber(kpi.targetValue)} {kpi.unit}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                kpi.status === 'achieved'
                  ? 'bg-green-500'
                  : kpi.status === 'on-track'
                  ? 'bg-blue-500'
                  : kpi.status === 'at-risk'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">
            {formatPercentage(progressPercent)} complete
          </p>
        </div>

        {/* Thresholds */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="text-center p-2 bg-red-50 rounded">
            <p className="text-red-600 font-medium">Critical</p>
            <p className="text-gray-600">&lt; {formatNumber(kpi.thresholds.red)}</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <p className="text-yellow-600 font-medium">At Risk</p>
            <p className="text-gray-600">&lt; {formatNumber(kpi.thresholds.yellow)}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <p className="text-green-600 font-medium">On Track</p>
            <p className="text-gray-600">&gt;= {formatNumber(kpi.thresholds.green)}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
          <span>
            Period: {kpi.period.charAt(0).toUpperCase() + kpi.period.slice(1)}
          </span>
          <span>
            Last checked:{' '}
            {kpi.lastChecked
              ? kpi.lastChecked.toDate().toLocaleDateString()
              : 'Never'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(kpi)}
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(kpi)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Create/Edit KPI Modal (simplified inline form)
function KPIForm({
  kpi,
  onSave,
  onCancel,
}: {
  kpi?: KPITarget | null
  onSave: (data: Partial<KPITarget>) => Promise<void>
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: kpi?.name || '',
    description: kpi?.description || '',
    metricPath: kpi?.metricPath || 'studentMetrics.totalStudents',
    targetValue: kpi?.targetValue || 1000,
    currentValue: kpi?.currentValue || 0,
    unit: kpi?.unit || 'students',
    period: kpi?.period || ('monthly' as KPIPeriod),
    thresholdRed: kpi?.thresholds.red || 0,
    thresholdYellow: kpi?.thresholds.yellow || 500,
    thresholdGreen: kpi?.thresholds.green || 800,
    alertsEnabled: kpi?.alerts.enabled || false,
    owner: kpi?.owner || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        name: formData.name,
        description: formData.description,
        metricPath: formData.metricPath,
        targetValue: formData.targetValue,
        currentValue: formData.currentValue,
        unit: formData.unit,
        period: formData.period as KPIPeriod,
        thresholds: {
          red: formData.thresholdRed,
          yellow: formData.thresholdYellow,
          green: formData.thresholdGreen,
        },
        alerts: {
          enabled: formData.alertsEnabled,
          notifyUsers: [],
          emailOnYellow: formData.alertsEnabled,
          emailOnRed: formData.alertsEnabled,
        },
        owner: formData.owner,
        stakeholders: [],
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{kpi ? 'Edit KPI Target' : 'Create KPI Target'}</CardTitle>
        <CardDescription>
          {kpi
            ? 'Update the KPI target configuration'
            : 'Define a new key performance indicator to track'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
                placeholder="e.g., Monthly Active Students"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
                placeholder="e.g., students, dollars, percent"
                required
              />
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
              placeholder="Describe what this KPI measures"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metric Path
              </label>
              <select
                value={formData.metricPath}
                onChange={(e) =>
                  setFormData({ ...formData, metricPath: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="studentMetrics.totalStudents">Total Students</option>
                <option value="studentMetrics.activeStudents">Active Students</option>
                <option value="studentMetrics.newStudents">New Students</option>
                <option value="studentMetrics.totalXP">Total XP</option>
                <option value="programMetrics.totalPrograms">Total Programs</option>
                <option value="programMetrics.completionRate">Completion Rate</option>
                <option value="financialMetrics.totalDonations">Total Donations</option>
                <option value="flightPlan2030.livesReached">Lives Reached</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Value
              </label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) =>
                  setFormData({ ...formData, targetValue: Number(e.target.value) })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value as KPIPeriod })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aviation-navy"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thresholds
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <label className="block text-xs text-red-600 mb-1">
                  Critical (below)
                </label>
                <input
                  type="number"
                  value={formData.thresholdRed}
                  onChange={(e) =>
                    setFormData({ ...formData, thresholdRed: Number(e.target.value) })
                  }
                  className="w-full rounded-md border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <label className="block text-xs text-yellow-600 mb-1">
                  At Risk (below)
                </label>
                <input
                  type="number"
                  value={formData.thresholdYellow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholdYellow: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-yellow-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <label className="block text-xs text-green-600 mb-1">
                  On Track (above)
                </label>
                <input
                  type="number"
                  value={formData.thresholdGreen}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholdGreen: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="alertsEnabled"
              checked={formData.alertsEnabled}
              onChange={(e) =>
                setFormData({ ...formData, alertsEnabled: e.target.checked })
              }
              className="rounded border-gray-300 text-aviation-navy focus:ring-aviation-navy"
            />
            <label htmlFor="alertsEnabled" className="text-sm text-gray-700">
              Enable email alerts when thresholds are crossed
            </label>
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
              {saving ? 'Saving...' : kpi ? 'Update KPI' : 'Create KPI'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function KPITargetsPage() {
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KPITarget[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingKpi, setEditingKpi] = useState<KPITarget | null>(null)
  const [filterStatus, setFilterStatus] = useState<KPIStatus | 'all'>('all')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllKPITargets()
      setKpis(data)
    } catch (err) {
      console.error('Error fetching KPIs:', err)
      setError('Failed to load KPI targets. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSave = async (data: Partial<KPITarget>) => {
    try {
      if (editingKpi) {
        await updateKPITarget(editingKpi.targetId, data)
      } else {
        await createKPITarget(data as any)
      }
      setShowForm(false)
      setEditingKpi(null)
      await fetchData()
    } catch (err) {
      console.error('Error saving KPI:', err)
      setError('Failed to save KPI target.')
    }
  }

  const handleDelete = async (kpi: KPITarget) => {
    if (!confirm(`Are you sure you want to delete "${kpi.name}"?`)) {
      return
    }
    try {
      await deleteKPITarget(kpi.targetId)
      await fetchData()
    } catch (err) {
      console.error('Error deleting KPI:', err)
      setError('Failed to delete KPI target.')
    }
  }

  const handleEdit = (kpi: KPITarget) => {
    setEditingKpi(kpi)
    setShowForm(true)
  }

  const filteredKpis =
    filterStatus === 'all'
      ? kpis
      : kpis.filter((kpi) => kpi.status === filterStatus)

  // Summary stats
  const summary = {
    total: kpis.length,
    achieved: kpis.filter((k) => k.status === 'achieved').length,
    onTrack: kpis.filter((k) => k.status === 'on-track').length,
    atRisk: kpis.filter((k) => k.status === 'at-risk').length,
    critical: kpis.filter((k) => k.status === 'critical').length,
  }

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
              <Target className="h-6 w-6 text-aviation-gold" />
              KPI Targets
            </h1>
            <p className="text-gray-500">
              Monitor and manage key performance indicators
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
              setEditingKpi(null)
              setShowForm(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add KPI
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card
          className={`cursor-pointer transition-all ${
            filterStatus === 'all' ? 'ring-2 ring-aviation-navy' : ''
          }`}
          onClick={() => setFilterStatus('all')}
        >
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-aviation-navy">{summary.total}</p>
            <p className="text-sm text-gray-500">Total KPIs</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${
            filterStatus === 'achieved' ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => setFilterStatus('achieved')}
        >
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-green-600">{summary.achieved}</p>
            <p className="text-sm text-gray-500">Achieved</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${
            filterStatus === 'on-track' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setFilterStatus('on-track')}
        >
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-blue-600">{summary.onTrack}</p>
            <p className="text-sm text-gray-500">On Track</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${
            filterStatus === 'at-risk' ? 'ring-2 ring-yellow-500' : ''
          }`}
          onClick={() => setFilterStatus('at-risk')}
        >
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-yellow-600">{summary.atRisk}</p>
            <p className="text-sm text-gray-500">At Risk</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all ${
            filterStatus === 'critical' ? 'ring-2 ring-red-500' : ''
          }`}
          onClick={() => setFilterStatus('critical')}
        >
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-red-600">{summary.critical}</p>
            <p className="text-sm text-gray-500">Critical</p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <KPIForm
          kpi={editingKpi}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingKpi(null)
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
                  <div className="h-3 bg-gray-200 rounded-full" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* KPI Grid */}
      {!loading && (
        <>
          {filteredKpis.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {filterStatus === 'all'
                      ? 'No KPI targets have been created yet'
                      : `No KPIs with status "${filterStatus}"`}
                  </p>
                  {filterStatus === 'all' && (
                    <Button
                      onClick={() => {
                        setEditingKpi(null)
                        setShowForm(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First KPI
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredKpis.map((kpi) => (
                <KPICard
                  key={kpi.targetId}
                  kpi={kpi}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
