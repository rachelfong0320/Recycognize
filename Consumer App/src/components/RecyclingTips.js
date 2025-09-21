import React, { useState } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import Carousel from "react-native-reanimated-carousel"

const { width } = Dimensions.get("window")

const RecyclingTips = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const materials = [
    {
      name: "Plastic",
      icon: "water",
      tip: "Clean containers before recycling",
      gradient: ["#6b6d6c", "#5a5c5b"],
      iconBg: "#ffffff"
    },
    {
      name: "Glass",
      icon: "wine",
      tip: "Remove caps and lids from bottles",
      gradient: ["#d9dfe9", "#c5cdd8"],
      iconBg: "#ffffff"
    },
    {
      name: "Aluminum",
      icon: "disc",
      tip: "Rinse cans and crush to save space",
      gradient: ["#f1f784", "#eef56f"],
      iconBg: "#333333"
    },
    {
      name: "Tetra Pak",
      icon: "cube",
      tip: "Empty completely and flatten",
      gradient: ["#afb498", "#9ca085"],
      iconBg: "#ffffff"
    }
  ]

  const renderItem = ({ item, index }) => (
    <LinearGradient
      colors={item.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.card,
        activeIndex === index && styles.activeCard, // highlight center card
      ]}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          <Ionicons
            name={item.icon}
            size={36}
            color={item.name === "Aluminum" ? "#f1f784" : item.gradient[0]}
          />
        </View>
        <Text style={styles.materialName}>{item.name}</Text>
        <Text style={styles.tipText}>{item.tip}</Text>
      </View>
    </LinearGradient>
  )

  return (
    <View>
      <Carousel
        loop
        width={width * 0.85} 
        height={240}
        autoPlay={true}
        autoPlayInterval={4000}
        scrollAnimationDuration={800}
        data={materials}
        mode="parallax"        // ✅ adds scaling effect
        modeConfig={{
          parallaxScrollingScale: 0.85, // side cards smaller
          parallaxScrollingOffset: 70, // spacing between
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderItem}
        style={{ alignSelf: "center" }} 
      />

      {/* Custom pagination dots */}
      <View style={styles.pagination}>
        {materials.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => setActiveIndex(index)}>
            <View
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  activeCard: {
    transform: [{ scale: 1.05 }], // slightly enlarge center card
    shadowOpacity: 0.3,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  materialName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 18,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#c5cdd8",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#5a5c5b",
    transform: [{ scale: 1.3 }],
  },
})

export default RecyclingTips
