import { View, StyleSheet, Dimensions, Text } from "react-native"
import Svg, { Circle, G, Defs, LinearGradient, Stop } from "react-native-svg"
import { Colors } from "../constants/colors"

const { width } = Dimensions.get("window")
const chartSize = width * 0.6
const radius = chartSize / 2 - 25
const strokeWidth = 45

const WasteChart = ({ wasteData = {}, loading = false }) => {


  const materialCounts = { ...wasteData }
  const totalItems = Object.values(materialCounts).reduce((sum, count) => sum + count, 0)

  // Calculate percentages based on actual counts
  const data = [
    { 
      name: "Plastic", 
      count: materialCounts.plastic,
      percentage: totalItems > 0 ? (materialCounts.plastic / totalItems) * 100 : 25, 
      color: "#6b6d6c", 
      gradient: ["#6b6d6c", "#5a5c5b"] 
    },
    { 
      name: "Glass", 
      count: materialCounts.glass,
      percentage: totalItems > 0 ? (materialCounts.glass / totalItems) * 100 : 25, 
      color: "#d9dfe9", 
      gradient: ["#d9dfe9", "#c5cdd8"] 
    },
    { 
      name: "Aluminum", 
      count: materialCounts.aluminum,
      percentage: totalItems > 0 ? (materialCounts.aluminum / totalItems) * 100 : 25, 
      color: "#f1f784", 
      gradient: ["#f1f784", "#eef56f"] 
    },
    { 
      name: "Carton (Tetra Pak)", 
      count: materialCounts.carton,
      percentage: totalItems > 0 ? (materialCounts.carton / totalItems) * 100 : 25, 
      color: "#afb498", 
      gradient: ["#afb498", "#9ca085"] 
    },
  ]

  const circumference = 2 * Math.PI * radius
  let cumulativePercentage = 0

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width={chartSize} height={chartSize} style={styles.chart}>
          <Defs>
            {data.map((item, index) => (
              <LinearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={item.gradient[0]} />
                <Stop offset="100%" stopColor={item.gradient[1]} />
              </LinearGradient>
            ))}
          </Defs>
          
          <G rotation="-90" origin={`${chartSize / 2}, ${chartSize / 2}`}>
            {data
              .filter(item => item.percentage > 0) // Only render segments with actual percentage
              .map((item, index) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
                const strokeDashoffset = (-cumulativePercentage * circumference) / 100
                cumulativePercentage += item.percentage

                // Find the original index for gradient reference
                const originalIndex = data.findIndex(d => d.name === item.name)

                return (
                  <Circle
                    key={originalIndex}
                    cx={chartSize / 2}
                    cy={chartSize / 2}
                    r={radius}
                    stroke={`url(#gradient-${originalIndex})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    strokeLinecap="round"
                  />
                )
              })}
          </G>

          {/* Inner white circle */}
          <Circle 
            cx={chartSize / 2} 
            cy={chartSize / 2} 
            r={radius - strokeWidth / 2 - 5} 
            fill="#FFFFFF" 
          />
        </Svg>
        
        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={styles.centerTitle}>Total</Text>
          <Text style={styles.centerValue}>{loading ? "..." : totalItems}</Text>
          <Text style={styles.centerLabel}>Items</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chart: {
    transform: [{ rotate: "0deg" }],
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 50,
    width: 100,
    height: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textGray,
    marginBottom: 2,
  },
  centerValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 36,
  },
  centerLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textGray,
    marginTop: 2,
  },
})

export default WasteChart
