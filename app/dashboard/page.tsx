"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, Calendar, FileText, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePermissions } from "@/hooks/use-permissions"
import { PermissionGate } from "@/components/permission-gate"

export default function DashboardPage() {
  const { user } = useAuth()
  const { canCreate, canRead } = usePermissions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name || user?.email.split("@")[0] || "User"}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PermissionGate docType="Vehicle" permission="read">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
            </CardContent>
          </Card>
        </PermissionGate>

        <PermissionGate docType="Driver" permission="read">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">18</div>
            </CardContent>
          </Card>
        </PermissionGate>

        <PermissionGate docType="Vehicle Service" permission="read">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Maintenance Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
            </CardContent>
          </Card>
        </PermissionGate>
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
              <PermissionGate
                docType="Vehicle"
                permission="create"
                fallback={
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center" disabled>
                    <Car className="h-6 w-6 mb-1" />
                    <span>Add Vehicle</span>
                  </Button>
                }
              >
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" asChild>
                  <Link href="/dashboard/vehicles/new">
                    <Car className="h-6 w-6 mb-1" />
                    <span>Add Vehicle</span>
                  </Link>
                </Button>
              </PermissionGate>

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

              <PermissionGate
                docType="Driver"
                permission="create"
                fallback={
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center" disabled>
                    <User className="h-6 w-6 mb-1" />
                    <span>Add Driver</span>
                  </Button>
                }
              >
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center" asChild>
                  <Link href="/dashboard/drivers/new">
                    <User className="h-6 w-6 mb-1" />
                    <span>Add Driver</span>
                  </Link>
                </Button>
              </PermissionGate>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <PermissionGate docType="Vehicle Service" permission="read">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vehicle #{i}</p>
                      <p className="text-sm text-gray-500">Oil Change</p>
                    </div>
                    <div className="text-sm text-gray-500">In {i} days</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PermissionGate>

        <PermissionGate docType="Purchase Order" permission="read">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">PO-{1000 + i}</p>
                      <p className="text-sm text-gray-500">Spare Parts</p>
                    </div>
                    <div className="text-sm text-gray-500">${(i * 100).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PermissionGate>

        <PermissionGate docType="Vehicle Inspection" permission="read">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vehicle #{i}</p>
                      <p className="text-sm text-gray-500">Routine Inspection</p>
                    </div>
                    <div className="text-sm text-gray-500">{i} days ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </PermissionGate>
      </div>
    </div>
  )
}
