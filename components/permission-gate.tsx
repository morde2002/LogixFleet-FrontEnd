"use client"

import type { ReactNode } from "react"
import { usePermissions } from "@/hooks/use-permissions"
import type { Permission } from "@/contexts/auth-context"

interface PermissionGateProps {
  docType: string
  permission: Permission | Permission[]
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ docType, permission, fallback = null, children }: PermissionGateProps) {
  const { hasPermission, hasAnyPermission } = usePermissions()

  const hasAccess = Array.isArray(permission)
    ? hasAnyPermission(docType, permission)
    : hasPermission(docType, permission)

  if (!hasAccess) return <>{fallback}</>

  return <>{children}</>
}
