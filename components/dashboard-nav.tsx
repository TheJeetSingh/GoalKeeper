"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Calendar, ChevronDown, LogOut, Menu, Settings, Target, TrendingUp, Users } from "lucide-react"
import { NotificationsPopover } from "@/components/notifications-popover"

export function DashboardNav() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string }>()

  useEffect(() => {
    const fetchUser = async () => {
      if (status !== 'authenticated') return

      try {
        const response = await fetch('/api/profile', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) throw new Error('Failed to fetch profile')
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }
    fetchUser()
  }, [status])

  // Get user's initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Target className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/goals",
      label: "Goals",
      icon: <TrendingUp className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/teams",
      label: "Teams",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/20 bg-black/30 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px] bg-black/95 border-gray-800/30 backdrop-blur-xl">
              <nav className="flex flex-col gap-4 py-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === route.href 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20" 
                        : "hover:bg-white/10"
                    }`}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">GoalKeeper</span>
          </div>
          <nav className="hidden md:flex md:gap-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === route.href 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20" 
                    : "hover:bg-white/10"
                }`}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsPopover />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/10">
                <Avatar className="h-8 w-8 ring-2 ring-blue-500/50">
                  <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-flex bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-medium">
                  {user?.name || "Loading..."}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/95 border-gray-800/30 backdrop-blur-xl">
              <DropdownMenuLabel className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-800/30" />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="hover:bg-white/10 cursor-pointer">
                  <Avatar className="mr-2 h-4 w-4">
                    <AvatarImage src={user?.avatar || "/placeholder.svg?height=16&width=16"} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="hover:bg-white/10 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800/30" />
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-white/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

