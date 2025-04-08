"use client"

import { usePermissions } from "@/hooks/use-permissions"
import type { Permission } from "@/contexts/auth-context"
import type { ReactNode } from "react"

interface PermissionGateProps {
  module: string
  permission: Permission | Permission[]
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ module, permission, fallback = null, children }: PermissionGateProps) {
  const { hasPermission, hasAnyPermission } = usePermissions()

  const hasAccess = Array.isArray(permission) ? hasAnyPermission(module, permission) : hasPermission(module, permission)

  if (!hasAccess) return <>{fallback}</>

  return <>{children}</>
}
