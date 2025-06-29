import { Calendar, Shield, BarChart3, Clock, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Create custom vesting schedules with cliffs, linear releases, and milestone-based unlocks",
    },
    {
      icon: Shield,
      title: "Audited Smart Contracts",
      description: "Battle-tested contracts audited by leading security firms for maximum protection",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track vesting progress, unlock schedules, and distribution metrics in real-time",
    },
    {
      icon: Clock,
      title: "Automated Releases",
      description: "Set-and-forget automation ensures tokens are released exactly when scheduled",
    },
    {
      icon: Users,
      title: "Multi-party Management",
      description: "Manage different stakeholder groups with unique vesting terms and conditions",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built on Solana for instant transactions and minimal fees",
    },
  ]

  return (
    <section id="features" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features for Token Vesting</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to manage secure, transparent, and automated token distribution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
