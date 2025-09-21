"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface AIInsight {
  type: "trend" | "alert" | "recommendation"
  title: string
  description: string
  confidence: number
  action?: string
}

interface AIAssistantPanelProps {
  brand: string
}

export function AIAssistantPanel({ brand }: AIAssistantPanelProps) {
  // Mock AI insights based on brand data
  const insights: AIInsight[] = [
    {
      type: "trend",
      title: "Plastic Bottle Usage Increasing",
      description:
        "Detected 23% increase in plastic bottle packaging over the last month. This trend aligns with seasonal demand patterns.",
      confidence: 0.89,
      action: "Review sustainability metrics",
    },
    {
      type: "alert",
      title: "Low Confidence Detections",
      description:
        "Recent batch shows 15% of detections below 80% confidence threshold. Consider image quality improvements.",
      confidence: 0.92,
      action: "Investigate image sources",
    },
    {
      type: "recommendation",
      title: "ESG Reporting Opportunity",
      description:
        "Current material mix shows 67% recyclable packaging. Highlight this in upcoming sustainability report.",
      confidence: 0.85,
      action: "Generate ESG report",
    },
  ]

  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "recommendation":
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getInsightColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "trend":
        return "bg-blue-50 border-blue-200"
      case "alert":
        return "bg-orange-50 border-orange-200"
      case "recommendation":
        return "bg-green-50 border-green-200"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg">AI Assistant</CardTitle>
        </div>
        <CardDescription>Intelligent insights for {brand} brand analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Summary */}
        <div className="p-4 bg-white/60 rounded-lg border border-purple-100">
          <h4 className="font-medium text-purple-900 mb-2">Summary</h4>
          <p className="text-sm text-purple-700">
            Analyzing {brand} performance over the last 30 days. Detection accuracy is above average with strong
            material identification. Consider focusing on sustainability metrics for Q2 reporting.
          </p>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <h5 className="font-medium text-sm">{insight.title}</h5>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {(insight.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
              {insight.action && (
                <Button size="sm" variant="outline" className="text-xs h-7 bg-transparent">
                  {insight.action}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <Brain className="mr-2 h-4 w-4" />
          Generate Full Analysis
        </Button>
      </CardContent>
    </Card>
  )
}
