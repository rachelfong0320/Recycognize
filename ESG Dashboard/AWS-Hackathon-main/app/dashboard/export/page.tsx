"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ExportDialog } from "@/components/export-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { mockBrandData, hasAccessToBrand } from "@/lib/auth"
import { calculateESGMetrics } from "@/lib/export-utils"
import { Download, FileText, BarChart3, TrendingUp, Leaf, Award } from "lucide-react"
import { useMemo } from "react"

export default function ExportPage() {
  const { user } = useAuth()

  const { accessibleData, esgMetrics } = useMemo(() => {
    if (!user) return { accessibleData: [], esgMetrics: null }

    const data = mockBrandData.filter((item) => hasAccessToBrand(user, item.name))
    const metrics = calculateESGMetrics(data)

    return { accessibleData: data, esgMetrics: metrics }
  }, [user])

  if (!user) return null

  const exportHistory = [
    { id: 1, type: "CSV", date: "2025-01-15", records: 1250, status: "completed" },
    { id: 2, type: "ESG Metrics Export", date: "2025-01-10", records: 980, status: "completed" },
    { id: 3, type: "CSV", date: "2025-01-05", records: 2100, status: "completed" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Export</h1>
            <p className="text-gray-600 mt-1">Export analytics data and generate ESG reports for {user.brand}</p>
          </div>
          <ExportDialog
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                New Export
              </Button>
            }
          />
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
                CSV Data Export
              </CardTitle>
              <CardDescription>Export raw analytics data for external analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Available Records</p>
                  <p className="text-2xl font-bold text-blue-600">{accessibleData.length}</p>
                </div>
                <div>
                  <p className="font-medium">Data Quality</p>
                  <p className="text-2xl font-bold text-green-600">94.2%</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Includes:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Brand detection results</li>
                  <li>• Material classification</li>
                  <li>• Confidence scores</li>
                  <li>• Timestamps and metadata</li>
                </ul>
              </div>
              <ExportDialog
                trigger={
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-green-600" />
                ESG Metrics Export
              </CardTitle>
              <CardDescription>Generate comprehensive sustainability reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Sustainability Score</p>
                  <p className="text-2xl font-bold text-green-600">{esgMetrics?.sustainabilityScore.toFixed(0)}/100</p>
                </div>
                <div>
                  <p className="font-medium">Recyclable %</p>
                  <p className="text-2xl font-bold text-blue-600">{esgMetrics?.recyclablePercentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Report Includes:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Environmental impact metrics</li>
                  <li>• Material sustainability analysis</li>
                  <li>• Compliance status</li>
                  <li>• Improvement recommendations</li>
                </ul>
              </div>
              <ExportDialog
                trigger={
                  <Button variant="outline" className="w-full bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    ESG Metrics Export
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* ESG Metrics Overview */}
        {esgMetrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="mr-2 h-5 w-5 text-green-600" />
                Current ESG Metrics
              </CardTitle>
              <CardDescription>Real-time sustainability performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Recyclable Materials</p>
                  <p className="text-2xl font-bold text-green-600">{esgMetrics.recyclablePercentage.toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-800">Sustainability Score</p>
                  <p className="text-2xl font-bold text-blue-600">{esgMetrics.sustainabilityScore.toFixed(0)}/100</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-800">Carbon Footprint</p>
                  <p className="text-2xl font-bold text-orange-600">{esgMetrics.carbonFootprint.toFixed(1)}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-800">Material Efficiency</p>
                  <p className="text-2xl font-bold text-purple-600">{esgMetrics.materialEfficiency.toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-800">Waste Reduction</p>
                  <p className="text-2xl font-bold text-gray-600">{esgMetrics.wasteReduction.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>Recent data exports and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportHistory.map((export_item) => (
                <div key={export_item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {export_item.type === "CSV" ? (
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <p className="font-medium">{export_item.type}</p>
                      <p className="text-sm text-gray-600">
                        {export_item.records} records • {export_item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {export_item.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
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
