"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const UserContext = createContext()

const initialState = {
  user: null,
  points: 0,
  totalRecycled: 0,
  rewards: [],
  history: [],
  loading: false,
  error: null,
}

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_USER":
      return { ...state, user: action.payload, loading: false }

    case "UPDATE_POINTS":
      return { ...state, points: action.payload }

    case "ADD_RECYCLING_RECORD":
      return {
        ...state,
        totalRecycled: state.totalRecycled + action.payload.itemsRecycled,
        points: state.points + action.payload.pointsEarned,
        history: [action.payload, ...state.history],
      }

    case "REDEEM_REWARD":
      return {
        ...state,
        points: state.points - action.payload.pointsUsed,
        history: [action.payload, ...state.history],
      }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const userData = await AsyncStorage.getItem("userData")
      if (userData) {
        const user = JSON.parse(userData)
        dispatch({ type: "SET_USER", payload: user })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData))
      dispatch({ type: "SET_USER", payload: userData })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const addRecyclingRecord = (record) => {
    dispatch({ type: "ADD_RECYCLING_RECORD", payload: record })
  }

  const redeemReward = (rewardData) => {
    dispatch({ type: "REDEEM_REWARD", payload: rewardData })
  }

  return (
    <UserContext.Provider
      value={{
        ...state,
        saveUserData,
        addRecyclingRecord,
        redeemReward,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
