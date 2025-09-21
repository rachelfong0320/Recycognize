"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { BarChart3, TrendingUp, FileText, Settings, LogOut, Home, PieChart, Download } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  // { name: "Trends", href: "/dashboard/trends", icon: TrendingUp },
  { name: "Update Details", href: "/dashboard/reports", icon: FileText },
  { name: "Export", href: "/dashboard/export", icon: Download },
]

export function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo and Brand */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <PieChart className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">FMCG Analytics</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">{user?.brand.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.brand}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Settings and Logout */}
      <div className="px-4 py-4 border-t border-gray-200 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
        <Button variant="ghost" onClick={logout} className="w-full justify-start text-gray-600 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
