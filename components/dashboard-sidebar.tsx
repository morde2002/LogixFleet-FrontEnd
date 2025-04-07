"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LogOut,
  Home,
  Users,
  Car,
  User,
  FileText,
  Shield,
  PenToolIcon as Tool,
  Calendar,
  ChevronDown,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type SidebarUser = {
  id: string
  name: string
  email: string
  role: string
  permissions?: string[]
}

export default function DashboardSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname()

  // Define which routes are accessible based on user role
  // Ensure these specific users always have admin access
  const isSpecialAdmin =
    user.email?.toLowerCase() === "yesnow@example.com" || user.email?.toLowerCase() === "leofleet@gmail.com"
  const canAccessUsers = isSpecialAdmin || user.role === "Admin" || user.role === "FleetManager"
  const canManageVehicles = isSpecialAdmin || user.role === "Admin" || user.role === "FleetManager"
  const canAccessVehicles = isSpecialAdmin || user.role === "Admin" || user.role === "FleetManager"
  const canAccessDrivers = true // All users can view drivers
  const canManageDrivers = isSpecialAdmin || user.role === "Admin" || user.role === "FleetManager"

  return (
    <>
      <Sidebar variant="floating" className="border-r border-gray-200">
        <SidebarHeader className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <img src="/images/logixlogo.png" alt="LogixFleet Logo" className="h-10" />
          </div>
        </SidebarHeader>
        <SidebarContent className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard">
                  <Home className="mr-2 h-5 w-5" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {canAccessUsers && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/users")}>
                  <Link href="/dashboard/users">
                    <Users className="mr-2 h-5 w-5" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {canAccessVehicles && (
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={pathname.startsWith("/dashboard/vehicles")}>
                      <Car className="mr-2 h-5 w-5" />
                      <span>Vehicles</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenu className="ml-6 mt-1">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/vehicles"}>
                        <Link href="/dashboard/vehicles">
                          <span>All Vehicles</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/vehicles/inspections"}>
                        <Link href="/dashboard/vehicles/inspections">
                          <span>Inspections</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/vehicles/insurance"}>
                        <Link href="/dashboard/vehicles/insurance">
                          <span>Insurance</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/vehicles/service"}>
                        <Link href="/dashboard/vehicles/service">
                          <span>Service</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            )}

            {canAccessDrivers && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/drivers")}>
                  <Link href="/dashboard/drivers">
                    <User className="mr-2 h-5 w-5" />
                    <span>Drivers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <Collapsible>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={pathname.startsWith("/dashboard/reports")}>
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Reports</span>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenu className="ml-6 mt-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard/reports/vehicles"}>
                      <Link href="/dashboard/reports/vehicles">
                        <span>Vehicle Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard/reports/drivers"}>
                      <Link href="/dashboard/reports/drivers">
                        <span>Driver Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/maintenance")}>
                <Link href="/dashboard/maintenance">
                  <Tool className="mr-2 h-5 w-5" />
                  <span>Maintenance</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/schedule")}>
                <Link href="/dashboard/schedule">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>Schedule</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user.role === "Admin" && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/dashboard/settings")}>
                  <Link href="/dashboard/settings">
                    <Shield className="mr-2 h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-2">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
            <form action={logout}>
              <Button
                type="submit"
                variant="outline"
                className="w-full flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile trigger */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <SidebarTrigger className="bg-white shadow-md rounded-md" />
      </div>
    </>
  )
}

