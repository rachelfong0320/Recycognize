// // DynamoDB integration utilities for real-time brand analytics
// import type { BrandData } from "./auth"

// export interface DynamoDBConfig {
//   region: string
//   tableName: string
//   accessKeyId?: string
//   secretAccessKey?: string
// }

// export class FMCGDynamoDBClient {
//   private config: DynamoDBConfig

//   constructor(config: DynamoDBConfig) {
//     this.config = config
//   }

//   // ✅ Correct class method syntax
//   async scanRecords(brand?: string): Promise<BrandData[]> {
//     const query = brand ? `?brand=${encodeURIComponent(brand)}` : ""

//     const response = await fetch(
//       `https://1qpqvcemec.execute-api.us-east-1.amazonaws.com/dev/scan-records${query}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     )

//     if (!response.ok) {
//       throw new Error(`Failed to fetch scan records: ${response.statusText}`)
//     }

//     const data = (await response.json()) as BrandData[]
//     return data
//   }

//   async getRealtimeStats(brand?: string): Promise<{
//     totalDetections: number
//     avgConfidence: number
//     recentActivity: number
//     topMaterials: Array<{ material: string; count: number }>
//   }> {
//     // still mocked until you add a Lambda endpoint
//     await new Promise((resolve) => setTimeout(resolve, 300))

//     return {
//       totalDetections: Math.floor(Math.random() * 10000) + 5000,
//       avgConfidence: Math.random() * 0.2 + 0.8,
//       recentActivity: Math.floor(Math.random() * 50) + 10,
//       topMaterials: [
//         { material: "Plastic Bottle", count: Math.floor(Math.random() * 1000) + 500 },
//         { material: "Aluminum Can", count: Math.floor(Math.random() * 800) + 400 },
//         { material: "Glass Bottle", count: Math.floor(Math.random() * 300) + 100 },
//         { material: "Cardboard", count: Math.floor(Math.random() * 200) + 50 },
//       ],
//     }
//   }

//   async queryByTimeRange(
//     brand: string,
//     startTime: string,
//     endTime: string
//   ): Promise<BrandData[]> {
//     const records = await this.scanRecords(brand)

//     return records.filter((record) => {
//       const recordTime = new Date(record.timestamp)
//       return recordTime >= new Date(startTime) && recordTime <= new Date(endTime)
//     })
//   }
// }
// DynamoDB integration utilities for real-time brand analytics
import type { BrandData } from "./auth"

// Mock DynamoDB client for demonstration
// In production, use AWS SDK v3: import { DynamoDBClient, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb"

export interface DynamoDBConfig {
  region: string
  tableName: string
  accessKeyId?: string
  secretAccessKey?: string
}

export class FMCGDynamoDBClient {
  private config: DynamoDBConfig

  constructor(config: DynamoDBConfig) {
    this.config = config
  }

  // Mock implementation - replace with real DynamoDB operations
  async scanRecords(brand?: string, limit?: number): Promise<BrandData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data that would come from DynamoDB
    const mockRecords: BrandData[] = [
      {
        id: "ddb-1",
        name: "Coca-Cola",
        material: "Plastic Bottle",
        imageUrl: "/coca-cola-bottle.jpg",
        confidence: { brand_recognition: 0.94, material_detection: 0.89 },
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      },
      {
        id: "ddb-2",
        name: "Coca-Cola",
        material: "Aluminum Can",
        imageUrl: "/coca-cola-can.jpg",
        confidence: { brand_recognition: 0.91, material_detection: 0.93 },
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
      },
      {
        id: "ddb-3",
        name: "Pepsi",
        material: "Plastic Bottle",
        imageUrl: "/pepsi-bottle.jpg",
        confidence: { brand_recognition: 0.87, material_detection: 0.85 },
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
    ]

    let filteredRecords = mockRecords
    if (brand && brand !== "all") {
      filteredRecords = mockRecords.filter((record) => record.name === brand)
    }

    if (limit) {
      filteredRecords = filteredRecords.slice(0, limit)
    }

    return filteredRecords
  }

  async getRealtimeStats(brand?: string): Promise<{
    totalDetections: number
    avgConfidence: number
    recentActivity: number
    topMaterials: Array<{ material: string; count: number }>
  }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock real-time statistics
    return {
      totalDetections: Math.floor(Math.random() * 10000) + 5000,
      avgConfidence: Math.random() * 0.2 + 0.8, // 80-100%
      recentActivity: Math.floor(Math.random() * 50) + 10, // Last hour
      topMaterials: [
        { material: "Plastic Bottle", count: Math.floor(Math.random() * 1000) + 500 },
        { material: "Aluminum Can", count: Math.floor(Math.random() * 800) + 400 },
        { material: "Glass Bottle", count: Math.floor(Math.random() * 300) + 100 },
        { material: "Cardboard", count: Math.floor(Math.random() * 200) + 50 },
      ],
    }
  }

  async queryByTimeRange(brand: string, startTime: string, endTime: string): Promise<BrandData[]> {
    // Mock time-based query
    await new Promise((resolve) => setTimeout(resolve, 400))

    const records = await this.scanRecords(brand)
    return records.filter((record) => {
      const recordTime = new Date(record.timestamp)
      return recordTime >= new Date(startTime) && recordTime <= new Date(endTime)
    })
  }
}

// Initialize DynamoDB client
export const dynamoClient = new FMCGDynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  tableName: process.env.DYNAMODB_TABLE_NAME || "FMCGBrandData",
})

// Real DynamoDB implementation would look like this:
/*
import { DynamoDBClient, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb"
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function scanRecords(brand?: string): Promise<BrandData[]> {
  const params = {
    TableName: 'FMCGBrandData',
    FilterExpression: brand ? 'brand = :brand' : undefined,
    ExpressionAttributeValues: brand ? marshall({ ':brand': brand }) : undefined
  }

  const command = new ScanCommand(params)
  const result = await client.send(command)
  
  return result.Items?.map(item => unmarshall(item) as BrandData) || []
}
*/
