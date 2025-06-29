"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSkeleton } from "@/components/launch/loading-skeleton"
import { useCompany } from "@/contexts/company-context"
import { ellipsify } from "@/utils/ellipsify"
import { Building2, ChevronDown, Check, Info, FlameKindling, User, Coins, Wallet } from "lucide-react"
import type { CompanyAccount } from "@/types/company"
import { useVestingProgram, useVestingProgramAccount } from "../vesting/vesting-data-access"
import { ExplorerLink } from "../cluster/cluster-ui"

function CompanyListItem({ 
  account, 
  isSelected, 
  onSelect 
}: { 
  account: any, 
  isSelected: boolean, 
  onSelect: (company: CompanyAccount) => void 
}) {
  const { accountQuery } = useVestingProgramAccount({
    account: account.publicKey, 
  })

  const companyName = useMemo(() => accountQuery.data?.companyName ?? '', [accountQuery.data?.companyName])

  const handleClick = () => {
    if (accountQuery.data) {
    
      const completeCompany = {
        publicKey: account.publicKey,
        ...accountQuery.data,
        companyName: accountQuery.data.companyName || ''
      };
      onSelect(completeCompany as CompanyAccount);
    }
  };
  
  return (
    <button
      key={account.publicKey.toString()}
      // onClick={() => onSelect(account)}
      onClick={handleClick} 
      className="w-full p-4 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-white">{companyName}</h3>
            {isSelected && <Check className="w-4 h-4 text-green-400" />}
          </div>
          <p className="text-sm text-gray-400 mb-2">{ellipsify(account.publicKey.toString())}</p>
          {/* <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{metrics.totalEmployees} employees</span>
            <span>{metrics.activeSchedules} active</span>
            <span>{metrics.totalValueLocked.toLocaleString()} tokens</span>
          </div> */}
        </div>
      </div>
    </button>
  )
}

export function CompanySelector() {
  const { selectedCompany, setSelectedCompany } = useCompany()
  const { accounts, isLoading } = useVestingProgram()
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <LoadingSkeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    )
  }

  const handleCompanySelect = (company: CompanyAccount) => {
    setSelectedCompany(company)
    setIsOpen(false)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-purple-400" />
          <CardTitle className="text-white">Select Company</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Choose a company to view and manage employee vesting accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-between bg-gray-900 border-gray-600 text-white hover:bg-gray-700"
          >
            {selectedCompany ? (
              <div className="flex items-center space-x-2">
                <span>{selectedCompany.companyName}</span>
                <Badge variant="outline" className="text-xs">
                  {ellipsify(selectedCompany.publicKey.toString())}
                </Badge>
              </div>
            ) : (
              "Select a company..."
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </Button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {(accounts.data ?? []).map((account: any) => (
                <CompanyListItem 
                  key={account.publicKey.toString()}
                  account={account}
                  isSelected={selectedCompany?.publicKey.toString() === account.publicKey.toString()}
                  onSelect={handleCompanySelect}
                />
              ))}
            </div>
          )}
        </div>

        {selectedCompany && (
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">Selected Company</h4>
              <Badge className="bg-green-900 text-green-300 border-green-700">Active</Badge>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-400" />
                Owner: <ExplorerLink path={`account/${selectedCompany.owner}`} label={ellipsify(selectedCompany.owner.toString())} />
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-400" />
                Mint: <ExplorerLink path={`account/${selectedCompany.mint}`} label={ellipsify(selectedCompany.mint.toString())} />
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-green-400" />
                Treasury: <ExplorerLink path={`account/${selectedCompany.treasuryTokenAccount}`} label={ellipsify(selectedCompany.treasuryTokenAccount.toString())} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
