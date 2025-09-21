"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"
import { recyclingAPI } from "../api"

const { width } = Dimensions.get("window")

const RewardsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("rewards")
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserPoints()
  }, [])

  const fetchUserPoints = async () => {
    try {
      setLoading(true)
      const userResponse = await recyclingAPI.getUser("demo-user")
      if (userResponse.success && userResponse.user) {
        setUserPoints(userResponse.user.points || 0)
      }
    } catch (error) {
      console.error("Error fetching user points:", error)
      // Keep default value of 0 if API fails
    } finally {
      setLoading(false)
    }
  }

  const rewardCategories = [
    { id: "cash", name: "Cash", icon: "cash-outline" },
    { id: "food", name: "Food", icon: "restaurant-outline" },
    { id: "fashion", name: "Fashion", icon: "shirt-outline" },
    { id: "more", name: "More", icon: "grid-outline" },
  ]

  const rewards = [
    {
      id: 1,
      title: "Coca Cola Voucher",
      points: 1000,
      image: require("../../assets/images/coke.jpg"),
      category: "food",
    },
    {
      id: 2,
      title: "Nestle Voucher",
      points: 500,
      image: require("../../assets/images/nestle.jpg"),
      category: "fashion",
    },
    {
      id: 3,
      title: "Aeon Voucher",
      points: 500,
      image: require("../../assets/images/aeon.jpg"),
      category: "fashion",
    },
  ]

  const history = [
    {
      id: 1,
      title: "Coffee Voucher Redeemed",
      points: -500,
      date: "2024-01-15",
      type: "redeem",
    },
    {
      id: 2,
      title: "Recycling Bonus",
      points: +150,
      date: "2024-01-14",
      type: "earn",
    },
  ]

  const handleRedeemReward = (reward) => {
    if (userPoints >= reward.points) {
      navigation.navigate("SuccessPopup", {
        type: "redeem",
        data: {
          rewardTitle: reward.title,
          pointsUsed: reward.points,
          remainingPoints: userPoints - reward.points,
        },
      })
    } else {
      alert("Insufficient points to redeem this reward")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <LinearGradient colors={["#ECEEE8", "#AFB498"]} style={styles.headerGradient}>

          {/* Points Display */}
          <View style={styles.pointsSection}>
            <Text style={styles.totalPointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>
              {loading ? "..." : userPoints.toFixed(2)}
            </Text>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "rewards" && styles.activeTab]}
              onPress={() => setActiveTab("rewards")}
            >
              <Text style={[styles.tabText, activeTab === "rewards" && styles.activeTabText]}>Rewards</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "downloaded" && styles.activeTab]}
              onPress={() => setActiveTab("downloaded")}
            >
              <Text style={[styles.tabText, activeTab === "downloaded" && styles.activeTabText]}>Downloaded</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "history" && styles.activeTab]}
              onPress={() => setActiveTab("history")}
            >
              <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "rewards" && (
            <>
              {/* Category Icons */}
              <View style={styles.categoryContainer}>
                {rewardCategories.map((category) => (
                  <TouchableOpacity key={category.id} style={styles.categoryItem}>
                    <View style={styles.categoryIcon}>
                      <Ionicons name={category.icon} size={30} color={Colors.white} />
                    </View>
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Rewards Section */}
              <View style={styles.rewardsSection}>
                <Text style={styles.sectionTitle}>Rewards</Text>
                {rewards.map((reward) => (
                  <TouchableOpacity
                    key={reward.id}
                    style={styles.rewardCard}
                    onPress={() => handleRedeemReward(reward)}
                  >
                    <Image source={reward.image} style={styles.rewardImage} />
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardTitle}>{reward.title}</Text>
                      <Text style={styles.rewardPoints}>{reward.points} pts</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {activeTab === "history" && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              {history.map((item) => (
                <View key={item.id} style={styles.historyItem}>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <Text style={[styles.historyPoints, item.type === "earn" ? styles.earnedPoints : styles.spentPoints]}>
                    {item.points > 0 ? "+" : ""}
                    {item.points} pts
                  </Text>
                </View>
              ))}
            </View>
          )}
          {activeTab === "downloaded" && (
            <View style={styles.emptySection}>
              <Ionicons name="download-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No downloaded rewards yet</Text>
            </View>
          )}
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
    height: 200,
    paddingHorizontal: 20,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  pointsSection: {
    alignItems: "center",
    marginTop: 50,
  },
  totalPointsLabel: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 5,
  },
  pointsValue: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: "800",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.secondary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textGray,
  },
  activeTabText: {
    color: Colors.text,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  categoryItem: {
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text,
  },
  rewardsSection: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primaryDark,
    marginBottom: 20,
  },
  rewardCard: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardImage: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.backgroundLight,
  },
  rewardInfo: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  rewardPoints: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  historySection: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.textGray,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: "600",
  },
  earnedPoints: {
    color: Colors.success,
  },
  spentPoints: {
    color: "#FF6B6B",
  },
  emptySection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 10,
  },
})

export default RewardsScreen
