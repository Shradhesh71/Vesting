'use client'

import { Navigation } from '@/components/home/navigation'
import { Footer } from '@/components/home/footer'
import { LaunchVestingForm } from '@/components/launch/launch-vesting-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LaunchVestingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {/* Hero Section with Background Effects */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background with light from above effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent"></div>
        </div>

        {/* Zigzag pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,20 L20,0 L40,20 L60,0 L80,20 L100,0 L100,100 L0,100 Z" fill="url(#zigzag-gradient)" />
            <defs>
              <linearGradient id="zigzag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white p-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Launch Your
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Vesting Contract
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create secure, automated token vesting schedules with transparent unlock timelines and tamper-proof smart
              contracts.
            </p>
          </div>

          {/* Main Form */}
          <LaunchVestingForm />
        </div>
      </section>

      <Footer />
    </div>
  )
}
