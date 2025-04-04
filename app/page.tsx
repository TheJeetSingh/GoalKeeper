import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Target, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <header className="relative z-10 p-6 flex justify-between items-center backdrop-blur-sm bg-black/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm" />
            <Target className="h-7 w-7 relative" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            GoalKeeper
          </span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline" className="text-white border-white/20 hover:border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 transition-all duration-300">
              Sign up
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-12">
        <section className="mb-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Track Your Goals, Keep Your Commitments
          </h1>
          <p className="text-xl mb-8 text-blue-100/80 max-w-2xl">
            GoalKeeper helps you set meaningful goals, break them down into actionable commitments, and track your progress over time.
          </p>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-lg px-8 py-6 h-auto group transition-all duration-300">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" className="text-white border-white/20 hover:border-white hover:bg-white/10 text-lg px-8 py-6 h-auto backdrop-blur-sm transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">My Goals</h2>
          <div className="space-y-6">
            {[
              { name: "Run a marathon", progress: 65 },
              { name: "Learn Spanish", progress: 40 },
              { name: "Read 20 books", progress: 25 }
            ].map((goal) => (
              <div key={goal.name} className="group hover:scale-[1.02] transition-transform duration-300">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-medium">{goal.name}</span>
                  <span className="text-blue-300">{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm p-[2px]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  >
                    <div className="w-full h-full bg-[rgba(255,255,255,0.2)] rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Features</h2>
          <p className="text-xl mb-12 text-blue-100/80">Everything you need to achieve your goals and stay accountable</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Goal Setting",
                description: "Set specific, measurable goals with clear outcomes and milestones"
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "Commitment Tracking",
                description: "Break goals into actionable commitments and track your progress"
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Smart Reminders",
                description: "Get timely notifications to stay on track with your commitments"
              }
            ].map((feature) => (
              <div key={feature.title} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col h-full bg-gray-900/50 border border-white/10 rounded-xl p-8 backdrop-blur-sm hover:border-white/20 transition duration-300">
                  <div className="p-3 rounded-lg bg-blue-600/10 w-fit mb-4 group-hover:scale-110 transition duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white/90">{feature.title}</h3>
                  <p className="text-blue-100/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
} 