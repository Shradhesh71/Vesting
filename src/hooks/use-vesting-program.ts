'use client'

import { PublicKey } from '@solana/web3.js'
import { useState, useEffect } from 'react'
import type { EmployeeAccount } from '@/types/employee'
import type { CompanyAccount, CompanyMetrics } from '@/types/company'

// Mock company data
const mockCompanyAccounts: CompanyAccount[] = [
  {
    publicKey: new PublicKey('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'),
    owner: new PublicKey('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'),
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    treasuryTokenAccount: new PublicKey('AXzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWN'),
    companyName: 'TechCorp Solutions',
    treasuryBump: 255,
    bump: 254,
  },
  {
    publicKey: new PublicKey('8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV'),
    owner: new PublicKey('ByKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'), // Fixed: removed 'Y' and 'O'
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    treasuryTokenAccount: new PublicKey('CzKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV'), // Fixed: removed 'Z' and 'P'
    companyName: 'InnovateLabs Inc',
    treasuryBump: 255,
    bump: 253,
  },
  {
    publicKey: new PublicKey('9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW'),
    owner: new PublicKey('DyKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW'), // Fixed: removed 'Z' and 'Q'
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    treasuryTokenAccount: new PublicKey('EyKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsX'), // Fixed: removed 'Z' and 'R'
    companyName: 'BlockChain Dynamics',
    treasuryBump: 255,
    bump: 252,
  },
]

// Mock employee data with company associations
const mockEmployeeAccounts: EmployeeAccount[] = [
  {
    id: '1',
    publicKey: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    companyPublicKey: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    beneficiaryAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    startTime: new Date('2024-01-01'),
    endTime: new Date('2025-01-01'),
    cliffTime: new Date('2024-04-01'),
    totalAmount: 10000,
    vestedAmount: 2500,
    remainingAmount: 7500,
    status: 'active',
    employeeName: 'Alice Johnson',
    department: 'Engineering',
    position: 'Senior Developer',
  },
  {
    id: '2',
    publicKey: '8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV',
    companyPublicKey: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    beneficiaryAddress: 'AXzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWN',
    startTime: new Date('2024-02-01'),
    endTime: new Date('2026-02-01'),
    cliffTime: new Date('2024-08-01'),
    totalAmount: 15000,
    vestedAmount: 1875,
    remainingAmount: 13125,
    status: 'active',
    employeeName: 'Bob Smith',
    department: 'Marketing',
    position: 'Marketing Manager',
  },
  {
    id: '3',
    publicKey: '9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW',
    companyPublicKey: '8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV',
    beneficiaryAddress: 'ByKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', // Fixed: removed 'Y' and 'O'
    startTime: new Date('2023-06-01'),
    endTime: new Date('2024-06-01'),
    cliffTime: new Date('2023-09-01'),
    totalAmount: 8000,
    vestedAmount: 8000,
    remainingAmount: 0,
    status: 'completed',
    employeeName: 'Carol Davis',
    department: 'Design',
    position: 'UI/UX Designer',
  },
  {
    id: '4',
    publicKey: 'AzKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsX',
    companyPublicKey: '9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW',
    beneficiaryAddress: 'CyKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV', // Fixed: removed 'Z' and 'P'
    startTime: new Date('2024-03-01'),
    endTime: new Date('2025-03-01'),
    cliffTime: new Date('2024-06-01'),
    totalAmount: 12000,
    vestedAmount: 3000,
    remainingAmount: 9000,
    status: 'active',
    employeeName: 'David Wilson',
    department: 'Operations',
    position: 'Operations Manager',
  },
]

export function useVestingProgram() {
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<CompanyAccount[]>([])
  const [employeeAccounts, setEmployeeAccounts] = useState<EmployeeAccount[]>([])

  const programId = new PublicKey('12SxgcpPmes3VdkvP7gE8SSg2CgJXaZDha8ym5cQK2vY')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setAccounts(mockCompanyAccounts)
      setEmployeeAccounts(mockEmployeeAccounts)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const getCompanyMetrics = (companyPublicKey: string): CompanyMetrics => {
    const companyEmployees = employeeAccounts.filter((emp) => emp.companyPublicKey === companyPublicKey)

    const totalEmployees = companyEmployees.length
    const totalTokensVested = companyEmployees.reduce((sum, emp) => sum + emp.vestedAmount, 0)
    const totalTokensRemaining = companyEmployees.reduce((sum, emp) => sum + emp.remainingAmount, 0)
    const activeSchedules = companyEmployees.filter((emp) => emp.status === 'active').length
    const completedSchedules = companyEmployees.filter((emp) => emp.status === 'completed').length

    return {
      totalEmployees,
      totalTokensVested,
      totalTokensRemaining,
      activeSchedules,
      completedSchedules,
      totalValueLocked: totalTokensVested + totalTokensRemaining,
    }
  }

  const getCompanyEmployees = (companyPublicKey: string): EmployeeAccount[] => {
    return employeeAccounts.filter((emp) => emp.companyPublicKey === companyPublicKey)
  }

  const createEmployeeAccount = async (employeeData: Partial<EmployeeAccount>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newEmployee: EmployeeAccount = {
      id: Date.now().toString(),
      publicKey: `${Math.random().toString(36).substring(2, 15)}`,
      ...employeeData,
    } as EmployeeAccount

    setEmployeeAccounts((prev) => [...prev, newEmployee])
    setIsLoading(false)
    return newEmployee
  }

  return {
    programId,
    accounts,
    employeeAccounts,
    isLoading,
    error: null,
    getCompanyMetrics,
    getCompanyEmployees,
    createEmployeeAccount,
  }
}
