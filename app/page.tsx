import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import LoginForm from "@/components/login-form"

export default async function Home() {
  const user = await getCurrentUser()

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <img src="/images/logixlogo.png" alt="LogixFleet Logo" className="h-24" />
          </div>
          <p className="text-gray-600">Enter your credentials to sign in</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
