"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { generateAnalyticsData } from "@/lib/analytics-data"
import { Download, RefreshCw, Calendar, Filter } from "lucide-react"
import { useState, useMemo } from "react"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const analyticsData = useMemo(() => {
  return user
    ? generateAnalyticsData(user.brand)
    : {
        brandTrends: [],
        materialBreakdown: [],
        timeSeriesData: [],
        confidenceDistribution: [],
      }
}, [user])


  if (!user) return null

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Analytics</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights for {user.brand === "all" ? "all brands" : user.brand}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">94.2%</span>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Above industry average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">Real-time</span>
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Last updated 2 min ago</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">87%</span>
                <Badge className="bg-purple-100 text-purple-800">Good</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">Market penetration</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Charts Section */}
          <div className="xl:col-span-3">
            <AnalyticsCharts data={analyticsData} brand={user.brand} />
          </div>

          {/* AI Assistant Sidebar */}
          <div className="xl:col-span-1">
            <AIAssistantPanel brand={user.brand} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
