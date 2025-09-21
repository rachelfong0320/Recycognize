// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { useAuth } from "@/components/auth-provider"
// import type { BrandData } from "@/lib/auth"

// export function useRealtimeRecords(limit = 10, refreshInterval = 60000) {
//   // 1 minute
//   const { user } = useAuth()
//   const [records, setRecords] = useState<BrandData[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchRecords = useCallback(async () => {
//     if (!user) return

//     try {
//       const token = localStorage.getItem("auth-token")
//       if (!token) throw new Error("No auth token")

//       const response = await fetch(`/api/realtime/records?brand=${user.brand}&limit=${limit}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to fetch records")
//       }

//       const data = await response.json()
//       setRecords(data.records)
//       setError(null)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unknown error")
//     } finally {
//       setIsLoading(false)
//     }
//   }, [user, limit])

//   useEffect(() => {
//     fetchRecords()

//     // Set up polling for real-time updates
//     const interval = setInterval(fetchRecords, refreshInterval)

//     return () => clearInterval(interval)
//   }, [fetchRecords, refreshInterval])

//   return { records, isLoading, error, refetch: fetchRecords }
// }
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import type { BrandData } from "@/lib/auth"

export function useRealtimeRecords(limit?: number) {
  const { user } = useAuth()
  const [records, setRecords] = useState<BrandData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = useCallback(async () => {
    if (!user) return

    try {
      const token = localStorage.getItem("fmcg-app-token")
      if (!token) throw new Error("No auth token")

      const url = `/api/realtime/records?brand=${user.brand}${limit ? `&limit=${limit}` : ''}`
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch records")
      }

      const data = await response.json()
      
      // Check if the response contains an error from the API
      if (data.error) {
        throw new Error(data.error)
      }
      
      setRecords(data.records || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error fetching records:", err)
    } finally {
      setIsLoading(false)
    }
  }, [user, limit])

  useEffect(() => {
    fetchRecords()

    // Set up polling for real-time updates
    const interval = setInterval(fetchRecords, 30000)

    return () => clearInterval(interval)
  }, [fetchRecords])

  return { records, isLoading, error, refetch: fetchRecords }
}