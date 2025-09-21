"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "../constants/colors"
import { recyclingAPI } from "../api"

const { width, height } = Dimensions.get("window")

const LocationScreen = () => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [recyclingStations, setRecyclingStations] = useState([])
  const [loading, setLoading] = useState(true)
  const [mapRegion, setMapRegion] = useState({
    latitude: 1.3521,
    longitude: 103.8198,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const savedLocations = [
    {
      id: 1,
      name: "Lindah Residence",
      address: "Jl Kenyo Baru 2, Grand Perdana Residence near Taman, South Pontianak, Pontianak, West Kalimantan 78115",
    },
    {
      id: 2,
      name: "Saved Location",
      address: "Gg Karet Lesson 23 Jl, Sungai Beliung, Kec. Pontianak Kota, Kota Pontianak, Kalimantan Barat, 78244",
    },
  ]

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied")
          return
        }

        const currentLocation = await Location.getCurrentPositionAsync({})
        setLocation(currentLocation)
        
        const newMapRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
        setMapRegion(newMapRegion)
        
        // Fetch recycling stations near current location
        await fetchRecyclingStations(currentLocation.coords.latitude, currentLocation.coords.longitude)
      } catch (error) {
        console.error("Error getting location:", error)
        setErrorMsg("Failed to get location")
        // Fetch stations with default location if location fails
        await fetchRecyclingStations(3.0470, 101.6958)
      } finally {
        setLoading(false)
      }
    }

    initializeLocation()
  }, [])

  const fetchRecyclingStations = async (latitude, longitude) => {
    try {
      const stationsResponse = await recyclingAPI.getRecyclingStations(latitude, longitude)
      
      if (stationsResponse.success && stationsResponse.stations) {
        setRecyclingStations(stationsResponse.stations)
      } else {
        console.error("❌ Failed to fetch stations:", stationsResponse)
        setRecyclingStations([]) // Set empty array if fetch fails
      }
    } catch (error) {
      console.error("🔥 Error fetching recycling stations:", error)
      setRecyclingStations([]) // Set empty array on error
    }
  }

  const handleUseAddress = (address) => {
    Alert.alert("Address Selected", `You selected: ${address}`)
  }

  const handleNavigateToRVM = (station) => {
    // Set map region to focus on the selected RVM machine
    const newRegion = {
      latitude: station.latitude,
      longitude: station.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    setMapRegion(newRegion)
    
    // Show alert with RVM details
    Alert.alert(
      "Navigating to RVM",
      `Navigating to ${station.name}\n${station.address}\n\nStatus: ${station.status}\nHours: ${station.operatingHours}`,
      [
        { text: "OK", onPress: () => console.log("Navigation confirmed") }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={mapRegion} onRegionChange={setMapRegion}>
          {/* User location marker */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />
          )}

          {/* RVM Machine markers */}
          {recyclingStations.map((station) => (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude,
              }}
              title={station.name}
              description={`${station.address} • ${station.distance}km away • ${station.operatingHours || "24/7"}`}
            >
              <View style={[
                styles.customMarker, 
                station.status === 'maintenance' && styles.maintenanceMarker
              ]}>
                <Ionicons 
                  name="hardware-chip" 
                  size={22} 
                  color={station.status === 'maintenance' ? '#FF6B6B' : Colors.success} 
                />
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Loading indicator */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading nearby recycling stations...</Text>
          </View>
        )}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="add" size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="remove" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Fixed Header */}
        <View style={styles.bottomSheetHeader}>
          <Text style={styles.sectionTitle}>Nearby RVM Machines ({recyclingStations.length})</Text>
          <View style={styles.dividerLine} />
        </View>
        
        {/* Scrollable Content */}
        <ScrollView 
          style={styles.bottomSheetScroll}
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
        >
          {recyclingStations.map((station) => (
            <View key={station.id} style={styles.locationItem}>
              <View style={styles.rvmInfo}>
                <View style={styles.rvmHeader}>
                  <Text style={styles.rvmName}>{station.name}</Text>
                  <View style={[
                    styles.statusBadge, 
                    station.status === 'maintenance' ? styles.maintenanceBadge : styles.activeBadge
                  ]}>
                    <Text style={styles.statusText}>
                      {station.status === 'maintenance' ? 'Maintenance' : 'Active'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.rvmAddress}>{station.address}</Text>
                <Text style={styles.rvmDetails}>
                  {station.distance}km away • {station.operatingHours}
                </Text>
              </View>
              <TouchableOpacity 
                style={[
                  styles.useAddressButton,
                  station.status === 'maintenance' && styles.disabledButton
                ]} 
                onPress={() => handleNavigateToRVM(station)}
                disabled={station.status === 'maintenance'}
              >
                <Text style={[
                  styles.useAddressText,
                  station.status === 'maintenance' && styles.disabledButtonText
                ]}>
                  {station.status === 'maintenance' ? 'Offline' : 'Navigate'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginBottom: -35,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  customMarker: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.success,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  maintenanceMarker: {
    borderColor: "#FF6B6B",
    backgroundColor: "#FFF5F5",
  },
  mapControls: {
    position: "absolute",
    right: 12,
    bottom: 100,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B6B9BF",
    overflow: "hidden",
  },
  zoomButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  loadingText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#B6B9BF",
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.5)",
    height: height * 0.4,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  bottomSheetScroll: {
    flex: 1,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 10,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 20,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 12,
    color: Colors.textGray,
    lineHeight: 16,
  },
  useAddressButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
  },
  useAddressText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  rvmInfo: {
    flex: 1,
  },
  rvmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rvmName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  rvmAddress: {
    fontSize: 11,
    color: Colors.textGray,
    lineHeight: 14,
    marginBottom: 2,
  },
  rvmDetails: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: "italic",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: Colors.success,
  },
  maintenanceBadge: {
    backgroundColor: "#FF6B6B",
  },
  statusText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: Colors.textGray,
  },
  disabledButtonText: {
    color: Colors.background,
  },
})

export default LocationScreen
