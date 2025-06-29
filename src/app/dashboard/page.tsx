"use client"

import { Navigation } from "@/components/home/navigation"
import { Footer } from "@/components/home/footer"
import { CompanySelector } from "@/components/company/company-selector"
import { MetricsCard } from "@/components/dashboard/metrics-card"
import { VestingChart } from "@/components/dashboard/vesting-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { useCompany } from "@/contexts/company-context"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Clock, DollarSign, Plus, List } from "lucide-react"
import Link from "next/link"
import { useVestingProgram } from "@/components/vesting/vesting-data-access"

export default function DashboardPage() {
  const { selectedCompany } = useCompany()
  const { getCompanyMetrics, isLoading } = useVestingProgram()

  const metrics = selectedCompany ? getCompanyMetrics(selectedCompany.publicKey.toString()) : null

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent"></div>
        </div>

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Vesting Dashboard</h1>
              <p className="text-gray-400">Monitor and manage your token vesting programs</p>
            </div>
            {selectedCompany && (
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <Link href="/employees">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                    <List className="w-4 h-4 mr-2" />
                    View Employees
                  </Button>
                </Link>
                <Link href="/employees/create">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Company Selector */}
          <div className="mb-8">
            <CompanySelector />
          </div>

          {selectedCompany && metrics && (
            <>
              {/* Company Header */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedCompany.companyName}</h2>
                <p className="text-gray-400">Company vesting overview and employee management</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricsCard
                  title="Total Employees"
                  value={metrics.totalEmployees}
                  subtitle="Active vesting accounts"
                  icon={Users}
                  isLoading={isLoading}
                />
                <MetricsCard
                  title="Tokens Vested"
                  value={metrics.totalTokensVested}
                  subtitle="Released to employees"
                  icon={TrendingUp}
                  trend={{ value: 0, isPositive: true }}
                  isLoading={isLoading}
                />
                <MetricsCard
                  title="Active Schedules"
                  value={metrics.activeSchedules}
                  subtitle="Currently vesting"
                  icon={Clock}
                  isLoading={isLoading}
                />
                <MetricsCard
                  title="Total Value Locked"
                  value={metrics.totalValueLocked}
                  subtitle="USD equivalent"
                  icon={DollarSign}
                  trend={{ value: 8.2, isPositive: true }}
                  isLoading={isLoading}
                />
              </div>

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <VestingChart isLoading={isLoading} />
                <RecentActivity isLoading={isLoading} />
              </div>
            </>
          )}

          {!selectedCompany && !isLoading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a Company to Get Started</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Choose a company from the selector above to view detailed metrics, manage employees, and track vesting
                progress.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
