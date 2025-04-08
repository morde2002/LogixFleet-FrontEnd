"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Type definitions
export type Permission = "read" | "write" | "create" | "delete" | "submit" | "cancel" | "amend"

export type UserPermissions = {
  [module: string]: Permission[]
}

export type User = {
  id: string
  name: string
  email: string
  role: string
  roles?: string[]
  permissions: UserPermissions
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  hasPermission: (module: string, permission: Permission) => boolean
  hasAnyPermission: (module: string, permissions: Permission[]) => boolean
  logout: () => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const redirectInProgress = useRef(false)
  const lastRedirectTime = useRef(0)

  // Helper function to check permissions
  const hasPermission = (module: string, permission: Permission): boolean => {
    if (!user) return false

    // Special case for specific admin emails
    if (user.email?.toLowerCase() === "leofleet@gmail.com" || user.email?.toLowerCase() === "yesnow@example.com") {
      return true
    }

    // Admin role has all permissions
    if (user.role === "Admin" || (user.roles && user.roles.includes("Admin"))) {
      return true
    }

    // Check if user has the specific permission for the module
    return Boolean(user.permissions && user.permissions[module] && user.permissions[module].includes(permission))
  }

  // Helper to check if user has any of the given permissions
  const hasAnyPermission = (module: string, permissions: Permission[]): boolean => {
    // Special case for specific admin emails
    if (user?.email?.toLowerCase() === "leofleet@gmail.com" || user?.email?.toLowerCase() === "yesnow@example.com") {
      return true
    }

    return permissions.some((permission) => hasPermission(module, permission))
  }

  // Fetch user data from cookies/API
  const loadUserData = async () => {
    setIsLoading(true)
    try {
      // Try to get user data from cookies
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_id="))
        ?.split("=")[1]

      if (!userId) {
        setUser(null)
        setIsLoading(false)

        // If on a protected route, redirect to login
        if (pathname !== "/" && !pathname.includes("/login")) {
          // Prevent redirect loops
          if (!redirectInProgress.current && Date.now() - lastRedirectTime.current > 2000) {
            redirectInProgress.current = true
            lastRedirectTime.current = Date.now()
            router.push("/")
            setTimeout(() => {
              redirectInProgress.current = false
            }, 2000)
          }
        }
        return
      }

      // Try to get user data from cookie
      const userDataCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user_data="))
        ?.split("=")[1]

      let userData = null

      if (userDataCookie) {
        try {
          userData = JSON.parse(decodeURIComponent(userDataCookie))

          // Special handling for admin emails
          if (
            userData.email?.toLowerCase() === "leofleet@gmail.com" ||
            userData.email?.toLowerCase() === "yesnow@example.com"
          ) {
            userData.role = "Admin"
            userData.roles = ["Admin", "System Manager"]
            userData.permissions = {
              User: ["read", "write", "create", "delete"],
              Vehicle: ["read", "write", "create", "delete"],
              Driver: ["read", "write", "create", "delete"],
              Report: ["read", "write", "create"],
            }
          }

          // Set user immediately from cookie data to avoid blank screens
          setUser(userData)
        } catch (e) {
          console.error("Error parsing user data from cookie:", e)
        }
      }

      // Try to refresh from API, but don't block the UI
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const freshUserData = await response.json()

          // Special handling for admin emails
          if (
            freshUserData.email?.toLowerCase() === "leofleet@gmail.com" ||
            freshUserData.email?.toLowerCase() === "yesnow@example.com"
          ) {
            freshUserData.role = "Admin"
            freshUserData.roles = ["Admin", "System Manager"]
            freshUserData.permissions = {
              User: ["read", "write", "create", "delete"],
              Vehicle: ["read", "write", "create", "delete"],
              Driver: ["read", "write", "create", "delete"],
              Report: ["read", "write", "create"],
            }
          }

          setUser(freshUserData)
        } else {
          console.warn("API /me returned non-OK status:", response.status)
          // If we already set user from cookie, keep that data
          if (!userData) {
            // Fallback to mock data if both cookie and API fail
            const mockUserData = createMockUserData(userId)
            setUser(mockUserData)
          }
        }
      } catch (apiError) {
        console.error("Error fetching from /api/me:", apiError)
        // If we already set user from cookie, keep that data
        if (!userData) {
          // Fallback to mock data if both cookie and API fail
          const mockUserData = createMockUserData(userId)
          setUser(mockUserData)
        }
      }
    } catch (error) {
      console.error("Error in loadUserData:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user data from the server
  const refreshUserData = async () => {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to refresh user data")
      }

      const userData = await response.json()

      // Special handling for admin emails
      if (
        userData.email?.toLowerCase() === "leofleet@gmail.com" ||
        userData.email?.toLowerCase() === "yesnow@example.com"
      ) {
        userData.role = "Admin"
        userData.roles = ["Admin", "System Manager"]
        userData.permissions = {
          User: ["read", "write", "create", "delete"],
          Vehicle: ["read", "write", "create", "delete"],
          Driver: ["read", "write", "create", "delete"],
          Report: ["read", "write", "create"],
        }
      }

      setUser(userData)
    } catch (error) {
      console.error("Error refreshing user data:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh user data",
      })
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      // Clear user data regardless of API success
      setUser(null)

      // Delete cookies
      document.cookie = "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      // Redirect to login
      if (!redirectInProgress.current) {
        redirectInProgress.current = true
        router.push("/")
        setTimeout(() => {
          redirectInProgress.current = false
        }, 2000)
      }
    }
  }

  // Load user data on mount
  useEffect(() => {
    loadUserData()
  }, [])

  // Protect routes based on permissions
  useEffect(() => {
    if (isLoading) return

    // Skip permission checks for special admin emails
    if (user?.email?.toLowerCase() === "leofleet@gmail.com" || user?.email?.toLowerCase() === "yesnow@example.com") {
      return
    }

    // Handle route protection
    const routePermissions: Record<string, { module: string; permissions: Permission[] }> = {
      "/dashboard/users": { module: "User", permissions: ["read"] },
      "/dashboard/users/new": { module: "User", permissions: ["create"] },
      "/dashboard/vehicles": { module: "Vehicle", permissions: ["read"] },
      "/dashboard/vehicles/new": { module: "Vehicle", permissions: ["create"] },
      "/dashboard/drivers": { module: "Driver", permissions: ["read"] },
      "/dashboard/drivers/new": { module: "Driver", permissions: ["create"] },
      // Add more routes as needed
    }

    // Check for exact routes and route patterns
    const needsRedirect = Object.entries(routePermissions).some(([route, { module, permissions }]) => {
      if (pathname === route) {
        return !hasAnyPermission(module, permissions)
      }

      // Handle edit routes
      if (route.endsWith("/new") && pathname.includes("/edit/") && pathname.startsWith(route.replace("/new", ""))) {
        return !hasPermission(module, "write")
      }

      return false
    })

    if (user && needsRedirect) {
      // Prevent redirect loops
      if (!redirectInProgress.current && Date.now() - lastRedirectTime.current > 2000) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page",
        })
        redirectInProgress.current = true
        lastRedirectTime.current = Date.now()
        router.push("/dashboard")
        setTimeout(() => {
          redirectInProgress.current = false
        }, 2000)
      }
    }
  }, [isLoading, pathname, user, router])

  const value = {
    user,
    isLoading,
    hasPermission,
    hasAnyPermission,
    logout,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Add this helper function to create mock user data when needed
const createMockUserData = (userId: string) => {
  // Create mock user data based on special IDs or default to basic permissions
  const isAdmin = userId === "1" || userId === "admin"

  return {
    id: userId,
    name: isAdmin ? "Admin User" : "Regular User",
    email: isAdmin ? "admin@example.com" : "user@example.com",
    role: isAdmin ? "Admin" : "User",
    roles: isAdmin ? ["Admin", "System Manager"] : ["User"],
    permissions: isAdmin
      ? {
          User: ["read", "write", "create", "delete"],
          Vehicle: ["read", "write", "create", "delete"],
          Driver: ["read", "write", "create", "delete"],
          Report: ["read", "write", "create"],
        }
      : {
          Vehicle: ["read"],
          Driver: ["read"],
          Report: ["read"],
        },
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
