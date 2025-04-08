"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { updateUser } from "@/lib/actions"
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters."),
  last_name: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  mobile_no: z.string().min(10, "Please enter a valid phone number."),
  role_profile: z.string().min(1, "Please select a role profile."),
  department: z.string().optional(),
  enabled: z.boolean().default(true),
})

type UserData = {
  name: string
  first_name: string
  last_name: string
  email: string
  mobile_no?: string
  role_profile?: string
  department?: string
  enabled: number
}

export function EditUserForm({ userId, userData }: { userId: string; userData: UserData }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      email: userData.email || "",
      mobile_no: userData.mobile_no || "",
      role_profile: userData.role_profile || "",
      department: userData.department || "",
      enabled: userData.enabled === 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      const result = await updateUser(userId, values)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      toast({
        title: "User updated successfully",
        description: "The user information has been updated.",
      })

      router.push("/dashboard/users")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating the user.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-blue-100">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit User</h2>
          <Button variant="outline" asChild>
            <Link href="/dashboard/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>

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
                        <SelectItem value="Inventory">Inventory</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Accounts">Accounts</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Purchase">Purchase</SelectItem>
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
                        <SelectItem value="All Departments">All Departments</SelectItem>
                        <SelectItem value="Accounts">Accounts</SelectItem>
                        <SelectItem value="Customer Service">Customer Service</SelectItem>
                        <SelectItem value="Dispatch">Dispatch</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Purchase">Purchase</SelectItem>
                        <SelectItem value="Quality Management">Quality Management</SelectItem>
                        <SelectItem value="Research & Development">Research & Development</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
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
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
