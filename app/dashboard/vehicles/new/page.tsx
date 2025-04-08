import { redirect } from "next/navigation"
import { NewVehicleForm } from "@/components/new-vehicle-form"
import { getCurrentUser } from "@/lib/auth"

export default async function NewVehiclePage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/")
  }

  // Only admins can create vehicles
  if (user.role !== "Admin") {
    redirect("/dashboard/vehicles")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Vehicle</h1>
        <p className="text-gray-500">Add a new vehicle to the fleet</p>
      </div>

      <NewVehicleForm />
    </div>
  )
}
