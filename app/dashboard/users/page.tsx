import { redirect } from "next/navigation"
import { UserTable } from "@/components/user-table"
import { getCurrentUser } from "@/lib/auth"

export default async function UsersPage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/")
  }

  // Only admins and fleet managers can access this page
  if (user.role !== "Admin" && user.role !== "FleetManager") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-gray-500">Manage system users and their permissions</p>
      </div>

      <UserTable />
    </div>
  )
}
