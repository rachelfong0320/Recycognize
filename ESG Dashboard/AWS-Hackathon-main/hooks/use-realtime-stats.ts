"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"

interface RealtimeStats {
  totalDetections: number
  avgConfidence: number
  recentActivity: number
  topMaterials: Array<{ material: string; count: number }>
  timestamp: string
  brand: string
}

export function useRealtimeStats(refreshInterval = 30000) {
  const { user } = useAuth()
  const [stats, setStats] = useState<RealtimeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!user) return
    console.log("Fetching stats for brand:", user.brand)
    try {
      const token = localStorage.getItem("fmcg-app-token")
      if (!token) throw new Error("No auth token")
console.log("Using token:", token)
      const response = await fetch(`/api/realtime/stats?brand=${user.brand}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await response.json()
      
      // Check if the response contains an error from the API
      if (data.error) {
        throw new Error(data.error)
      }
      
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error fetching stats:", err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchStats()

    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchStats, refreshInterval])

  return { stats, isLoading, error, refetch: fetchStats }
}