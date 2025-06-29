import type { PublicKey } from "@solana/web3.js"

export interface CompanyAccount {
  publicKey: PublicKey
  owner: PublicKey
  mint: PublicKey
  treasuryTokenAccount: PublicKey
  companyName: string
  treasuryBump: number
  bump: number
}

export interface CompanyMetrics {
  totalEmployees: number
  totalTokensVested: number
  totalTokensRemaining: number
  activeSchedules: number
  completedSchedules: number
  totalValueLocked: number
}
