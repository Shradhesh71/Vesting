import { ArrowRight } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Create Vesting Contract",
      description: "Set up your token vesting parameters including schedules, cliffs, and beneficiaries",
    },
    {
      number: "02",
      title: "Deposit Tokens",
      description: "Securely deposit your tokens into the smart contract for automated distribution",
    },
    {
      number: "03",
      title: "Automated Release",
      description: "Tokens are automatically released according to your predefined schedule",
    },
    {
      number: "04",
      title: "Track & Monitor",
      description: "Monitor progress and track all vesting activities through our dashboard",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How Vestify Works</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Simple, secure, and transparent token vesting in four easy steps
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="relative z-10 bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-purple-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
