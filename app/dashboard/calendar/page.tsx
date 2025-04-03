"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Plus } from "lucide-react"
import { format } from "date-fns"

interface Commitment {
  id: string
  title: string
  time: string
  goalTitle: string
  completed: boolean
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [commitments, setCommitments] = useState<Commitment[]>([])

  useEffect(() => {
    // TODO: Fetch actual commitments from the API
    // This is mock data for now
    setCommitments([
      {
        id: "1",
        title: "Morning run",
        time: "6:00 AM",
        goalTitle: "Run a marathon",
        completed: false,
      },
      {
        id: "2",
        title: "Spanish lesson",
        time: "9:00 AM",
        goalTitle: "Learn Spanish",
        completed: false,
      },
      {
        id: "3",
        title: "Project meeting",
        time: "2:00 PM",
        goalTitle: "Launch side project",
        completed: false,
      },
    ])
  }, [date])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Manage your commitments and schedule
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <Select value={view} onValueChange={(value: "day" | "week" | "month") => setView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {format(date, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Commitments</CardTitle>
              <Link href="/dashboard/commitments/new">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Commitment
                </Button>
              </Link>
            </div>
            <CardDescription>
              {format(date, "EEEE, MMMM do, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commitments.length === 0 ? (
                <p className="text-center text-muted-foreground">No commitments scheduled for this day</p>
              ) : (
                commitments.map((commitment) => (
                  <div
                    key={commitment.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{commitment.time}</span>
                      </div>
                      <p className="font-medium">{commitment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Goal: {commitment.goalTitle}
                      </p>
                    </div>
                    <Button
                      variant={commitment.completed ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        // TODO: Implement completion toggle
                      }}
                    >
                      {commitment.completed ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 