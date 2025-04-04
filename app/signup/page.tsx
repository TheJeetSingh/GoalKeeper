"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Target, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showExistingAccountDialog, setShowExistingAccountDialog] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
      })
      return
    }

    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name is required",
        description: "Please enter your name.",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Your password must be at least 6 characters long.",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.error.includes('already exists')) {
          // Show the alert dialog instead of a toast
          setShowExistingAccountDialog(true)
        } else {
          toast({
            variant: "destructive",
            title: "Signup failed",
            description: data.error || "There was an error creating your account. Please try again.",
          })
        }
        setIsLoading(false)
        return
      }

      toast({
        title: `Welcome, ${formData.name}!`,
        description: "You've successfully signed up for GoalKeeper.",
      })

      // Sign in automatically after successful signup
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: "/dashboard"
      })

      if (signInResult?.error) {
        console.error('Auto-login failed:', signInResult.error)
        router.push('/login')
      } else if (signInResult?.url) {
        router.push(signInResult.url)
      } else {
        router.push('/dashboard')
      }

    } catch (error) {
      console.error('Signup error:', error)
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was an error creating your account. Please try again.",
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

      {/* Alert Dialog for Existing Account */}
      <AlertDialog open={showExistingAccountDialog} onOpenChange={setShowExistingAccountDialog}>
        <AlertDialogContent className="border border-white/10 bg-gray-900/90 backdrop-blur-sm text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Account Already Exists
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 text-blue-100/70">
              <p className="mb-4">An account with this email address ({formData.email}) already exists.</p>
              <p>Would you like to sign in with this email or use a different one?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel
              onClick={() => {
                setFormData(prev => ({ ...prev, email: '' }))
                setShowExistingAccountDialog(false)
              }}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              Use Different Email
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                router.push('/login')
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0"
            >
              Sign In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container relative z-10 flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md border border-white/10 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Create an account
            </CardTitle>
            <CardDescription className="text-blue-100/70">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-white/70">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/30"
                  />
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
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
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-blue-100/70">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline transition-colors">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

