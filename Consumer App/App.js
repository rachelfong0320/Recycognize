import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { StyleSheet } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

// Import screens
import HomeScreen from "./src/screens/HomeScreen"
import ScanScreen from "./src/screens/ScanScreen"
import RewardsScreen from "./src/screens/RewardsScreen"
import LocationScreen from "./src/screens/LocationScreen"
import SuccessPopup from "./src/components/SuccessPopup"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Scan") {
            iconName = focused ? "scan" : "scan-outline"
          } else if (route.name === "Rewards") {
            iconName = focused ? "gift" : "gift-outline"
          } else if (route.name === "Location") {
            iconName = focused ? "location" : "location-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#6B6D6C",
        tabBarInactiveTintColor: "#6B6D6C",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "rgba(0, 0, 0, 0.1)",
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          fontFamily: "Inter",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Location" component={LocationScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="SuccessPopup"
            component={SuccessPopup}
            options={{
              presentation: "modal",
              cardStyle: { backgroundColor: "rgba(0,0,0,0.5)" },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
})
