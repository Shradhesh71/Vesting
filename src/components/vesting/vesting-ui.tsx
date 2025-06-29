'use client'

import { PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useVestingProgram, useVestingProgramAccount } from './vesting-data-access'
import { ellipsify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useWallet } from '@solana/wallet-adapter-react'
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils'

export function VestingCreate() {
  const { createVestingAccount } = useVestingProgram()
  const [company, setCompany] = useState("");
  const [mint, setMint] = useState("");
  const { publicKey } = useWallet();

  const isFormValid = company.length > 0 && mint.length > 0 && publicKey;

  const handleSubmit = async () => {
    if (isFormValid) {
      await createVestingAccount.mutateAsync({ companyName: company, mint });
    }
  }

  if(!publicKey) {
    return <p className='text-red-500'>Connect Wallet</p>
  }

  return (
    <div>
      <input
      type='text'
      placeholder='Company Name'
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      className='input input-bordered w-full mb-2 max-w-xs' 
      />
      <input
        type='text'
        placeholder='Mint Address'
        value={mint}
        onChange={(e) => setMint(e.target.value)}
        className='input input-bordered w-full mb-2 max-w-xs'
      />
      <Button onClick={handleSubmit} disabled={createVestingAccount.isPending || !isFormValid}>
        Create New Vesting Account {createVestingAccount.isPending && '...'}
      </Button>
    </div>
  )
}

export function VestingList() {
  const { accounts, getProgramAccount } = useVestingProgram()

  const { employeeAccounts } = useVestingProgram()

  console.log('Employee Accounts:', employeeAccounts)

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      <div>
      <h2>All Employee Vesting Accounts</h2>
      {employeeAccounts.data?.length ? employeeAccounts.data.map((employee) => (
        <div key={employee.publicKey.toString()}>
          <p>Employee: {employee.account.beneficiary.toString()}</p>
          <p>Total Amount: {employee.account.totalAmount.toString()}</p>
          <p>Start Time: {new Date(Number(employee.account.startTime) * 1000).toLocaleDateString()}</p>
          <p>End Time: {new Date(Number(employee.account.endTime) * 1000).toLocaleDateString()}</p>
          <p>Cliff Time: {new Date(Number(employee.account.cliffTime) * 1000).toLocaleDateString()}</p>
          <ExplorerLink path={`account/${employee.publicKey}`} label={ellipsify(employee.publicKey.toString())} />
        </div>
      )) : (
        <p>No employee accounts found.</p>
      )}
    </div>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <VestingCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function VestingCard({ account }: { account: PublicKey }) {
  const { accountQuery, createEmployeeVestingAccount } = useVestingProgramAccount({
    account, 
  })

  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [cliffTime, setCliffTime] = useState<number>(0)
  const [beneficiary, setBeneficiary] = useState<string>('564Scsx14b73fsRj3B6YetSArtGqcwjHnEKakouXBKkh')

  const companyName = useMemo(() => accountQuery.data?.companyName ?? '', [accountQuery.data?.companyName])

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle onClick={() => accountQuery.refetch()}> {companyName}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <input
          type='text'
          placeholder='Start Time'
          value={startTime || ''}
          onChange={(e) => setStartTime(Number(e.target.value))}
          className='input input-bordered w-full mb-2 max-w-xs'
          />
          <input
            type='text'
            placeholder='End Time'
            value={endTime || ''}
            onChange={(e) => setEndTime(Number(e.target.value))}
            className='input input-bordered w-full mb-2 max-w-xs'
          />
          <input
            type='text'
            placeholder='Total Allocation Amount'
            value={totalAmount || ''}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className='input input-bordered w-full mb-2 max-w-xs'
          />
          <input
            type='text'
            placeholder='Cliff Time'
            value={cliffTime || ''}
            onChange={(e) => setCliffTime(Number(e.target.value))}
            className='input input-bordered w-full mb-2 max-w-xs'
          />
          <Button
            variant="outline"
            onClick={() =>
                createEmployeeVestingAccount.mutateAsync({
                  startTime,
                  endTime,
                  totalAmount,
                  cliffTime,
                  beneficiary
                })
            }
            disabled={createEmployeeVestingAccount.isPending}
          >
            Create Employee Vesting Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


function AllEmployeesList() {
  const { employeeAccounts } = useVestingProgram()

  console.log('Employee Accounts:', employeeAccounts)

  if (employeeAccounts.isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <h2>All Employee Vesting Accounts</h2>
      {employeeAccounts.data?.map((employee) => (
        <div key={employee.publicKey.toString()}>
          <p>Employee: {employee.account.beneficiary.toString()}</p>
          <p>Total Amount: {employee.account.totalAmount.toString()}</p>
          <p>Start Time: {new Date(Number(employee.account.startTime) * 1000).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}