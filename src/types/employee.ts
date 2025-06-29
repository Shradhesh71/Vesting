export interface EmployeeAccount {
  id: string
  publicKey: string
  companyPublicKey: string // Associate employee with company
  beneficiaryAddress: string
  startTime: Date
  endTime: Date
  cliffTime: Date
  totalAmount: number
  vestedAmount: number
  remainingAmount: number
  status: 'active' | 'completed' | 'pending' | 'paused'
  employeeName?: string
  department?: string
  position?: string
}

export interface VestingMetrics {
  totalEmployees: number
  totalTokensVested: number
  totalTokensRemaining: number
  activeSchedules: number
  completedSchedules: number
  totalValueLocked: number
}
