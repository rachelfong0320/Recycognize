// Authentication and brand access control utilities
export interface User {
  id: string
  email: string
  brand: string
  role: "admin" | "brand"  
}

export interface BrandData {
  id: string
  name: string
  material: string
  imageUrl: string
  confidence: Record<string, number>
  timestamp: string
}

// Get the current user from localStorage
export function getCurrentUser(): User | null {
  try {
    const storedUser = localStorage.getItem("fmcg-user")
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

// Get the app token from localStorage
export function getAppToken(): string | null {
  return localStorage.getItem("fmcg-app-token")
}

// Verify token against our mock users
export function verifyToken(token: string): User | null {
  try {
    // Mock implementation - in production, use proper JWT verification
    const mockUsers: Record<string, User> = {
      "coca-cola-token": {
        id: "1",
        email: "lichee03@gmail.com",
        brand: "Coca-Cola",
        role: "brand",
      },
      "pepsi-token": {
        id: "2",
        email: "rachelfong.tw@gmail.com",
        brand: "Pepsi",
        role: "brand",
      },
      "admin-token": {
        id: "3",
        email: "rachelteoh14@gmail.com",
        brand: "all",
        role: "admin",
      },
    }

    return mockUsers[token] || null
  } catch {
    return null
  }
}

export function hasAccessToBrand(user: User, brand: string): boolean {
  return user.role === "admin" || user.brand === brand || user.brand === "all"
}

// Mock brand data for demonstration
export const mockBrandData: BrandData[] = [
  {
    id: "1",
    name: "Coca-Cola",
    material: "Plastic Bottle",
    imageUrl: "/coca-cola-bottle.jpg",
    confidence: { brand_recognition: 0.95, material_detection: 0.88 },
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Coca-Cola",
    material: "Aluminum Can",
    imageUrl: "/coca-cola-can.jpg",
    confidence: { brand_recognition: 0.92, material_detection: 0.91 },
    timestamp: "2024-01-15T11:45:00Z",
  },
  {
    id: "3",
    name: "Pepsi",
    material: "Plastic Bottle",
    imageUrl: "/pepsi-bottle.jpg",
    confidence: { brand_recognition: 0.89, material_detection: 0.85 },
    timestamp: "2024-01-15T12:15:00Z",
  },
]