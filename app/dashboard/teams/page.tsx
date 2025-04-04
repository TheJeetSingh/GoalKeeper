"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Target, Users } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
}

interface Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
  goals: {
    total: number
    completed: number
  }
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // TODO: Fetch actual teams from the API
    // This is mock data for now
    setTeams([
      {
        id: "1",
        name: "Marketing Team",
        description: "Team focused on growth and user acquisition",
        members: [
          { id: "1", name: "John Doe", role: "Team Lead", avatar: "/placeholder.svg" },
          { id: "2", name: "Jane Smith", role: "Marketing Manager", avatar: "/placeholder.svg" },
          { id: "3", name: "Alex Johnson", role: "Content Writer", avatar: "/placeholder.svg" },
        ],
        goals: {
          total: 12,
          completed: 8,
        },
      },
      {
        id: "2",
        name: "Development Team",
        description: "Core product development team",
        members: [
          { id: "4", name: "Mike Wilson", role: "Tech Lead", avatar: "/placeholder.svg" },
          { id: "5", name: "Sarah Brown", role: "Senior Developer", avatar: "/placeholder.svg" },
        ],
        goals: {
          total: 15,
          completed: 10,
        },
      },
    ])
  }, [])

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Teams
        </h1>
        <p className="text-gray-400">
          Collaborate with others and achieve goals together
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search teams..."
            className="pl-8 bg-black/40 border-gray-800/30 text-gray-400 placeholder:text-gray-500 focus:ring-blue-500/20 focus:border-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredTeams.length === 0 ? (
          <p className="col-span-2 text-center text-gray-400">
            No teams found. Create a new team to get started!
          </p>
        ) : (
          filteredTeams.map((team) => (
            <Card key={team.id} className="bg-black/40 border-gray-800/30 backdrop-blur-xl hover:bg-black/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {team.name}
                </CardTitle>
                <CardDescription className="text-gray-400">{team.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                    <span>Goals Progress</span>
                    <span>
                      {team.goals.completed}/{team.goals.total} completed
                    </span>
                  </div>
                  <Progress
                    value={(team.goals.completed / team.goals.total) * 100}
                    className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-purple-600 bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Team Members
                  </h4>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg border border-gray-800/30 bg-black/40 backdrop-blur-xl p-2 hover:bg-black/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 ring-2 ring-blue-500/50">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">{member.name}</p>
                            <p className="text-xs text-gray-400">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-gray-800/30 hover:bg-white/10 text-gray-400 hover:text-white">
                  <Target className="mr-2 h-4 w-4" />
                  View Team Goals
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 