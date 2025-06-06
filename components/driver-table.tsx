"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table-with-fixed-header"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MoreHorizontal, Search, Loader2, Download, RefreshCw, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/use-current-user"
import { fetchDrivers } from "@/lib/actions"
import { PermissionGate } from "@/components/permission-gate"
import { RestrictedButton } from "@/components/restricted-button"

type Driver = {
  name: string
  first_name: string
  last_name: string
  email: string
  cell_number: string
  country: string
  national_id: string
  start_date: string
  end_date: string
  status: string
  vehicle?: string
  vehicle_name?: string
}

export function DriverTable() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()
  const { toast } = useToast()
  const currentUser = useCurrentUser()

  const loadDrivers = async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const result = await fetchDrivers()

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      if (result.data) {
        setDrivers(result.data)
      }
    } catch (error) {
      console.error("Error loading drivers:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load drivers. Please try again.",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadDrivers()
  }, [toast])

  const handleRefresh = () => {
    router.refresh()
  }

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.cell_number?.includes(searchTerm) ||
      driver.national_id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" ? true : driver.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const canManageDrivers = currentUser?.role === "Admin" || currentUser?.role === "FleetManager"

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Country", "National ID", "Start Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...filteredDrivers.map((driver) =>
        [
          `${driver.first_name} ${driver.last_name}`,
          driver.email,
          driver.cell_number,
          driver.country || "N/A",
          driver.national_id || "N/A",
          driver.start_date || "N/A",
          driver.status,
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "drivers.csv")
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
          <p className="text-sm text-gray-500">Loading drivers...</p>
        </div>
      </div>
    )
  }

  return (
    <PermissionGate docType="Driver" permission="read" showAlert={true}>
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
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
              docType="Driver"
              permission="create"
              onClick={() => router.push("/dashboard/drivers/new")}
              className="bg-blue-600 hover:bg-blue-700"
              fallbackMessage="You don't have permission to create drivers"
              showAlert={true}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Driver
            </RestrictedButton>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="table-scroll-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Vehicle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <TableRow key={driver.name}>
                      <TableCell className="font-medium">
                        {driver.first_name} {driver.last_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{driver.email}</span>
                          <span className="text-xs text-gray-500">{driver.cell_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">ID: {driver.national_id || "N/A"}</span>
                          <span className="text-xs text-gray-500">
                            Started: {driver.start_date ? new Date(driver.start_date).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            driver.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : driver.status === "On Leave"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {driver.status}
                        </span>
                      </TableCell>
                      <TableCell>{driver.vehicle_name || "Unassigned"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <PermissionGate
                              docType="Driver"
                              permission="read"
                              fallback={
                                <DropdownMenuItem
                                  className="text-orange-500"
                                  onClick={() =>
                                    toast({
                                      variant: "destructive",
                                      title: "Access Denied",
                                      description: "You don't have permission to view driver details",
                                    })
                                  }
                                >
                                  <Lock className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              }
                            >
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/drivers/${driver.name}`)}>
                                View Details
                              </DropdownMenuItem>
                            </PermissionGate>

                            <PermissionGate
                              docType="Driver"
                              permission="write"
                              fallback={
                                <DropdownMenuItem
                                  className="text-orange-500"
                                  onClick={() =>
                                    toast({
                                      variant: "destructive",
                                      title: "Access Denied",
                                      description: "You don't have permission to edit drivers",
                                    })
                                  }
                                >
                                  <Lock className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              }
                            >
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/drivers/edit/${driver.name}`)}>
                                Edit
                              </DropdownMenuItem>
                            </PermissionGate>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No drivers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}
