"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Types based on the API response
export type Permission = "read" | "write" | "create" | "delete" | "submit" | "cancel" | "amend"

export type ModulePermissions = {
  [docType: string]: Permission[]
}

export type User = {
  email: string
  name?: string
  roles: string[]
  modules: string[]
  permissions: ModulePermissions
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  hasPermission: (docType: string, permission: Permission) => boolean
  hasAnyPermission: (docType: string, permissions: Permission[]) => boolean
  hasRole: (role: string) => boolean
  hasModule: (module: string) => boolean
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// API endpoints
const LOGIN_API_URL = "https://rjlogistics.logixfleetapp.com/api/method/login"
const USER_DETAILS_API_URL = "https://rjlogistics.logixfleetapp.com/api/method/erpnext.api.get_user_details"
const API_TOKEN = "13560c2ae837ee8:47a214defca981e"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user has a specific permission for a document type
  const hasPermission = useCallback(
    (docType: string, permission: Permission): boolean => {
      if (!user) return false

      // Check if the document type exists in permissions
      if (!user.permissions[docType]) return false

      // Check if the permission exists for the document type
      return user.permissions[docType].includes(permission)
    },
    [user],
  )

  // Check if user has any of the specified permissions for a document type
  const hasAnyPermission = useCallback(
    (docType: string, permissions: Permission[]): boolean => {
      if (!user) return false

      // Check if the document type exists in permissions
      if (!user.permissions[docType]) return false

      // Check if any of the permissions exist for the document type
      return permissions.some((permission) => user.permissions[docType].includes(permission))
    },
    [user],
  )

  // Check if user has a specific role
  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false
      return user.roles.includes(role)
    },
    [user],
  )

  // Check if user has access to a specific module
  const hasModule = useCallback(
    (module: string): boolean => {
      if (!user) return false
      return user.modules.includes(module)
    },
    [user],
  )

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Call login API
      const loginResponse = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${API_TOKEN}`,
        },
        body: JSON.stringify({
          usr: email,
          pwd: password,
        }),
      })

      const loginData = await loginResponse.json()

      if (!loginResponse.ok) {
        return {
          success: false,
          error: loginData.message || "Invalid credentials",
        }
      }

      // If login successful, fetch user details
      const userDetailsResponse = await fetch(`${USER_DETAILS_API_URL}?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          Authorization: `token ${API_TOKEN}`,
        },
      })

      if (!userDetailsResponse.ok) {
        return {
          success: false,
          error: "Failed to fetch user details",
        }
      }

      const userDetailsData = await userDetailsResponse.json()

      // Create user object from API response
      const userData: User = {
        email: email,
        name: userDetailsData.message?.full_name || email.split("@")[0],
        roles: userDetailsData.message?.roles || [],
        modules: userDetailsData.message?.modules || [],
        permissions: userDetailsData.message?.permissions || {},
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      setUser(userData)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: "An unexpected error occurred",
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  // Refresh user data
  const refreshUserData = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      const userDetailsResponse = await fetch(`${USER_DETAILS_API_URL}?email=${encodeURIComponent(user.email)}`, {
        method: "GET",
        headers: {
          Authorization: `token ${API_TOKEN}`,
        },
      })

      if (!userDetailsResponse.ok) {
        toast({
          title: "Error",
          description: "Failed to refresh user data",
          variant: "destructive",
        })
        return
      }

      const userDetailsData = await userDetailsResponse.json()

      // Update user object from API response
      const userData: User = {
        ...user,
        roles: userDetailsData.message?.roles || user.roles,
        modules: userDetailsData.message?.modules || user.modules,
        permissions: userDetailsData.message?.permissions || user.permissions,
      }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      setUser(userData)
    } catch (error) {
      console.error("Error refreshing user data:", error)
      toast({
        title: "Error",
        description: "Failed to refresh user data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          console.error("Error parsing user data:", error)
          localStorage.removeItem("user")
        }
      }
      setIsLoading(false)
    }

    loadUserFromStorage()
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasModule,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
