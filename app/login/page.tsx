"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Target } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Get the callback URL from the search params
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: callbackUrl,
      })

      if (result?.error) {
        // Handle specific error cases
        if (result.error.includes("No account found")) {
          toast({
            variant: "destructive",
            title: "Account not found",
            description: (
              <div className="flex flex-col gap-2">
                <p>No account found with this email address.</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/signup')}
                    className="h-8"
                  >
                    Create account
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, email: '' }))}
                    className="h-8"
                  >
                    Try different email
                  </Button>
                </div>
              </div>
            ),
          })
        } else if (result.error.includes("Incorrect password")) {
          toast({
            variant: "destructive",
            title: "Incorrect password",
            description: (
              <div className="flex flex-col gap-2">
                <p>The password you entered is incorrect.</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, password: '' }))}
                    className="h-8"
                  >
                    Try again
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/forgot-password')}
                    className="h-8"
                  >
                    Reset password
                  </Button>
                </div>
              </div>
            ),
          })
        } else {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: result.error,
          })
        }
        setIsLoading(false)
        return
      }

      if (result?.url) {
        router.push(result.url)
      } else {
        router.push(callbackUrl)
      }
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      })
    } catch (error) {
      console.error('Login error:', error)
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was an error logging in. Please try again.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <div className="relative flex items-center gap-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm" />
          <Target className="h-6 w-6 relative" />
          <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            GoalKeeper
          </span>
        </div>
      </Link>

      <div className="container relative z-10 flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md border border-white/10 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-blue-100/70">
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-white/70">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-white/70">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 transition-all duration-300"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-blue-100/70">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 text-white flex items-center justify-center">
        Loading...
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

