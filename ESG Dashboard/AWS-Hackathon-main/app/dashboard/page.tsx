"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { RealtimeDashboard } from "@/components/realtime-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { mockBrandData, hasAccessToBrand } from "@/lib/auth"
import { BarChart3, TrendingUp, Package, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  // Filter data based on user's brand access
  const accessibleData = mockBrandData.filter((item) => hasAccessToBrand(user, item.name))

  const stats = {
    totalItems: accessibleData.length,
    avgConfidence:
      accessibleData.reduce((acc, item) => acc + item.confidence.brand_recognition, 0) / accessibleData.length,
    materialsCount: new Set(accessibleData.map((item) => item.material)).size,
    recentDetections: accessibleData.filter(
      (item) => new Date(item.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    ).length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.brand}</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your brand analytics today.</p>
        </div>

        <RealtimeDashboard />

        {/* Historical Stats Cards */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Historical Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Historical Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats.avgConfidence * 100).toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Materials</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.materialsCount}</div>
                <p className="text-xs text-muted-foreground">Different material types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Detections</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentDetections}</div>
                <p className="text-xs text-muted-foreground">In the last 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Brand Detections</CardTitle>
            <CardDescription>
              Latest items detected for {user.brand === "all" ? "all brands" : user.brand}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accessibleData.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={`${item.name} ${item.material}`}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.material}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {(item.confidence.brand_recognition * 100).toFixed(1)}% confidence
                    </p>
                    <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
