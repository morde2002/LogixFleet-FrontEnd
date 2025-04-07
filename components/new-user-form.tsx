"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { createUser, fetchRoleProfiles, fetchDepartments } from "@/lib/actions"
import { Loader2, ListFilter, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters."),
  last_name: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  mobile_no: z.string().min(10, "Please enter a valid phone number."),
  role_profile: z.string().min(1, "Please select a role profile."),
  department: z.string().optional(),
  send_welcome_email: z.boolean().default(true),
  enabled: z.boolean().default(true),
})

type RoleProfile = {
  name: string
  role_profile?: string
}

type Department = {
  name: string
  department_name?: string
}

export function NewUserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roleProfiles, setRoleProfiles] = useState<RoleProfile[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true)
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_no: "",
      role_profile: "",
      department: "",
      send_welcome_email: true,
      enabled: true,
    },
  })

  useEffect(() => {
    const loadRoleProfiles = async () => {
      try {
        setIsLoadingProfiles(true)
        const result = await fetchRoleProfiles()

        if (result.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
          })
          return
        }

        if (result.data) {
          setRoleProfiles(result.data)
        }
      } catch (error) {
        console.error("Error loading role profiles:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load role profiles. Please try again.",
        })
      } finally {
        setIsLoadingProfiles(false)
      }
    }

    const loadDepartments = async () => {
      try {
        setIsLoadingDepartments(true)
        const result = await fetchDepartments()

        if (result.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
          })
          return
        }

        if (result.data) {
          setDepartments(result.data)
        }
      } catch (error) {
        console.error("Error loading departments:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load departments. Please try again.",
        })
      } finally {
        setIsLoadingDepartments(false)
      }
    }

    loadRoleProfiles()
    loadDepartments()
  }, [toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setError(null)

      // Generate a secure password
      const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + "1!"

      console.log("Submitting form with values:", values)
      console.log("Generated password:", password)

      const result = await createUser({
        ...values,
        new_password: password,
      })

      if (result.error) {
        setError(result.error)
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      toast({
        title: "User created successfully",
        description: "A welcome email has been sent to the user.",
      })

      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error("Form submission error:", error)
      setError("An error occurred while creating the user.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the user.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = isLoadingProfiles || isLoadingDepartments

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-500">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-blue-100">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New User</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Profile</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role profile" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleProfiles.map((profile) => (
                          <SelectItem key={profile.name} value={profile.name}>
                            {profile.role_profile || profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>This determines what permissions the user will have.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.name} value={dept.name}>
                            {dept.department_name || dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="send_welcome_email"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send Welcome Email</FormLabel>
                      <FormDescription>Send an email with login instructions to the user.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable User</FormLabel>
                      <FormDescription>Allow this user to log in to the system.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/users")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      {isSuccess && (
        <CardFooter className="bg-gray-50 border-t border-gray-100 p-4">
          <div className="flex w-full justify-between items-center">
            <p className="text-sm text-green-600">User created successfully!</p>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/dashboard/users">
                <ListFilter className="h-4 w-4" />
                Show Users List
              </Link>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

