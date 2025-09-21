"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const { login, signup } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">FMCG Analytics</CardTitle>
          <CardDescription>Login or create an account to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={login} className="w-full">
            Login with Cognito
          </Button>
          <Button onClick={signup} className="w-full" variant="outline">
            Sign Up with Cognito
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
