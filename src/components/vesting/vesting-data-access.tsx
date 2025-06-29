'use client'

import { getVestingProgram, getVestingProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import BN from 'bn.js'

interface CreateVestingArgs {
  companyName: string
  mint: string
}

interface CreateEmployeeArgs {
  startTime: number
  cliffTime: number
  endTime: number
  totalAmount: number
  beneficiary: string
}

interface CompanyMetrics {
  totalEmployees: number
  totalTokensVested: number
  totalTokensRemaining: number
  activeSchedules: number
  completedSchedules: number
  totalValueLocked: number
}

export function useVestingProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVestingProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVestingProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['vesting', 'all', { cluster }],
    queryFn: () => program.account.vestingAccount.all(),
  })

    const employeeAccounts = useQuery({
    queryKey: ['employee-vesting', 'all', { cluster }],
    queryFn: () => program.account.employeeAccount.all(), // Adjust account name to match your program
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const getCompanyMetrics = (companyPublicKey: string): CompanyMetrics => {
    // Default empty metrics
    const defaultMetrics: CompanyMetrics = {
      totalEmployees: 0,
      totalTokensVested: 0,
      totalTokensRemaining: 0,
      activeSchedules: 0,
      completedSchedules: 0,
      totalValueLocked: 0,
    }
    
    // If we don't have employee accounts data yet, return default metrics
    if (!employeeAccounts.data) return defaultMetrics
    
    // Find employee accounts that belong to this company
    // The vestingAccount field in employee accounts should match the company's publicKey
    const companyEmployees = employeeAccounts.data.filter(
      (emp) => emp.account.vestingAccount.toString() === companyPublicKey
    )
    
    // Current time for vesting calculations
    const now = new Date().getTime() / 1000
    
    // Calculate metrics
    let totalTokensVested = 0
    let totalTokensRemaining = 0
    let activeSchedules = 0
    let completedSchedules = 0

    companyEmployees.forEach(emp => {
      const account = emp.account
      const totalAmount = account.totalAmount.toNumber()
      const startTime = account.startTime.toNumber()
      const endTime = account.endTime.toNumber()
      const cliffTime = account.cliffTime.toNumber() 
      const totalWithdrawn = account.totalWithdrawn?.toNumber() || 0
      
      // Calculate vested amount based on current time
      let vestedAmount = 0
      
      if (now < startTime || now < cliffTime) {
        vestedAmount = 0
      } else if (now >= endTime) {
        vestedAmount = totalAmount
        completedSchedules++
      } else {
        // Linear vesting between start and end
        const timeElapsed = now - startTime
        const totalDuration = endTime - startTime
        vestedAmount = Math.floor(totalAmount * (timeElapsed / totalDuration))
        activeSchedules++
      }
      
      // Calculate remaining amount (not yet withdrawn)
      const remainingAmount = vestedAmount - totalWithdrawn
      
      totalTokensVested += vestedAmount
      totalTokensRemaining += (totalAmount - vestedAmount)
    })
    
    return {
      totalEmployees: companyEmployees.length,
      totalTokensVested,
      totalTokensRemaining,
      activeSchedules,
      completedSchedules,
      totalValueLocked: totalTokensVested + totalTokensRemaining,
    }
  }

  const createVestingAccount = useMutation<string, Error, CreateVestingArgs>({
    mutationKey: ['vestingAccount', 'create', { cluster }],
    mutationFn: ({companyName, mint}) =>
      program.methods
    .createVestingAccount(companyName)
    .accounts({ mint: new PublicKey(mint), tokenProgram: TOKEN_PROGRAM_ID })
    .rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await accounts.refetch()
      await employeeAccounts.refetch() 
    },
    onError: (error) => {
  console.log('Vesting account creation error:', error)
  toast.error(`Failed to create vesting account: ${error.message || 'Unknown error'}`)
},
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createVestingAccount,
    employeeAccounts,
    getCompanyMetrics,
    isLoading: accounts.isLoading || getProgramAccount.isLoading,
  }
}

export function useVestingProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVestingProgram()

  const accountQuery = useQuery({
    queryKey: ['vesting', 'fetch', { cluster, account }],
    queryFn: () => program.account.vestingAccount.fetch(account),
  })

  const createEmployeeVestingAccount = useMutation<string, Error, CreateEmployeeArgs>({
    mutationFn: ({startTime, endTime, totalAmount, cliffTime, beneficiary}) =>
      program.methods
    .createEmployeeAccount(
      new BN(startTime),
      new BN(endTime),
      new BN(totalAmount),
      new BN(cliffTime)
    )
    .accounts({ beneficiary: new PublicKey(beneficiary), vestingAccount: account })
    .rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await accounts.refetch()
    },
     onError: (error) => {
  console.log('Employee vesting account creation error:', error)
  toast.error(`Failed to create employee vesting account: ${error.message || 'Unknown error'}`)
},
  })

  return {
    accountQuery,
    createEmployeeVestingAccount,
  }
}
