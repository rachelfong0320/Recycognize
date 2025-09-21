import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, mockBrandData, hasAccessToBrand } from "@/lib/auth"
import { calculateESGMetrics, generateESGReport } from "@/lib/export-utils"

export async function POST(request: NextRequest) {
  try {
    const { brand } = await request.json()
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const user = verifyToken(token)

    if (!user || !hasAccessToBrand(user, brand)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Filter data for the specific brand
    const brandData = mockBrandData.filter((item) => hasAccessToBrand(user, item.name))

    const esgMetrics = calculateESGMetrics(brandData)
    const report = generateESGReport(brand, brandData, esgMetrics)

    return NextResponse.json({
      metrics: esgMetrics,
      report,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("ESG report error:", error)
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 })
  }
}
