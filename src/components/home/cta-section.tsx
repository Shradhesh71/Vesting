import { ArrowRight, Github, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Secure Your Token Distribution?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of projects using Vestify to build trust and ensure sustainable growth through transparent token
          vesting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-lg px-8 py-4"
          >
            Start Vesting Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4 bg-transparent"
          >
            <BookOpen className="mr-2 w-5 h-5" />
            Read Documentation
          </Button>
        </div>

        <div className="flex justify-center items-center space-x-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>Open Source</span>
          </div>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <span>Audited by CertiK</span>
          <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          <span>Built on Solana</span>
        </div>
      </div>
    </section>
  )
}
