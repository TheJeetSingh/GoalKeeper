import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Target, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6" />
          <span className="text-xl font-bold">GoalKeeper</span>
        </div>
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">Sign up</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Track Your Goals, Keep Your Commitments</h1>
          <p className="text-lg mb-6">GoalKeeper helps you set meaningful goals, break them down into actionable commitments, and track your progress over time.</p>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" className="text-white border-white hover:bg-white/10">Learn More</Button>
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">My Goals</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Run a marathon</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Learn Spanish</span>
                <span>40%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Read 20 books</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8">Features</h2>
          <p className="text-lg mb-8">Everything you need to achieve your goals and stay accountable</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-white/20 rounded-lg p-6">
              <Target className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Goal Setting</h3>
              <p>Set specific, measurable goals with clear outcomes and milestones</p>
            </div>
            <div className="border border-white/20 rounded-lg p-6">
              <CheckCircle className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Commitment Tracking</h3>
              <p>Break goals into actionable commitments and track your progress</p>
            </div>
            <div className="border border-white/20 rounded-lg p-6">
              <Clock className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
              <p>Get timely notifications to stay on track with your commitments</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 