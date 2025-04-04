import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Target, CheckCircle, Clock, Users, TrendingUp, Calendar } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-blue-950"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300">
              <Target className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              GoalKeeper
            </span>
          </Link>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <section className="mb-20">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Features
          </h1>
          <p className="text-xl mb-8 text-blue-100/80 max-w-2xl">
            Everything you need to achieve your goals and stay accountable to your commitments.
          </p>
        </section>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="h-8 w-8" />,
              title: "Smart Goal Setting",
              description: "Set SMART goals with clear outcomes, milestones, and deadlines. Break down big goals into manageable steps."
            },
            {
              icon: <CheckCircle className="h-8 w-8" />,
              title: "Commitment Tracking",
              description: "Track your daily commitments and build consistent habits. Get insights into your progress and patterns."
            },
            {
              icon: <Clock className="h-8 w-8" />,
              title: "Intelligent Reminders",
              description: "Receive personalized reminders and notifications to stay on track. Never miss an important deadline."
            },
            {
              icon: <TrendingUp className="h-8 w-8" />,
              title: "Progress Analytics",
              description: "Visualize your progress with beautiful charts and analytics. Identify trends and areas for improvement."
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "Team Goals",
              description: "Collaborate on shared goals with your team. Track collective progress and individual contributions."
            },
            {
              icon: <Calendar className="h-8 w-8" />,
              title: "Calendar Integration",
              description: "Seamlessly integrate your goals and commitments with your calendar. Plan your time effectively."
            }
          ].map((feature, i) => (
            <div key={i} className="group relative">
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

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Ready to achieve your goals?
          </h2>
          <p className="text-xl mb-8 text-blue-100/80">
            Join GoalKeeper today and start turning your aspirations into achievements.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-lg px-8 py-6 h-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-white border-white/20 hover:border-white hover:bg-white/10 text-lg px-8 py-6 h-auto backdrop-blur-sm">
                Sign In
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
} 