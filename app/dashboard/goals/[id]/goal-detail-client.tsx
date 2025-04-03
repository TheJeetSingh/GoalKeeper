"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Edit, Plus, Share2, Trash2 } from "lucide-react"

interface GoalDetailClientProps {
  id: string
}

export function GoalDetailClient({ id }: GoalDetailClientProps) {
  const [goal] = useState({
    id,
    title: "Run a marathon",
    category: "Health",
    description: "Train and complete a full marathon (26.2 miles) within 4 hours.",
    progress: 65,
    dueDate: "December 15, 2023",
    startDate: "June 1, 2023",
    milestones: [
      { title: "Run 5 miles without stopping", completed: true },
      { title: "Complete a half marathon", completed: true },
      { title: "Run 20 miles in training", completed: false },
      { title: "Register for marathon event", completed: true },
    ],
    commitments: [
      { title: "Morning run (5 miles)", frequency: "3x per week", completed: false },
      { title: "Long run (10+ miles)", frequency: "Every Sunday", completed: false },
      { title: "Strength training", frequency: "2x per week", completed: false },
      { title: "Rest day", frequency: "Every Friday", completed: true },
    ],
    notes: [
      { date: "Oct 15, 2023", content: "Completed my first 15-mile run today. Feeling good about progress." },
      { date: "Sep 30, 2023", content: "Adjusted training schedule to include more rest days." },
    ],
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/goals">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{goal.title}</h1>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
              {goal.category}
            </span>
          </div>
          <p className="text-muted-foreground">{goal.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Overall completion: {goal.progress}%</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={goal.progress} className="h-2" />
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">{goal.startDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Due Date</span>
                <span className="font-medium">{goal.dueDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Milestones</span>
                <span className="font-medium">
                  {goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length} completed
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Commitments</span>
                <span className="font-medium">{goal.commitments.length} active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
            <CardDescription>Key achievements toward your goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goal.milestones.map((milestone, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Checkbox id={`milestone-${i}`} checked={milestone.completed} />
                  <div className="grid gap-1.5">
                    <label
                      htmlFor={`milestone-${i}`}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        milestone.completed ? "line-through opacity-70" : ""
                      }`}
                    >
                      {milestone.title}
                    </label>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="commitments" className="w-full">
        <TabsList>
          <TabsTrigger value="commitments">Commitments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="commitments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Commitments</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Commitment
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {goal.commitments.map((commitment, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{commitment.title}</CardTitle>
                    <Checkbox id={`commitment-${i}`} checked={commitment.completed} />
                  </div>
                  <CardDescription>{commitment.frequency}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>Next: Today, 6:00 AM</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Clock className="mr-1 h-4 w-4" />
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Notes</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Note
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {goal.notes.map((note, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{note.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.content}</p>
                    {i < goal.notes.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Invite Member
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  { name: "John Doe (You)", role: "Owner", avatar: "/placeholder.svg?height=40&width=40" },
                  { name: "Alex Johnson", role: "Collaborator", avatar: "/placeholder.svg?height=40&width=40" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 