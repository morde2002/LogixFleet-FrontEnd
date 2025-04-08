"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MoreHorizontal, Search, Loader2, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RestrictedButton } from "@/components/restricted-button"
import { PermissionGate } from "@/components/permission-gate"
import { fetchVehicles } from "@/lib/api"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const { toast } = useToast()

  // Fetch vehicles from API
  const loadVehicles = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const response = await fetchVehicles()

      if (response.data) {
        setVehicles(response.data)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vehicles. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error loading vehicles:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load vehicles. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleRefresh = () => {
    loadVehicles(true)
  }

  // Get unique vehicle types for filter
  const vehicleTypes = Array.from(new Set(vehicles.map((v) => v.vehicle_type))).filter(Boolean)

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.color?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" ? true : vehicle.vehicle_type === typeFilter
    const matchesStatus = statusFilter === "all" ? true : vehicle.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["License Plate", "Make", "Model", "Type", "Year", "Color", "Fuel Type", "Status", "Driver"]
    const csvContent = [
      headers.join(","),
      ...filteredVehicles.map((vehicle) =>
        [
          vehicle.license_plate,
          vehicle.make,
          vehicle.model,
          vehicle.vehicle_type,
          vehicle.year,
          vehicle.color,
          vehicle.fuel_type,
          vehicle.status || "Active",
          vehicle.driver || "Unassigned",
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "vehicles.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <p className="text-gray-500">Manage your fleet vehicles</p>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} title="Refresh">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <RestrictedButton
            docType="Vehicle"
            permission="create"
            onClick={() => router.push("/dashboard/vehicles/new")}
            className="bg-blue-600 hover:bg-blue-700"
            fallbackMessage="You don't have permission to create vehicles"
            showAlert={true}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </RestrictedButton>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>License Plate</TableHead>
              <TableHead>Make/Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.name || vehicle.license_plate}>
                  <TableCell className="font-medium">{vehicle.license_plate}</TableCell>
                  <TableCell>
                    {vehicle.make} {vehicle.model}
                  </TableCell>
                  <TableCell>{vehicle.vehicle_type}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        vehicle.status === "Active" || !vehicle.status
                          ? "bg-green-100 text-green-800"
                          : vehicle.status === "Maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vehicle.status || "Active"}
                    </span>
                  </TableCell>
                  <TableCell>{vehicle.driver || "Unassigned"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <PermissionGate docType="Vehicle" permission="read">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/${vehicle.name}`)}>
                            View Details
                          </DropdownMenuItem>
                        </PermissionGate>

                        <PermissionGate docType="Vehicle" permission="write">
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/vehicles/edit/${vehicle.name}`)}>
                            Edit
                          </DropdownMenuItem>
                        </PermissionGate>

                        <PermissionGate docType="Vehicle Service" permission="create">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/vehicles/service/new?vehicle=${vehicle.name}`)}
                          >
                            Schedule Service
                          </DropdownMenuItem>
                        </PermissionGate>

                        <PermissionGate docType="Vehicle Inspection" permission="create">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/vehicles/inspections/new?vehicle=${vehicle.name}`)}
                          >
                            Record Inspection
                          </DropdownMenuItem>
                        </PermissionGate>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
