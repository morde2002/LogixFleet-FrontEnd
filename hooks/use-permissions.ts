"use client"

import { useCurrentUser } from "@/hooks/use-current-user"

type PermissionAction = "read" | "write" | "create" | "delete" | "submit" | "cancel" | "amend"

export function usePermissions() {
  const user = useCurrentUser()

  const hasPermission = (module: string, action: PermissionAction): boolean => {
    if (!user) return false

    // Admin role has all permissions
    if (user.role === "Admin" || (user.roles && user.roles.includes("Admin"))) {
      return true
    }

    // Check if user has the specific permission
    if (user.permissions && user.permissions[module]) {
      return user.permissions[module].includes(action)
    }

    return false
  }

  return { hasPermission }
}

