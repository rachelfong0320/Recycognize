"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, Calendar, Plus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function DashboardHeader() {
  const { user } = useAuth()
  const now = new Date()
  const month = now.toLocaleString("default", { month: "short" }) // e.g. "Sep"
  const year = now.getFullYear() // e.g. 2025

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search analytics..." className="pl-10 w-80" />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-4">
        {/* Date Range */}
        <Button variant="outline" size="sm" className="text-gray-600 bg-transparent">
          <Calendar className="mr-2 h-4 w-4" />
          {month} {year}
        </Button>

        {/* Add Widget
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button> */}

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-600">{user?.brand.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
