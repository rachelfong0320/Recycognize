import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, hasAccessToBrand } from "@/lib/auth"
import { dynamoClient } from "@/lib/dynamodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get("brand")
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const user = verifyToken(token)

    if (!user || (brand && !hasAccessToBrand(user, brand))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
console.log("User verified for brand hello:", brand)
console.log("User details:", user.brand)
    // Get real-time statistics from DynamoDB
    const stats = await dynamoClient.getRealtimeStats(brand || user.brand)

    return NextResponse.json({
      ...stats,
      timestamp: new Date().toISOString(),
      brand: brand || user.brand,
    })
  } catch (error) {
    console.error("Real-time stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
