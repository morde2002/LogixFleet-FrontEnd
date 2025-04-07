import { cookies } from "next/headers"

export async function getCurrentUser() {
  const cookieStore = cookies()
  const userId = cookieStore.get("user_id")?.value

  if (!userId) {
    return null
  }

  // Try to get user data from cookie
  const userData = cookieStore.get("user_data")?.value

  if (userData) {
    try {
      return JSON.parse(userData)
    } catch (e) {
      console.error("Error parsing user data:", e)
    }
  }

  // Fallback to mock users if user data cookie is not available
  // In a real app, you would fetch the user from the database or API
  const mockUsers = [
    { id: "1", name: "Admin User", email: "admin@example.com", role: "Admin" },
    { id: "2", name: "Fleet Manager", email: "manager@example.com", role: "FleetManager" },
    { id: "3", name: "Driver User", email: "driver@example.com", role: "Driver" },
    { id: "4", name: "YesNow", email: "yesnow@example.com", role: "Admin" },
    { id: "5", name: "LeoFleet", email: "leofleet@gmail.com", role: "Admin" },
  ]

  const user = mockUsers.find((u) => u.id === userId)

  return user || null
}

