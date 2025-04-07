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
}

