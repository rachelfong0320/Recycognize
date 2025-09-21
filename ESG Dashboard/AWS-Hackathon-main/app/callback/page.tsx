// "use client"
// import { useRouter, useSearchParams } from "next/navigation"
// import { jwtDecode } from "jwt-decode"
// import { useEffect } from "react"

// const emailToMockToken: Record<string, string> = {
//   "lichee03@gmail.com": "coca-cola-token",
//   "rachelfong.tw@gmail.com": "pepsi-token",
//   "rachelteoh14@gmail.com": "admin-token",
// }

// export default function CallbackPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   useEffect(() => {
//     const code = searchParams.get("code")
//     if (!code) {
//       router.push("/login")
//       return
//     }

//     const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
//     const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!
//     const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!

//     const exchangeCode = async () => {
//       try {
//         const body = new URLSearchParams({
//           grant_type: "authorization_code",
//           code,
//           client_id: clientId,
//           redirect_uri: redirectUri,
//         })

//         const res = await fetch(`${cognitoDomain}/oauth2/token`, {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: body.toString(),
//         })

//         if (!res.ok) {
//           throw new Error(`Token exchange failed: ${res.status}`)
//         }

//         const tokens = await res.json()
//         console.log("Cognito tokens:", tokens)

//         // Store the actual tokens from Cognito
//         localStorage.setItem("fmcg-tokens", JSON.stringify(tokens))
        
//         // Decode the ID token to get user info
//         const decoded: any = jwtDecode(tokens.id_token)
//         const email = decoded.email
//         console.log("Decoded email from ID token:", email)
        
//         // Store additional user info if needed
//         localStorage.setItem("fmcg-user-email", email)
        
//         router.push("/dashboard")
//       } catch (error) {
//         console.error("Error during token exchange:", error)
//         alert("Authentication failed. Please try again.")
//         router.push("/login")
//       }
//     }

//     exchangeCode()
//   }, [searchParams, router])

//   return <p>Signing you in...</p>
// }

"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"

// Mock token and user data mapping
const emailToMockToken: Record<string, string> = {
  "lichee03@gmail.com": "coca-cola-token",
  "rachelfong.tw@gmail.com": "pepsi-token",
  "rachelteoh14@gmail.com": "admin-token",
}

const emailToUserData: Record<string, any> = {
  "lichee03@gmail.com": {
    id: "1",
    email: "lichee03@gmail.com",
    brand: "Coca-Cola",
    role: "brand" as const,
  },
  "rachelfong.tw@gmail.com": {
    id: "2",
    email: "rachelfong.tw@gmail.com",
    brand: "Pepsi",
    role: "brand" as const,
  },
  "rachelteoh14@gmail.com": {
    id: "3",
    email: "rachelteoh14@gmail.com",
    brand: "all",
    role: "admin" as const,
  },
}

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    if (!code) {
      console.error("No authorization code found in URL")
      router.push("/")
      return
    }

    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
    const clientSecret = process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET!
    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI!
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!

    const exchangeCode = async () => {
      try {
        // Exchange code for Cognito tokens
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: clientId,
          redirect_uri: redirectUri,
        })

        const credentials = btoa(`${clientId}:${clientSecret}`)
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${credentials}`
        }

        const res = await fetch(`${cognitoDomain}/oauth2/token`, {
          method: "POST",
          headers: headers,
          body: body.toString(),
        })

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Token exchange failed: ${res.status} - ${errorText}`)
        }

        const cognitoTokens = await res.json()
        console.log("Cognito tokens received:", cognitoTokens)

        // Decode the ID token to get user email
        const decoded: any = jwtDecode(cognitoTokens.id_token)
        const email = decoded.email
        console.log("Authenticated user email:", email)

        // Map email to your mock token and user data
        const mockToken = emailToMockToken[email]
        const userData = emailToUserData[email]

        if (mockToken && userData) {
          // Store tokens and user data for AuthProvider to use
          localStorage.setItem("fmcg-tokens", JSON.stringify(cognitoTokens))
          localStorage.setItem("fmcg-app-token", mockToken)
          localStorage.setItem("fmcg-user", JSON.stringify(userData))
          
          console.log("User authenticated:", userData)
          router.push("/dashboard")
        } else {
          console.error("Email not recognized in mock mapping:", email)
          alert("Your email is not authorized to access this application.")
          router.push("/login")
        }

      } catch (error) {
        console.error("Error during authentication:", error)
        alert("Authentication failed. Please try logging in again.")
        router.push("/")
      }
    }

    exchangeCode()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}