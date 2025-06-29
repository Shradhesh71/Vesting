'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { CompanyAccount } from '@/types/company'

interface CompanyContextType {
  selectedCompany: CompanyAccount | null
  setSelectedCompany: (company: CompanyAccount | null) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyAccount | null>(null)

  return <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany }}>{children}</CompanyContext.Provider>
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}
