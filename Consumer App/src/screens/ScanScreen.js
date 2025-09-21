"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { CameraView, Camera } from "expo-camera"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"
import { recyclingAPI } from "../api"

const { width, height } = Dimensions.get("window")

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted")
    }

    getCameraPermissions()
  }, [])

  const handleBarCodeScanned = async ({ type, data }) => {
    // Prevent multiple scans - exit immediately if already processing
    if (scanned || isLoading) {
      console.log("🚫 Scan blocked - already processing")
      return;
    }
  
    
    // Set states immediately to prevent additional scans
    setScanned(true)
    setIsLoading(true)
    
    // Small delay to ensure camera stops scanning
    await new Promise(resolve => setTimeout(resolve, 100))
    
    setShowCamera(false)

    try {
      // Parse QR code data to extract sessionId and rvmId
      let qrData
      try {
        qrData = JSON.parse(data)
      } catch (parseError) {
        console.log("QR data is not JSON, treating as plain text:", data)
        // If not JSON, try to extract from plain text format
        // Expected format could be "sessionId:123,rvmId:456" or similar
        if (data.includes('sessionId') && data.includes('rvmId')) {
          const sessionIdMatch = data.match(/sessionId[:\s=](\w+)/i)
          const rvmIdMatch = data.match(/rvmId[:\s=](\w+)/i)
          
          if (sessionIdMatch && rvmIdMatch) {
            qrData = {
              sessionId: sessionIdMatch[1],
              rvmId: rvmIdMatch[1]
            }
          } else {
            throw new Error("Could not extract sessionId and rvmId from QR code")
          }
        } else {
          throw new Error("QR code format not recognized")
        }
      }

      // Validate required fields
      if (!qrData.sessionId || !qrData.rvmId) {
        throw new Error("QR code missing required sessionId or rvmId")
      }

      // Make check-in API call
      const result = await recyclingAPI.checkIn(qrData.sessionId, qrData.rvmId)

      if (result.success) {
        
        // Navigate to success popup with check-in data
        navigation.navigate("SuccessPopup", {
          type: "check-in",
          data: {
            sessionId: qrData.sessionId,
            rvmId: qrData.rvmId,
            checkInData: result.data,
            message: "Successfully checked in to RVM machine!"
          },
        })
      } else {
        throw new Error(result.error || "Check-in failed")
      }

    } catch (error) {
      console.error("❌ Scan processing failed:", error)
      
      Alert.alert(
        "Scan Error", 
        `Failed to process QR code: ${error.message}`,
        [
          { text: "Try Again", onPress: () => {
            console.log("🔄 Resetting for retry...")
            setScanned(false)
            setIsLoading(false)
            setShowCamera(true)
          }},
          { text: "Cancel", onPress: () => {
            console.log("❌ User cancelled, resetting...")
            setScanned(false)
            setIsLoading(false)
          }}
        ]
      )
    } finally {
      // Always reset loading state
      console.log("🔄 Resetting loading state...")
      setIsLoading(false)
    }
  }

  const startScan = () => {
    if (hasPermission) {
      setShowCamera(true)
      setScanned(false)
    } else {
      Alert.alert("Permission Required", "Camera permission is required to scan QR codes.")
    }
  }

  const goBack = () => {
    if (showCamera) {
      setShowCamera(false)
      setScanned(false)
    } else {
      navigation.navigate('Home')
    }
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        <SafeAreaView style={styles.cameraOverlay}>
          <View style={styles.scannerFrame}>
            <View style={styles.scannerCorner} />
            <View style={[styles.scannerCorner, styles.topRight]} />
            <View style={[styles.scannerCorner, styles.bottomLeft]} />
            <View style={[styles.scannerCorner, styles.bottomRight]} />
          </View>
          
          {/* Processing Indicator */}
          {isLoading && (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={Colors.white} />
              <Text style={styles.processingText}>Processing QR Code...</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#AFB498", "#ECEEE8"]}
        style={styles.gradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      >

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Scan QR</Text>

          {/* White Container */}
          <View style={styles.whiteContainer}>
            {/* QR Scanner Icon */}
            <View style={styles.scannerIconContainer}>
              <View style={styles.scannerIcon}>
                <Ionicons name="qr-code-outline" size={80} color="#939295" />
              </View>
            </View>

            <Text style={styles.description}>Scan QR code on our RVM machine to check in</Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.startButton, isLoading && styles.disabledButton]} 
                onPress={startScan}
                disabled={isLoading}
              >
                <Text style={styles.startButtonText}>Start Scan</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backButtonMain} onPress={goBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Processing check-in...</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginBottom: -35,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 40,
  },
  whiteContainer: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scannerIconContainer: {
    marginBottom: 40,
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    borderRadius: 20,
  },
  scannerIcon: {
    width: 150,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.textGray,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 20,
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    width: 180,
  },
  disabledButton: {
    backgroundColor: Colors.textGray,
    opacity: 0.6,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  backButtonMain: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    width: 180,
  },
  backButtonText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  // Camera styles
  cameraContainer: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  scannerCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.white,
    borderWidth: 3,
    borderTopLeftRadius: 10,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: "auto",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    top: "auto",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: "auto",
    left: "auto",
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  processingContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 200,
  },
  processingText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Loading overlay styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '600',
  },
})

export default ScanScreen
