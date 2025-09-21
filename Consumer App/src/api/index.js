// API functions for the recycling app
// Mix of real AWS endpoints and mock data

const API_BASE_URL = "https://1qpqvcemec.execute-api.us-east-1.amazonaws.com/dev"

export const recyclingAPI = {
  getUser: async (userId = "demo-user") => {
    try {
      const pointsRes = await fetch(`${API_BASE_URL}/user-points/${userId}`);

      const raw = await pointsRes.json();

      // If Lambda wrapped the payload in `body`, parse it again
      let pointsData = raw;
      if (raw.body) {
        try {
          pointsData = JSON.parse(raw.body);
          console.log("✅ Parsed body JSON:", pointsData);
        } catch (err) {
          console.error("❌ Failed to parse body JSON:", err);
        }
      }

      return {
        success: true,
        user: {
          id: userId,
          name: pointsData.name,
          email: "demo@example.com", // static for now
          points: pointsData.totalPoints,
          totalRecycled: pointsData.history?.length || 0,
          history: pointsData.history || [],
        },
      };
    } catch (error) {
      console.error("🔥 Failed to get user:", error);
      return { success: false, error: error.message };
    }
  },

  // Get scan records - REAL API  
  getScanRecords: async (userId = "demo-user") => {
    try {
      const response = await fetch(`${API_BASE_URL}/scan-records?userId=${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      // Handle different response formats
      let records = []
      if (data.body) {
        // Parse the JSON string in body field
        try {
          records = JSON.parse(data.body)
        } catch (parseError) {
          console.error("Failed to parse body JSON:", parseError)
          records = []
        }
      } else if (data.records) {
        records = data.records
      } else if (Array.isArray(data)) {
        records = data
      }

      // IMPORTANT: Filter records to ensure only the requested userId
      const filteredRecords = records.filter(record => record.userId === userId)

      return {
        success: true,
        records: filteredRecords,
      }
    } catch (error) {
      console.error("Failed to get scan records:", error)
      // Fallback to mock data
      return {
        success: true,
        records: [
          { userId: "demo-user", material: "plastic", timestamp: new Date().toISOString() },
          { userId: "demo-user", material: "glass", timestamp: new Date().toISOString() },
        ],
      }
    }
  },

  // Check-in endpoint - REAL API
  checkIn: async (sessionId, rvmId) => {
    try {
      // AWS Lambda expects the body to be wrapped in a body property as JSON string
      const requestData = {
        sessionId: sessionId,
        rvmId: rvmId,
        timestamp: new Date().toISOString()
      }
      
      const requestBody = {
        body: JSON.stringify(requestData)
      }
      
      const response = await fetch(`${API_BASE_URL}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log("📦 API Response:", data)

      // Check if the response indicates an error
      if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
        let errorMessage = "Check-in failed"
        
        // Try to extract error message from various response formats
        if (data.body) {
          try {
            const bodyData = JSON.parse(data.body)
            errorMessage = bodyData.error || errorMessage
          } catch (e) {
            errorMessage = data.body
          }
        } else if (data.error) {
          errorMessage = data.error
        } else if (data.message) {
          errorMessage = data.message
        }
        
        throw new Error(errorMessage)
      }

      // Parse the successful response body
      let responseData = data
      if (data.body && data.statusCode === 200) {
        try {
          responseData = JSON.parse(data.body)
        } catch (e) {
          console.warn("Could not parse response body, using raw data")
        }
      }

      console.log("✅ Check-in successful:", responseData)
      return {
        success: true,
        data: responseData
      }
    } catch (error) {
      console.error("❌ Check-in failed:", error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  },

  // User management - MOCK
  addUser: async (userData) => {
    try {
      // Mock response
      return {
        success: true,
        user: {
          id: Date.now(),
          ...userData,
          points: 0,
          totalRecycled: 0,
        },
      }
    } catch (error) {
      throw new Error("Failed to add user")
    }
  },

  // Recycling summary - REAL API
  getRecyclingSummary: async (sessionId) => {
    try {
      console.log("📊 Getting summary for sessionId:", sessionId)
      
      // Try the direct approach that matches your Lambda function
      const requestData = { sessionId: sessionId }
      
      const response = await fetch(`${API_BASE_URL}/summary-recycle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()
      console.log("📦 Summary API Response:", data)

      // Check if the response indicates an error
      if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
        let errorMessage = "Get summary failed"
        
        if (data.body) {
          try {
            const bodyData = JSON.parse(data.body)
            errorMessage = bodyData.error || errorMessage
          } catch (e) {
            errorMessage = data.body
          }
        } else if (data.error) {
          errorMessage = data.error
        } else if (data.message) {
          errorMessage = data.message
        }
        
        throw new Error(errorMessage)
      }

      // Parse the successful response body
      let responseData = data
      if (data.body && data.statusCode === 200) {
        try {
          responseData = JSON.parse(data.body)
        } catch (e) {
          console.warn("Could not parse summary response body, using raw data")
        }
      }

      // Transform the response to match expected format
      const materialCounts = responseData.materialCounts || {}
      const wasteBreakdown = {
        plastic: materialCounts.plastic || 0,
        glass: materialCounts.glass || 0,
        aluminum: materialCounts.aluminum || 0,
        carton: materialCounts.carton || 0,
      }

      console.log("✅ Summary retrieved successfully:", responseData)
      return {
        success: true,
        data: {
          itemsRecycled: responseData.totalNumItems || 0,
          pointsEarned: responseData.totalPoints || 0,
          wasteBreakdown: wasteBreakdown,
          sessionId: responseData.sessionId
        }
      }
    } catch (error) {
      console.error("❌ Get summary failed:", error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  },

  // Recycling operations - MOCK (keeping as fallback)
  processRecycling: async (qrData, userId = "demo-user") => {
    try {
      // Mock processing - you could integrate this with your scan-records endpoint
      const itemsRecycled = Math.floor(Math.random() * 5) + 1
      const pointsEarned = Math.floor(Math.random() * 50) + 10

      // Get current scan records to generate realistic waste breakdown
      const scanRecords = await recyclingAPI.getScanRecords(userId)
      const materials = scanRecords.records?.map(record => record.material) || []

      // Generate waste breakdown based on scan history
      const wasteBreakdown = {
        plastic: materials.filter(m => m === 'plastic').length || Math.floor(Math.random() * 3),
        glass: materials.filter(m => m === 'glass').length || Math.floor(Math.random() * 2),
        aluminum: materials.filter(m => m === 'aluminum').length || Math.floor(Math.random() * 2),
        carton: materials.filter(m => m === 'carton').length || Math.floor(Math.random() * 2),
      }

      return {
        success: true,
        data: {
          itemsRecycled,
          pointsEarned,
          wasteBreakdown,
        },
      }
    } catch (error) {
      throw new Error("Failed to process recycling")
    }
  },

  // Rewards management - MOCK
  getRewards: async () => {
    try {
      return {
        success: true,
        rewards: [
          {
            id: 1,
            title: "Starbucks Voucher",
            points: 1000,
            category: "food",
            image: "starbucks-voucher.jpg",
          },
          {
            id: 2,
            title: "Shopping Discount",
            points: 500,
            category: "fashion",
            image: "shopping-discount-voucher.jpg",
          },
        ],
      }
    } catch (error) {
      throw new Error("Failed to get rewards")
    }
  },

  redeemReward: async (rewardId, userId = "demo-user") => {
    try {
      return {
        success: true,
        data: {
          rewardId,
          userId,
          redemptionCode: "RWD" + Date.now(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      }
    } catch (error) {
      throw new Error("Failed to redeem reward")
    }
  },

  // Location services - RVM Machines
  getRecyclingStations: async (latitude, longitude, radius = 10) => {
    try {
      return {
        success: true,
        stations: [
          {
            id: 1,
            name: "RVM Machine - Petaling Jaya",
            latitude: 3.0470,
            longitude: 101.6958,
            address: "Seksyen 17, Petaling Jaya, Selangor",
            distance: 0.3,
            type: "RVM",
            status: "active",
            operatingHours: "24/7",
          },
          {
            id: 2,
            name: "RVM Machine - PJ Commercial",
            latitude: 3.0475,
            longitude: 101.6965,
            address: "Jalan 17/45, Seksyen 17, Petaling Jaya",
            distance: 0.5,
            type: "RVM",
            status: "active",
            operatingHours: "24/7",
          },
          {
            id: 3,
            name: "RVM Machine - APU Campus",
            latitude: 2.9962,
            longitude: 101.7137,
            address: "Asia Pacific University (APU), Bukit Jalil",
            distance: 0.8,
            type: "RVM",
            status: "active",
            operatingHours: "6AM - 10PM",
          },
          {
            id: 4,
            name: "RVM Machine - TPM Bukit Jalil",
            latitude: 2.9970,
            longitude: 101.7150,
            address: "Jalan Teknologi 5, TPM, Bukit Jalil",
            distance: 1.0,
            type: "RVM",
            status: "active",
            operatingHours: "24/7",
          },
          {
            id: 5,
            name: "RVM Machine - KLCC",
            latitude: 3.1570,
            longitude: 101.7110,
            address: "Suria KLCC, Kuala Lumpur City Centre",
            distance: 1.2,
            type: "RVM",
            status: "active",
            operatingHours: "10AM - 10PM",
          },
          {
            id: 6,
            name: "RVM Machine - Mid Valley",
            latitude: 3.1186,
            longitude: 101.6770,
            address: "Mid Valley Megamall, Kuala Lumpur",
            distance: 1.5,
            type: "RVM",
            status: "maintenance",
            operatingHours: "10AM - 10PM",
          },
        ],
      }
    } catch (error) {
      throw new Error("Failed to get recycling stations")
    }
  },

  // End session endpoint - REAL API
  endSession: async (sessionId, status = "completed") => {
    try {
      // AWS Lambda expects the body to be wrapped in a body property as JSON string
      const requestData = {
        sessionId: sessionId,
        status: status
      }
      
      const requestBody = {
        body: JSON.stringify(requestData)
      }
      
      const response = await fetch(`${API_BASE_URL}/endsessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log("📦 End Session API Response:", data)

      // Check if the response indicates an error
      if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
        let errorMessage = "End session failed"
        
        // Try to extract error message from various response formats
        if (data.body) {
          try {
            const bodyData = JSON.parse(data.body)
            errorMessage = bodyData.error || errorMessage
          } catch (e) {
            errorMessage = data.body
          }
        } else if (data.error) {
          errorMessage = data.error
        } else if (data.message) {
          errorMessage = data.message
        }
        
        throw new Error(errorMessage)
      }

      // Parse the successful response body
      let responseData = data
      if (data.body && data.statusCode === 200) {
        try {
          responseData = JSON.parse(data.body)
        } catch (e) {
          console.warn("Could not parse end session response body, using raw data")
        }
      }

      console.log("✅ Session ended successfully:", responseData)
      return {
        success: true,
        data: responseData
      }
    } catch (error) {
      console.error("❌ End session failed:", error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  },

  // Points endpoint - REAL API
  updatePoints: async (sessionId) => {
    try {
      // This endpoint expects sessionId directly in the event object, not wrapped in body
      const requestData = {
        sessionId: sessionId
      }
      
      const response = await fetch(`${API_BASE_URL}/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()
      console.log("📦 Points API Response:", data)

      // Check if the response indicates an error
      if (!response.ok || (data.statusCode && data.statusCode >= 400)) {
        let errorMessage = "Update points failed"
        
        // Try to extract error message from various response formats
        if (data.body) {
          try {
            const bodyData = JSON.parse(data.body)
            errorMessage = bodyData.error || errorMessage
          } catch (e) {
            errorMessage = data.body
          }
        } else if (data.error) {
          errorMessage = data.error
        } else if (data.message) {
          errorMessage = data.message
        }
        
        throw new Error(errorMessage)
      }

      // Parse the successful response body
      let responseData = data
      if (data.body && data.statusCode === 200) {
        try {
          responseData = JSON.parse(data.body)
        } catch (e) {
          console.warn("Could not parse points response body, using raw data")
        }
      }

      console.log("✅ Points updated successfully:", responseData)
      return {
        success: true,
        data: responseData
      }
    } catch (error) {
      console.error("❌ Points update failed:", error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  },
}
