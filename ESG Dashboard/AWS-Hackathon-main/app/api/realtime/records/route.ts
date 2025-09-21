import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, hasAccessToBrand } from "@/lib/auth"
import { dynamoClient } from "@/lib/dynamodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get("brand")
    const limit = searchParams.get("limit")
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const user = verifyToken(token)

    if (!user || (brand && !hasAccessToBrand(user, brand))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Scan records from DynamoDB
    const records = await dynamoClient.scanRecords(
      brand || (user.brand === "all" ? undefined : user.brand),
      limit ? Number.parseInt(limit) : undefined,
    )

    return NextResponse.json({
      records,
      count: records.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Records fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}
