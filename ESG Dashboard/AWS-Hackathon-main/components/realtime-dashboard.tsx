"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRealtimeStats } from "@/hooks/use-realtime-stats"
import { useRealtimeRecords } from "@/hooks/use-realtime-records"
import { Activity, RefreshCw, TrendingUp, Package, BarChart3, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function RealtimeDashboard() {
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useRealtimeStats()
  const { records, isLoading: recordsLoading, refetch: refetchRecords } = useRealtimeRecords(5)

  const handleRefresh = () => {
    refetchStats()
    refetchRecords()
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Live Data</span>
          </div>
          {stats && (
            <span className="text-sm text-gray-500">Updated {formatDistanceToNow(new Date(stats.timestamp))} ago</span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={statsLoading || recordsLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${statsLoading || recordsLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.totalDetections.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Real-time count
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : `${(stats?.avgConfidence * 100).toFixed(1)}%`}
            </div>
            <p className="text-xs text-muted-foreground">Detection accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsLoading ? "..." : stats?.recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Material</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.topMaterials[0]?.material.split(" ")[0]}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? "..." : `${stats?.topMaterials[0]?.count} detections`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-green-600" />
            Live Detection Feed
          </CardTitle>
          <CardDescription>Most recent brand detections from DynamoDB</CardDescription>
        </CardHeader>
        <CardContent>
          {recordsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500"
                >
                  <img
                    src={record.imageUrl || "/placeholder.svg"}
                    alt={`${record.name} ${record.material}`}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{record.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {record.material}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {(record.confidence.brand_recognition * 100).toFixed(1)}% confidence
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                    <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(record.timestamp))} ago</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Top Materials (Real-time)</CardTitle>
            <CardDescription>Current material distribution from live data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topMaterials.map((material, index) => (
                <div key={material.material} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                            ? "bg-green-500"
                            : index === 2
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                      }`}
                    ></div>
                    <span className="font-medium">{material.material}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{material.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                              ? "bg-green-500"
                              : index === 2
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                        style={{
                          width: `${(material.count / stats.topMaterials[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
