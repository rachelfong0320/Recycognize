import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"
import WasteChart from "../components/WasteChart"
import RecyclingTips from "../components/RecyclingTips"
import { recyclingAPI } from "../api"
import { useState, useEffect } from "react"

const { width, height } = Dimensions.get("window")

const HomeScreen = ({ navigation }) => {
  const [wasteData, setWasteData] = useState({
    plastic: 0,
    glass: 0,
    aluminum: 0,
    carton: 0,
  })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("User") // Add state for user name
  const [userPoints, setUserPoints] = useState(0) // Add state for user points

  useEffect(() => {
    fetchWasteData()
    fetchUserData() // Add function to fetch user data
  }, [])

  const fetchUserData = async () => {
    try {
      const userResponse = await recyclingAPI.getUser("demo-user")
      if (userResponse.success && userResponse.user) {
        setUserName(userResponse.user.name)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchWasteData = async () => {
    try {
      const scanRecords = await recyclingAPI.getScanRecords("demo-user")
      if (scanRecords.success) {
        const materialCounts = {
          plastic: 0,
          glass: 0,
          aluminum: 0,
          carton: 0,
        }

        // Handle different response formats - records could be in scanRecords.records or directly in scanRecords
        const records = scanRecords.records || scanRecords.data || []
        
        // Ensure records is an array before calling forEach
        if (Array.isArray(records) && records.length > 0) {
          records.forEach(record => {
            if (record && record.material && materialCounts.hasOwnProperty(record.material)) {
              materialCounts[record.material]++
            }
          })
        } else {
          console.log("No scan records found or records is not an array:", records)
        }

        setWasteData(materialCounts)
      }
    } catch (error) {
      console.error("Error fetching waste data:", error)
      // Use default mock data if API fails
      setWasteData({
        plastic: 8,
        glass: 5,
        aluminum: 4,
        carton: 3,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Header Section with Gradient */}
        <LinearGradient
          colors={["#AFB498", "#ECEEE8"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >

          {/* Header Content */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.nameText}>{userName}.</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <Ionicons name="person" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Waste Chart Section */}
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Total Waste Breakdown</Text>
            <WasteChart wasteData={wasteData} loading={loading} />
            
            {/* Divider Line */}
            <View style={styles.dividerLine} />
            <View style={styles.wasteTypes}>
              {/* Calculate total and percentages */}
              {(() => {
                const total = wasteData.plastic + wasteData.glass + wasteData.aluminum + wasteData.carton;
                const materials = [
                  { 
                    name: 'Plastic', 
                    count: wasteData.plastic, 
                    color: '#6b6d6c',
                    percentage: total > 0 ? Math.round((wasteData.plastic / total) * 100) : 0
                  },
                  { 
                    name: 'Glass', 
                    count: wasteData.glass, 
                    color: '#d9dfe9',
                    percentage: total > 0 ? Math.round((wasteData.glass / total) * 100) : 0
                  },
                  { 
                    name: 'Aluminum', 
                    count: wasteData.aluminum, 
                    color: '#f1f784',
                    percentage: total > 0 ? Math.round((wasteData.aluminum / total) * 100) : 0
                  },
                  { 
                    name: 'Tetra Pak', 
                    count: wasteData.carton, 
                    color: '#afb498',
                    percentage: total > 0 ? Math.round((wasteData.carton / total) * 100) : 0
                  }
                ];

                return materials.map((material, index) => (
                  <View key={index} style={styles.materialItem}>
                    <View style={styles.materialHeader}>
                      <View style={styles.materialInfo}>
                        <Text style={styles.materialName}>{material.name}</Text>
                      </View>
                      <Text style={styles.materialPercentage}>{material.percentage}%</Text>
                    </View>
                    <View style={styles.materialBarContainer}>
                      <View 
                        style={[
                          styles.materialBar, 
                          { 
                            backgroundColor: material.color,
                            width: `${material.percentage}%`
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ));
              })()}
            </View>
          </View>

          {/* Recycling Tips Section */}
          <View style={styles.tipsSection}>
            <RecyclingTips />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginBottom: -35,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    height: 280,
    paddingHorizontal: 10,
  },
  topBar: {
    paddingTop: 10,
  },
  timeText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  statusIcons: {
    flexDirection: "row",
    gap: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeSection: {
    marginTop: 60,
  },
  welcomeText: {
    color: Colors.white,
    fontSize: 25,
    fontWeight: "400",
    lineHeight: 24,
  },
  nameText: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
    marginTop: 5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -100,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
  },
  chartSection: {
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  dividerLine: {
    width: "90%",
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 15,
  },
  wasteTypes: {
    marginTop: 15,
    alignItems: "stretch",
    paddingHorizontal: 20,
    width: "100%",
  },
  materialItem: {
    marginBottom: 8,
  },
  materialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  materialInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  materialName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  materialPercentage: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  materialBarContainer: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  materialBar: {
    height: "100%",
    borderRadius: 4,
    minWidth: 2,
  },
  tipsSection: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    marginTop: 10,
  },
})

export default HomeScreen
