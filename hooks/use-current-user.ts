"use client"

import { useState, useEffect } from "react"

// Mock users for client-side components
const mockUsers = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "Admin" },
  { id: "2", name: "Fleet Manager", email: "manager@example.com", role: "FleetManager" },
  { id: "3", name: "Driver User", email: "driver@example.com", role: "Driver" },
]

export function useCurrentUser() {
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
    role: string
  } | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the current user from an API
    // This is a mock implementation that simulates getting the user from cookies
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user_id="))
      ?.split("=")[1]

    if (userId) {
      const user = mockUsers.find((u) => u.id === userId)
      setUser(user || null)
    }
  }, [])

  return user
}

