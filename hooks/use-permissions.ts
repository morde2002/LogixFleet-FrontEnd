"use client"

import { useAuth, type Permission } from "@/contexts/auth-context"

export function usePermissions() {
  const auth = useAuth()

  // If auth context is not available or still loading, provide safe defaults
  if (!auth || auth.isLoading) {
    return {
      hasPermission: () => false,
      hasAnyPermission: () => false,
      canCreate: () => false,
      canRead: () => false,
      canWrite: () => false,
      canDelete: () => false,
      canEdit: () => false,
      canManage: () => false,
      getAllModules: () => [],
      getModulePermissions: () => [],
    }
  }

  const { hasPermission, hasAnyPermission, user } = auth

  return {
    hasPermission,
    hasAnyPermission,
    // Commonly used permission check combinations
    canCreate: (module: string) => hasPermission(module, "create"),
    canRead: (module: string) => hasPermission(module, "read"),
    canWrite: (module: string) => hasPermission(module, "write"),
    canDelete: (module: string) => hasPermission(module, "delete"),
    canEdit: (module: string) => hasPermission(module, "write"),
    canManage: (module: string) => hasAnyPermission(module, ["create", "write", "delete"]),

    // Get all the modules the user has access to
    getAllModules: () => (user ? Object.keys(user.permissions || {}) : []),

    // Get all permissions for a specific module
    getModulePermissions: (module: string): Permission[] => user?.permissions?.[module] || [],
  }
}
