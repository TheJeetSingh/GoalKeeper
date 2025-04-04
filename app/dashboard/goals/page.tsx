import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Filter, Plus, Search, Target } from "lucide-react"

export default function GoalsPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Goals
        </h1>
        <p className="text-gray-400">Manage and track your personal and team goals.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            type="search" 
            placeholder="Search goals..." 
            className="h-9 bg-black/40 border-gray-800/30 text-gray-400 placeholder:text-gray-500 focus:ring-blue-500/20 focus:border-blue-500/20" 
          />
          <Button size="sm" variant="ghost" className="hover:bg-white/10 text-gray-400 hover:text-white">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-gray-800/30 hover:bg-white/10 text-gray-400 hover:text-white">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Link href="/dashboard/goals/new">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-black/40 border border-gray-800/30 backdrop-blur-xl">
          <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            All Goals
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Completed
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Team Goals
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Run a marathon",
                category: "Health",
                progress: 65,
                dueDate: "Dec 15, 2023",
                commitments: 8,
                completed: 5,
              },
              {
                title: "Learn Spanish",
                category: "Education",
                progress: 40,
                dueDate: "Ongoing",
                commitments: 12,
                completed: 5,
              },
              {
                title: "Read 20 books",
                category: "Personal",
                progress: 25,
                dueDate: "Dec 31, 2023",
                commitments: 20,
                completed: 5,
              },
              {
                title: "Launch side project",
                category: "Career",
                progress: 80,
                dueDate: "Nov 30, 2023",
                commitments: 15,
                completed: 12,
              },
              {
                title: "Save for vacation",
                category: "Finance",
                progress: 50,
                dueDate: "Mar 1, 2024",
                commitments: 10,
                completed: 5,
              },
              {
                title: "Improve cooking skills",
                category: "Personal",
                progress: 60,
                dueDate: "Ongoing",
                commitments: 8,
                completed: 5,
              },
              {
                title: "Complete home renovation",
                category: "Home",
                progress: 30,
                dueDate: "Feb 28, 2024",
                commitments: 12,
                completed: 4,
              },
            ].map((goal, i) => (
              <Card key={i} className="bg-black/40 border-gray-800/30 backdrop-blur-xl hover:bg-black/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                      {goal.title}
                    </CardTitle>
                    <span className="rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-2 py-1 text-xs font-medium text-blue-400">
                      {goal.category}
                    </span>
                  </div>
                  <CardDescription className="text-gray-400">Due: {goal.dueDate}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-sm font-medium text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-400">{goal.progress}%</span>
                  </div>
                  <Progress 
                    value={goal.progress} 
                    className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-purple-600 bg-gray-800" 
                  />
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <Target className="mr-1 h-4 w-4 text-blue-400" />
                      <span>{goal.commitments} commitments</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-1 h-4 w-4 text-blue-400" />
                      <span>{goal.completed} completed</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/dashboard/goals/${i}`} className="w-full">
                    <Button variant="outline" className="w-full border-gray-800/30 hover:bg-white/10 text-gray-400 hover:text-white">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Active goals would be filtered here */}</div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Completed goals would be filtered here */}</div>
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Team goals would be filtered here */}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

