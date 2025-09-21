// Analytics data utilities and mock data generation
export interface AnalyticsData {
  brandTrends: {
    month: string
    detections: number
    confidence: number
  }[]
  materialBreakdown: {
    material: string
    count: number
    percentage: number
    color: string
  }[]
  timeSeriesData: {
    date: string
    detections: number
    accuracy: number
  }[]
  confidenceDistribution: {
    range: string
    count: number
  }[]
}

// Color palette based on the provided hex codes
export const brandColors = {
  primary: "#9392956B",
  secondary: "#6D6CECEEE8",
  accent: "#DEE6DA",
  tertiary: "#D9DFE9F1",
  quaternary: "#F784AFB498",
}

export function generateAnalyticsData(brand: string): AnalyticsData {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const brandTrends = months.map((month) => ({
    month,
    detections: Math.floor(Math.random() * 1000) + 500,
    confidence: Math.random() * 0.3 + 0.7, // 70-100%
  }))

  const materials = ["Plastic Bottle", "Aluminum Can", "Glass Bottle", "Cardboard", "Plastic Wrapper"]

  const rawMaterials = materials.map((material, index) => {
    const count = Math.floor(Math.random() * 200) + 50
    return {
      material,
      count,
      color: Object.values(brandColors)[index % Object.values(brandColors).length],
    }
  })

  const total = rawMaterials.reduce((sum, m) => sum + m.count, 0)

  const materialBreakdown = rawMaterials.map((m) => ({
    ...m,
    percentage: total > 0 ? (m.count / total) * 100 : 0,
  }))

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split("T")[0],
      detections: Math.floor(Math.random() * 100) + 20,
      accuracy: Math.random() * 0.2 + 0.8,
    }
  })

  const confidenceRanges = ["<60%", "60-69%","70-79%","80-89%","90-100%"]
  const confidenceDistribution = confidenceRanges.map((range) => ({
    range,
    count: Math.floor(Math.random() * 300) + 50,
  }))

  return {
    brandTrends,
    materialBreakdown,
    timeSeriesData: last30Days,
    confidenceDistribution,
  }
}
