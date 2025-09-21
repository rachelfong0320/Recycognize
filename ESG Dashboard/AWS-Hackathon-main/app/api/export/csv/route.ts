import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, mockBrandData, hasAccessToBrand } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { brand, dateRange } = await request.json()
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const user = verifyToken(token)

    if (!user || !hasAccessToBrand(user, brand)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Filter data based on brand and date range
    let filteredData = mockBrandData.filter((item) => hasAccessToBrand(user, item.name))

    if (dateRange) {
      const { start, end } = dateRange
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.timestamp)
        return itemDate >= new Date(start) && itemDate <= new Date(end)
      })
    }

    // In a real implementation, this would query DynamoDB
    // const params = {
    //   TableName: 'FMCGBrandData',
    //   FilterExpression: 'brand = :brand AND #timestamp BETWEEN :start AND :end',
    //   ExpressionAttributeNames: { '#timestamp': 'timestamp' },
    //   ExpressionAttributeValues: {
    //     ':brand': brand,
    //     ':start': dateRange.start,
    //     ':end': dateRange.end
    //   }
    // }
    // const result = await dynamodb.scan(params).promise()

    return NextResponse.json({
      data: filteredData,
      count: filteredData.length,
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
