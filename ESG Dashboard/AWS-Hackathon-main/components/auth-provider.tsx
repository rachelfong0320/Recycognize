// "use client"

// import { createContext, useContext, useState, useEffect, ReactNode } from "react"
// import { jwtDecode } from "jwt-decode"

// interface DecodedIdToken {
//   sub: string
//   email: string
//   "cognito:groups"?: string[]
//   [key: string]: any
// }

// interface User {
//   id: string
//   email: string
//   brand: string
//   role: "brand" | "admin"
//   companyData?: CompanyRegistration
// }

// interface CompanyRegistration {
//   companyName: string
//   brandNames: string[]
//   companyId?: string
//   contactPerson: string
//   contactEmail: string
//   accountAdmin: string
//   accountAdminEmail: string
//   logoUrl?: string

//   rvmPartnerIds: string[]
//   defaultCurrency: string
//   defaultRegion: string
//   materialMappingPreference: string

//   products: ProductData[]

//   sustainabilityTargets: string
//   reportingBoundary: string
//   verificationStatus: "self-reported" | "third-party-verified"
//   certificateUrl?: string

//   consentPublicDashboard: boolean
//   consentDataSharing: boolean
// }

// interface ProductData {
//   id: string
//   sku?: string
//   barcode?: string
//   packagingType: string
//   materials: { material: string; percentage: number }[]
//   unitWeight: number
//   recyclability: "yes" | "no" | "partial"
//   recyclabilityComments?: string
// }

// interface AuthContextType {
//   user: User | null
//   login: () => void
//   logout: () => void
//   signup: () => void
//   updateCompanyData: (data: Partial<CompanyRegistration>) => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedTokens = localStorage.getItem("fmcg-tokens")
//         if (!storedTokens) {
//           return
//         }

//         const tokens = JSON.parse(storedTokens)
//         if (!tokens.id_token) {
//           console.error("No ID token found in stored tokens")
//           return
//         }

//         const decoded: DecodedIdToken = jwtDecode(tokens.id_token)

//         const userData: User = {
//           id: decoded.sub,
//           email: decoded.email,
//           brand: decoded["custom:brand"] || "Unknown",
//           role: decoded["cognito:groups"]?.includes("admin") ? "admin" : "brand",
//         }

//         setUser(userData)
//       } catch (error) {
//         console.error("Error initializing auth:", error)
//         // Clear invalid tokens
//         localStorage.removeItem("fmcg-tokens")
//       }
//     }

//     initializeAuth()
//   }, [])
//   const login = () => {
//     const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
//     const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
//     const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!


//     const url = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}`
//     window.location.href = url
//   }

//   const signup = () => {
//     const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
//     const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
//     const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!

//     const url = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}`
//     window.location.href = url
//   }

//   const updateCompanyData = (data: Partial<CompanyRegistration>) => {
//     if (user) {
//       const updatedUser = {
//         ...user,
//         companyData: { ...user.companyData, ...data } as CompanyRegistration,
//       }
//       setUser(updatedUser)
//       localStorage.setItem("fmcg-user", JSON.stringify(updatedUser))
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("fmcg-tokens")
//     setUser(null)

//     const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
//     const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
//     const logoutUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI! // define this in .env

//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
//       logoutUri
//     )}`
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, signup, updateCompanyData }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }


"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  brand: string
  role: "brand" | "admin"
  companyData?: CompanyRegistration
}

interface CompanyRegistration {
  companyName: string
  brandNames: string[]
  companyId?: string
  contactPerson: string
  contactEmail: string
  accountAdmin: string
  accountAdminEmail: string
  logoUrl?: string
  rvmPartnerIds: string[]
  defaultCurrency: string
  defaultRegion: string
  materialMappingPreference: string
  products: ProductData[]
  sustainabilityTargets: string
  reportingBoundary: string
  verificationStatus: "self-reported" | "third-party-verified"
  certificateUrl?: string
  consentPublicDashboard: boolean
  consentDataSharing: boolean
}

interface ProductData {
  id: string
  sku?: string
  barcode?: string
  packagingType: string
  materials: { material: string; percentage: number }[]
  unitWeight: number
  recyclability: "yes" | "no" | "partial"
  recyclabilityComments?: string
}

interface AuthContextType {
  user: User | null
  login: () => void
  logout: () => void
  signup: () => void
  updateCompanyData: (data: Partial<CompanyRegistration>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check for stored user data
        const storedUser = localStorage.getItem("fmcg-user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Clear invalid data
        localStorage.removeItem("fmcg-tokens")
        localStorage.removeItem("fmcg-app-token")
        localStorage.removeItem("fmcg-user")
      }
    }

    initializeAuth()
  }, [])

  const login = () => {
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!

    const url = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`
    window.location.href = url
  }

  const signup = () => {
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!

    const url = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`
    window.location.href = url
  }

  const updateCompanyData = (data: Partial<CompanyRegistration>) => {
    if (user) {
      const updatedUser = {
        ...user,
        companyData: { ...user.companyData, ...data } as CompanyRegistration,
      }
      setUser(updatedUser)
      localStorage.setItem("fmcg-user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem("fmcg-tokens")
    localStorage.removeItem("fmcg-app-token")
    localStorage.removeItem("fmcg-user")
    setUser(null)

    // Optional: Redirect to Cognito logout
    // const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!
    // const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
    // const logoutUri = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI||"http://localhost:3000"!
    
    window.location.href = `http://localhost:3000`
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateCompanyData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}