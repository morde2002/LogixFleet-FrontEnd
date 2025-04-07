import { redirect } from "next/navigation"
import { VehicleTable } from "@/components/vehicle-table"
import { getCurrentUser } from "@/lib/auth"

export default async function VehiclesPage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <p className="text-gray-500">Manage fleet vehicles and their assignments</p>
      </div>

      <VehicleTable />
    </div>
  )
}

