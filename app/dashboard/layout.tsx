import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    // Server-side auth check
    const user = await getCurrentUser()

    // If user is not logged in, redirect to login page
    if (!user) {
      redirect("/")
    }

    return (
      <div className="min-h-screen bg-white">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar user={user} />
            <div className="flex-1 flex flex-col w-full">
              <TopNavigation />
              <main className="flex-1 p-6 md:p-8">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    )
  } catch (error) {
    console.error("Error in dashboard layout:", error)
    // Fallback to a simple layout if there's an error
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        {children}
      </div>
    )
  }
}
