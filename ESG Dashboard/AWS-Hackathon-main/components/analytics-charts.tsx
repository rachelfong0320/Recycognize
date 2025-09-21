"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,Tooltip
} from "recharts"
import type { AnalyticsData } from "@/lib/analytics-data"

interface AnalyticsChartsProps {
  data: AnalyticsData
  brand: string
}

export function AnalyticsCharts({ data, brand }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Brand Trends Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Brand Detection Trends</CardTitle>
          <CardDescription>Monthly detection volume and confidence for {brand}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              detections: {
                label: "Detections",
                color: "#F1F784",
              },
              confidence: {
                label: "Confidence",
                color: "#6B6D6C",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.brandTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="detections" fill="var(--color-detections)" name="Detections" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="confidence"
                  stroke="var(--color-confidence)"
                  name="Avg Confidence"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Material Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Material Breakdown</CardTitle>
          <CardDescription>Distribution by packaging material</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "#DEE6DA",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* <Pie
                  data={data.materialBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                   label={({ material, percentage }) => `${material}: ${percentage.toFixed(1)}%`}
                >
                  {data.materialBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie> */}
               <Pie
  data={data.materialBreakdown}
  cx="40%"
  cy="40%"
  outerRadius={90}
  dataKey="count"
  label={({ material, percentage, x, y }) => (
    <text
      x={x}
      y={y}
      fill="#000" // black text
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {`${material}: ${percentage.toFixed(1)}%`}
    </text>
  )}
>
  {data.materialBreakdown.map((entry, index) => {
    const colors = ["#ECEEE8", "#DEE6DA", "#D9DFE9", "#F1F784", "#AFB498"]
    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
  })}
</Pie>       <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Time Series */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Detection Activity</CardTitle>
          <CardDescription>Last 30 days performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              detections: {
                label: "Daily Detections",
                color: "#AFB498",
              },
              accuracy: {
                label: "Accuracy",
                color: "#F784AFB498",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeSeriesData}
              margin={{ top: 20, right: 20, left: -20, bottom: 20 }} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="detections"
                  stroke="var(--color-detections)"
                  name="Detections"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--color-accuracy)"
                  name="Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Confidence Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Confidence Score Distribution</CardTitle>
          <CardDescription>Quality of brand recognition across detections</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Count",
                color: "#9392956B",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.confidenceDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#81cfd1ff" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
