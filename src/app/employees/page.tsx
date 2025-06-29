'use client'

import { Navigation } from '@/components/home/navigation'
import { Footer } from '@/components/home/footer'
import { EmployeeTable } from '@/components/employees/employee-table'
import { NoCompanySelected } from '@/components/company/no-company-selected'
import { useCompany } from '@/contexts/company-context'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Download } from 'lucide-react'
import Link from 'next/link'

export default function EmployeesPage() {
  const { selectedCompany } = useCompany()

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <section className="relative pt-24 pb-16 overflow-hidden">
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
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white p-0 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {selectedCompany ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Employee Management</h1>
                  <p className="text-gray-400">
                    Managing employees for <span className="text-purple-400">{selectedCompany.companyName}</span>
                  </p>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Link href="/employees/create">
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Employee
                    </Button>
                  </Link>
                </div>
              </div>

              <EmployeeTable />
            </>
          ) : (
            <NoCompanySelected />
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
