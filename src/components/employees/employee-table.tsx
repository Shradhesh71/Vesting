"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSkeleton } from "@/components/launch/loading-skeleton"
import { ellipsify } from "@/utils/ellipsify"
import { Search, ArrowUpDown, Eye, MoreHorizontal, Calendar } from "lucide-react"
import { ExplorerLink } from "../cluster/cluster-ui"
import { useVestingProgram } from "../vesting/vesting-data-access"
import { PublicKey } from "@solana/web3.js"

interface FormattedEmployeeAccount {
  id: string;
  publicKey: PublicKey;
  beneficiaryAddress: string;
  startTime: Date;
  endTime: Date;
  cliffTime: Date;
  totalAmount: number;
  vestedAmount: number;
  status: 'active' | 'completed' | 'pending' | 'paused';
  vestingAccount: PublicKey;
}

export function EmployeeTable() {
  const { employeeAccounts } = useVestingProgram()
  const isLoading = employeeAccounts.isLoading
  
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof FormattedEmployeeAccount>("endTime")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const employees = useMemo(() => {
    if (!employeeAccounts.data) return []
    
    return employeeAccounts.data.map((item) => {
      const account = item.account
      
      const startDate = new Date(account.startTime.toNumber() * 1000)
      const endDate = new Date(account.endTime.toNumber() * 1000)
      const cliffDate = new Date(account.cliffTime.toNumber() * 1000)
      const totalAmount = account.totalAmount.toNumber()
      
      const now = new Date()
      let vestedAmount = 0
      let status: FormattedEmployeeAccount['status'] = 'pending'
      
      if (now < startDate) {
        vestedAmount = 0
        status = 'pending'
      } else if (now >= endDate) {
        vestedAmount = totalAmount
        status = 'completed'
      } else {
        const timePassedSinceStart = now.getTime() - startDate.getTime()
        const vestingDuration = endDate.getTime() - startDate.getTime()
        const vestingPercentage = timePassedSinceStart / vestingDuration
        
        if (now >= cliffDate) {
          vestedAmount = Math.floor(totalAmount * vestingPercentage)
          status = 'active'
        } else {
          vestedAmount = 0
          status = 'pending'
        }
      }
      
      return {
        id: item.publicKey.toString(),
        publicKey: item.publicKey,
        beneficiaryAddress: account.beneficiary.toString(),
        startTime: startDate,
        endTime: endDate,
        cliffTime: cliffDate,
        totalAmount,
        vestedAmount,
        status,
        vestingAccount: account.vestingAccount
      }
    })
  }, [employeeAccounts.data])

  const filteredEmployees = employees.filter(
    (employee) => employee.beneficiaryAddress.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: keyof FormattedEmployeeAccount) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: FormattedEmployeeAccount["status"]) => {
    const variants = {
      active: "bg-green-900 text-green-300 border-green-700",
      completed: "bg-blue-900 text-blue-300 border-blue-700",
      pending: "bg-yellow-900 text-yellow-300 border-yellow-700",
      paused: "bg-gray-900 text-gray-300 border-gray-700",
    }

    return <Badge className={`${variants[status]} border`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const calculateProgress = (employee: FormattedEmployeeAccount) => {
    return Math.round((employee.vestedAmount / employee.totalAmount) * 100)
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <LoadingSkeleton className="h-10 w-full mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <LoadingSkeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Employee Vesting Accounts</CardTitle>
        <CardDescription className="text-gray-400">Manage and monitor all employee vesting schedules</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by beneficiary address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("beneficiaryAddress")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    Beneficiary
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("status")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    Status
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("totalAmount")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    Total Amount
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4">Progress</th>
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("startTime")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    Start Date
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("endTime")}
                    className="text-gray-400 hover:text-white p-0 h-auto font-medium"
                  >
                    End Date
                    <ArrowUpDown className="ml-1 w-3 h-3" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                  <td className="py-4 px-4">
                    <div className="font-medium text-white">
                      <ExplorerLink
                        path={`account/${employee.beneficiaryAddress}`}
                        label={ellipsify(employee.beneficiaryAddress)}
                        className="text-purple-400 hover:text-purple-300"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(employee.status)}</td>
                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{employee.totalAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">{employee.vestedAmount.toLocaleString()} vested</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(employee)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-10">{calculateProgress(employee)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {employee.startTime.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {employee.endTime.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedEmployees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No employee accounts found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}