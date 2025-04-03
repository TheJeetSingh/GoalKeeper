"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

export default function NewCommitmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    title: "",
    goalId: "",
    description: "",
    frequency: "daily",
    reminder: true,
    reminderTime: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.goalId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsLoading(true)

    try {
      // This would be replaced with actual commitment creation logic
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Commitment created!",
        description: "Your new commitment has been created successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was an error creating your commitment. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Commitment</h1>
        <p className="text-muted-foreground">Add a new commitment to help you achieve your goals.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commitment Details</CardTitle>
          <CardDescription>Enter the details of your new commitment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="new-commitment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Commitment Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Morning run"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goalId">Related Goal</Label>
                <Select
                  value={formData.goalId}
                  onValueChange={(value) => handleSelectChange("goalId", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="goalId">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Run a marathon</SelectItem>
                    <SelectItem value="2">Learn Spanish</SelectItem>
                    <SelectItem value="3">Read 20 books</SelectItem>
                    <SelectItem value="4">Launch side project</SelectItem>
                    <SelectItem value="5">Save for vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your commitment"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => handleSelectChange("frequency", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reminder">Set Reminder</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for this commitment</p>
                </div>
                <Switch
                  id="reminder"
                  checked={formData.reminder}
                  onCheckedChange={(checked) => handleSwitchChange("reminder", checked)}
                  disabled={isLoading}
                />
              </div>
              {formData.reminder && (
                <div className="grid gap-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reminderTime"
                      name="reminderTime"
                      type="time"
                      value={formData.reminderTime}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="new-commitment-form" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Commitment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

