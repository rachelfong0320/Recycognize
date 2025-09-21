import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"
import { recyclingAPI } from "../api"

const { width, height } = Dimensions.get("window")

const SuccessPopup = ({ route, navigation }) => {
  const { type, data } = route.params || {}

  const handleClose = async () => {
    if (type === "check-in") {
      const sessionId = data?.sessionId
      let summaryData = {
        itemsRecycled: 0,
        pointsEarned: 0,
        wasteBreakdown: { plastic: 0, glass: 0, aluminum: 0, carton: 0 }
      }

      // Call points API to update points
      if (sessionId) {
        console.log("💰 Updating points for session:", sessionId)
        try {
          const pointsResult = await recyclingAPI.updatePoints(sessionId)
          if (pointsResult.success) {
            console.log("✅ Points updated successfully")
          } else {
            console.error("❌ Failed to update points:", pointsResult.error)
            // Continue with navigation even if API call fails
          }
        } catch (error) {
          console.error("❌ Points API error:", error)
          // Continue with navigation even if API call fails
        }
      } else {
        console.warn("⚠️ No session ID available for points update")
      }

      // Get recycling summary from API
      if (sessionId) {
        console.log("📊 Getting recycling summary for session:", sessionId)
        try {
          const summaryResult = await recyclingAPI.getRecyclingSummary(sessionId)
          if (summaryResult.success) {
            console.log("✅ Summary retrieved successfully:", summaryResult.data)
            summaryData = summaryResult.data
          } else {
            console.error("❌ Failed to get summary:", summaryResult.error)
            // Use fallback mock data
          }
        } catch (error) {
          console.error("❌ Summary API error:", error)
          // Use fallback mock data
        }
      }

      // For check-in completion, navigate to home and show recycling summary
      navigation.navigate("Home")
      
      // Call end session API before proceeding
      if (sessionId) {
        console.log("🔚 Ending session:", sessionId)
        try {
          const result = await recyclingAPI.endSession(sessionId, "completed")
          if (result.success) {
            console.log("✅ Session ended successfully")
          } else {
            console.error("❌ Failed to end session:", result.error)
            // Continue with navigation even if API call fails
          }
        } catch (error) {
          console.error("❌ End session API error:", error)
          // Continue with navigation even if API call fails
        }
      } else {
        console.warn("⚠️ No session ID available for ending session")
      }

      
      // After a short delay, show the recycling completion popup with real summary data
      setTimeout(() => {
        navigation.navigate("SuccessPopup", {
          type: "scan",
          data: summaryData,
        })
      }, 500)
    } else {
      navigation.goBack()
    }
  }

  const renderCheckInSuccess = () => (
    <View style={styles.popupContent}>
      {/* Success Animation Icon */}
      <View style={styles.successIconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={60} color={Colors.success} />
        </View>
        <View style={styles.pulseRing} />
      </View>

      <Text style={styles.title}>Successfully Checked In!</Text>

      {/* Session Details Card */}
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <Ionicons name="desktop-outline" size={24} color={Colors.primary} />
          <Text style={styles.sessionHeaderText}>Session Details</Text>
        </View>
        
        <View style={styles.sessionDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="hardware-chip-outline" size={16} color={Colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Machine ID</Text>
              <Text style={styles.detailValue}>{data?.rvmId || "Unknown"}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="key-outline" size={16} color={Colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Session ID</Text>
              <Text style={styles.detailValue}>{data?.sessionId || "Unknown"}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Instructions */}
      <View style={styles.instructionCard}>
        <View style={styles.instructionHeader}>
          <Ionicons name="play-circle" size={20} color="#4CAF50" />
          <Text style={styles.instructionTitle}>Ready to Start!</Text>
        </View>
        
        <View style={styles.stepsList}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Insert your recyclable items into the RVM machine</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Items will be automatically scanned and sorted</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Tap "Complete Session" when you're done</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleClose}>
        <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>Complete Session</Text>
      </TouchableOpacity>
    </View>
  )

  const renderScanSuccess = () => (
    <View style={styles.popupContent}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
      </View>

      <Text style={styles.title}>Recycling Complete!</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Items Recycled:</Text>
          <Text style={styles.summaryValue}>{data?.itemsRecycled || 0}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Points Earned:</Text>
          <Text style={styles.summaryValue}>{data?.pointsEarned || 0} pts</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.wasteBreakdown}>
          <Text style={styles.breakdownTitle}>Waste Breakdown:</Text>
          <View style={styles.wasteTypes}>
            {data?.wasteBreakdown?.plastic > 0 && (
              <View style={styles.wasteType}>
                <View style={[styles.wasteColor, { backgroundColor: "#FFE066" }]} />
                <Text style={styles.wasteLabel}>Plastic: {data.wasteBreakdown.plastic}</Text>
              </View>
            )}
            {data?.wasteBreakdown?.glass > 0 && (
              <View style={styles.wasteType}>
                <View style={[styles.wasteColor, { backgroundColor: "#66B2FF" }]} />
                <Text style={styles.wasteLabel}>Glass: {data.wasteBreakdown.glass}</Text>
              </View>
            )}
            {data?.wasteBreakdown?.aluminum > 0 && (
              <View style={styles.wasteType}>
                <View style={[styles.wasteColor, { backgroundColor: "#4ECDC4" }]} />
                <Text style={styles.wasteLabel}>Aluminum: {data.wasteBreakdown.aluminum}</Text>
              </View>
            )}
            {data?.wasteBreakdown?.carton > 0 && (
              <View style={styles.wasteType}>
                <View style={[styles.wasteColor, { backgroundColor: "#FF9F66" }]} />
                <Text style={styles.wasteLabel}>Carton: {data.wasteBreakdown.carton}</Text>
              </View>
            )}
            {(!data?.wasteBreakdown || 
              Object.values(data.wasteBreakdown).every(count => count === 0)) && (
              <Text style={styles.wasteLabel}>No items processed</Text>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  )

  const renderRedeemSuccess = () => (
    <View style={styles.popupContent}>
      <View style={styles.iconContainer}>
        <Ionicons name="gift" size={80} color={Colors.primary} />
      </View>

      <Text style={styles.title}>Reward Redeemed!</Text>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Redemption Details</Text>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Reward:</Text>
          <Text style={styles.summaryValue}>{data?.rewardTitle || "Unknown"}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Points Used:</Text>
          <Text style={styles.summaryValue}>{data?.pointsUsed || 0} pts</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Remaining Points:</Text>
          <Text style={styles.summaryValue}>{data?.remainingPoints || 0} pts</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.instructionText}>
          Your reward voucher has been sent to your email. Check your inbox for redemption instructions.
        </Text>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  )

  const renderContent = () => {
    switch (type) {
      case "check-in":
        return renderCheckInSuccess()
      case "scan":
        return renderScanSuccess()
      default:
        return renderRedeemSuccess()
    }
  }

  return (
    <Modal visible={true} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]} style={styles.gradient}>
          <View style={styles.popup}>{renderContent()}</View>
        </LinearGradient>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  popup: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  popupContent: {
    padding: 20,
    alignItems: "center",
  },
  
  // Enhanced Check-in Success Styles
  successIconContainer: {
    position: "relative",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pulseRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.success,
    opacity: 0.3,
  },
  sessionCard: {
    width: "100%",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sessionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginLeft: 8,
  },
  sessionDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  instructionCard: {
    width: "100%",
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  instructionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
    marginLeft: 10,
  },
  stepsList: {
    gap: 12,
    marginBottom: 15,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#2E7D32",
    lineHeight: 20,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // Existing styles (keeping the rest unchanged)
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.success,
    textAlign: "center",
    marginBottom: 20,
  },
  summaryContainer: {
    width: "100%",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 15,
    textAlign: "center",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    backgroundColor: Colors.background,
    padding: 6,
    borderRadius: 8,
    textAlign: "center",
    overflow: "hidden",
  },
  sessionIdContainer: {
    marginBottom: 10,
    width: "100%",
  },
  sessionIdValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 5,
    backgroundColor: Colors.background,
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 15,
  },
  wasteBreakdown: {
    width: "100%",
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 10,
  },
  wasteTypes: {
    gap: 8,
  },
  wasteType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  wasteColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  wasteLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: "100%",
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  
  // New styles for enhanced check-in popup
  actionSection: {
    alignItems: "center",
    paddingVertical: 10,
  },
  recycleIconContainer: {
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 15,
  },
})

export default SuccessPopup
