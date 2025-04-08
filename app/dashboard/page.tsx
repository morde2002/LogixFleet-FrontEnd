import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Calendar, FileText, Users } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  // Define which actions are accessible based on user role
  const canManageUsers = user?.role === "Admin" || user?.role === "FleetManager"
  const canManageVehicles = user?.role === "Admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Maintenance Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm">Vehicle #{i} completed maintenance</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                asChild={canManageVehicles}
                disabled={!canManageVehicles}
              >
                {canManageVehicles ? (
                  <Link href="/dashboard/vehicles/new">
                    <Car className="h-6 w-6 mb-1" />
                    <span>Add Vehicle</span>
                  </Link>
                ) : (
                  <>
                    <Car className="h-6 w-6 mb-1" />
                    <span>Add Vehicle</span>
                  </>
                )}
              </Button>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center" asChild>
                <Link href="/dashboard/schedule">
                  <Calendar className="h-6 w-6 mb-1" />
                  <span>Schedule</span>
                </Link>
              </Button>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center" asChild>
                <Link href="/dashboard/reports">
                  <FileText className="h-6 w-6 mb-1" />
                  <span>Reports</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                asChild={canManageUsers}
                disabled={!canManageUsers}
              >
                {canManageUsers ? (
                  <Link href="/dashboard/users/new">
                    <Users className="h-6 w-6 mb-1" />
                    <span>Add User</span>
                  </Link>
                ) : (
                  <>
                    <Users className="h-6 w-6 mb-1" />
                    <span>Add User</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
