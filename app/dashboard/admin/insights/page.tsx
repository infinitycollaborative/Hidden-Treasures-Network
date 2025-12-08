'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Users,
  RefreshCw,
} from 'lucide-react'
import {
  generateNetworkInsights,
  identifyAtRiskUsers,
  identifyGrowthOpportunities,
  type NetworkData,
  type NetworkInsights,
} from '@/lib/aiInsights'
import { isAIAvailable } from '@/lib/ai'

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<NetworkInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [aiEnabled, setAiEnabled] = useState(false)

  useEffect(() => {
    setAiEnabled(isAIAvailable())
    loadInsights()
  }, [])

  const loadInsights = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, fetch actual network data
      const networkData: NetworkData = {
        users: {
          total: 1247,
          byRole: {
            student: 623,
            mentor: 184,
            organization: 28,
            sponsor: 12,
            admin: 8,
          },
          activeThisMonth: 892,
          newThisMonth: 43,
        },
        mentorships: {
          total: 438,
          activeThisMonth: 356,
          averageDuration: 4.2,
        },
        programs: {
          total: 67,
          active: 54,
          studentsEnrolled: 523,
        },
        events: {
          total: 124,
          upcoming: 8,
          avgAttendance: 32,
        },
        sponsors: {
          total: 12,
          active: 10,
          totalFunding: 285000,
        },
        engagement: {
          avgSessionsPerUser: 3.7,
          messagesSent: 2341,
          resourcesShared: 156,
        },
      }

      const generatedInsights = await generateNetworkInsights(networkData)
      setInsights(generatedInsights)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto text-aviation-navy mb-4" />
            <p className="text-gray-600">Analyzing network data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-aviation-navy flex items-center gap-3">
              <BarChart3 className="h-8 w-8" />
              Network Insights
            </h1>
            <p className="text-gray-600 mt-2">
              AI-powered analytics and recommendations
              {!aiEnabled && (
                <Badge variant="secondary" className="ml-2">
                  Rule-based mode
                </Badge>
              )}
            </p>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>

          <Button onClick={loadInsights} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Insights
          </Button>
        </div>

        {!insights ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No insights available. Try refreshing.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Executive Summary */}
            <Card className="mb-8 bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-100">{insights.summary}</p>
              </CardContent>
            </Card>

            {/* Key Trends */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-aviation-navy mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Key Trends
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {insights.keyTrends.map((trend, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(trend.direction)}
                          <CardTitle className="text-lg">{trend.title}</CardTitle>
                        </div>
                        <Badge className={getImpactColor(trend.impact)} variant="outline">
                          {trend.impact} impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{trend.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            {insights.opportunities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-aviation-navy mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  Growth Opportunities
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {insights.opportunities.map((opportunity, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                          <Badge
                            className={getPriorityColor(opportunity.priority)}
                            variant="outline"
                          >
                            {opportunity.priority} priority
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{opportunity.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {insights.risks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-aviation-navy mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Risk Factors
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {insights.risks.map((risk, index) => (
                    <Card
                      key={index}
                      className={`border-l-4 ${
                        risk.severity === 'high'
                          ? 'border-l-red-600'
                          : risk.severity === 'medium'
                          ? 'border-l-orange-600'
                          : 'border-l-yellow-600'
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{risk.title}</CardTitle>
                          <Badge
                            className={getSeverityColor(risk.severity)}
                            variant="outline"
                          >
                            {risk.severity} severity
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-2">{risk.description}</p>
                        {risk.actionable && (
                          <Badge variant="secondary" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Recommended Actions
                </CardTitle>
                <CardDescription>
                  Strategic recommendations to improve network performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-aviation-navy text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-800">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
