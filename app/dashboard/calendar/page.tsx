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
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Calendar
        </h1>
        <p className="text-gray-400">
          Manage your commitments and schedule
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1 bg-black/40 border-gray-800/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Calendar
              </CardTitle>
              <Select value={view} onValueChange={(value: "day" | "week" | "month") => setView(value)}>
                <SelectTrigger className="w-32 bg-black/40 border-gray-800/30 text-gray-400 hover:bg-black/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-gray-800/30 backdrop-blur-xl">
                  <SelectItem value="day" className="text-gray-400 hover:bg-white/10 hover:text-white">Day</SelectItem>
                  <SelectItem value="week" className="text-gray-400 hover:bg-white/10 hover:text-white">Week</SelectItem>
                  <SelectItem value="month" className="text-gray-400 hover:bg-white/10 hover:text-white">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription className="text-gray-400">
              {format(date, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md border border-gray-800/30 bg-black/40 text-gray-400 [&_.rdp-day]:hover:bg-white/10 [&_.rdp-day_button]:text-gray-400 [&_.rdp-day_button:hover]:text-white [&_.rdp-day_button:focus]:bg-white/10 [&_.rdp-day_button:focus]:text-white [&_.rdp-day_button:focus]:border-gray-800/30 [&_.rdp-day_button.rdp-day_selected]:bg-gradient-to-r [&_.rdp-day_button.rdp-day_selected]:from-blue-600 [&_.rdp-day_button.rdp-day_selected]:to-purple-600 [&_.rdp-day_button.rdp-day_selected]:text-white [&_.rdp-nav_button]:text-gray-400 [&_.rdp-nav_button:hover]:bg-white/10 [&_.rdp-nav_button:hover]:text-white [&_.rdp-head_cell]:text-gray-400"
            />
          </CardContent>
        </Card>

        <Card className="flex-1 bg-black/40 border-gray-800/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Commitments
              </CardTitle>
              <Link href="/dashboard/commitments/new">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Commitment
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-400">
              {format(date, "EEEE, MMMM do, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commitments.length === 0 ? (
                <p className="text-center text-gray-400">No commitments scheduled for this day</p>
              ) : (
                commitments.map((commitment) => (
                  <div
                    key={commitment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-800/30 bg-black/40 backdrop-blur-xl p-3 hover:bg-black/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-400">{commitment.time}</span>
                      </div>
                      <p className="font-medium text-white">{commitment.title}</p>
                      <p className="text-sm text-gray-400">
                        Goal: {commitment.goalTitle}
                      </p>
                    </div>
                    <Button
                      variant={commitment.completed ? "ghost" : "default"}
                      size="sm"
                      className={commitment.completed 
                        ? "text-gray-400 hover:text-white hover:bg-white/10" 
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      }
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