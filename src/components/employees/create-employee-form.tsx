'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useCompany } from '@/contexts/company-context'
import { ellipsify } from '@/utils/ellipsify'
import { AlertTriangle, CheckCircle, Calendar, Wallet, Building2 } from 'lucide-react'
import { useVestingProgramAccount } from '../vesting/vesting-data-access'

interface CreateEmployeeFormData {
  //   employeeName: string
  //   department: string
  //   position: string
  beneficiaryAddress: string
  startTime: string
  endTime: string
  cliffTime: string
  totalAmount: string
}

export function CreateEmployeeForm() {
  const router = useRouter()
  const { selectedCompany } = useCompany()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const { createEmployeeVestingAccount } = selectedCompany
    ? useVestingProgramAccount({ account: selectedCompany.publicKey })
    : { createEmployeeVestingAccount: null }

  const [formData, setFormData] = useState<CreateEmployeeFormData>({
    // employeeName: "",
    // department: "",
    // position: "",
    beneficiaryAddress: '',
    startTime: '',
    endTime: '',
    cliffTime: '',
    totalAmount: '',
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // if (!formData.employeeName.trim()) {
    //   newErrors.employeeName = "Employee name is required"
    // }

    if (!formData.beneficiaryAddress.trim()) {
      newErrors.beneficiaryAddress = 'Beneficiary address is required'
    } else {
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
      if (!base58Regex.test(formData.beneficiaryAddress)) {
        newErrors.beneficiaryAddress = 'Please enter a valid Solana address'
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required'
    }

    if (!formData.cliffTime) {
      newErrors.cliffTime = 'Cliff time is required'
    }

    if (!formData.totalAmount) {
      newErrors.totalAmount = 'Total amount is required'
    } else if (isNaN(Number(formData.totalAmount)) || Number(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Please enter a valid positive number'
    }

    // Date validations
    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime)
      const endDate = new Date(formData.endTime)

      if (endDate <= startDate) {
        newErrors.endTime = 'End time must be after start time'
      }
    }

    if (formData.startTime && formData.cliffTime) {
      const startDate = new Date(formData.startTime)
      const cliffDate = new Date(formData.cliffTime)

      if (cliffDate < startDate) {
        newErrors.cliffTime = 'Cliff time cannot be before start time'
      }
    }

    if (formData.cliffTime && formData.endTime) {
      const cliffDate = new Date(formData.cliffTime)
      const endDate = new Date(formData.endTime)

      if (cliffDate > endDate) {
        newErrors.cliffTime = 'Cliff time cannot be after end time'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CreateEmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCompany) {
      alert('Please select a company first')
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const startTimeUnix = Math.floor(new Date(formData.startTime).getTime() / 1000)
      const endTimeUnix = Math.floor(new Date(formData.endTime).getTime() / 1000)
      const cliffTimeUnix = Math.floor(new Date(formData.cliffTime).getTime() / 1000)

      await createEmployeeVestingAccount?.mutateAsync({
        startTime: startTimeUnix,
        endTime: endTimeUnix,
        cliffTime: cliffTimeUnix,
        totalAmount: Number(formData.totalAmount),
        beneficiary: formData.beneficiaryAddress,
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/employees')
      }, 2000)
    } catch (error) {
      console.error('Error creating employee account:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedCompany) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Company Selected</h3>
            <p className="text-gray-400 mb-4">
              Please select a company from the dashboard to create employee accounts.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-purple-500 to-blue-600">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Employee Account Created!</h3>
            <p className="text-gray-400 mb-4">
              The vesting account for {formData.beneficiaryAddress} has been successfully created for{' '}
              {selectedCompany.companyName}.
            </p>
            <p className="text-sm text-gray-500">Redirecting to employee list...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Context */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-white">Company Context</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Employee will be associated with this company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div>
              <h3 className="font-medium text-white">{selectedCompany.companyName}</h3>
              <p className="text-sm text-gray-400">{ellipsify(selectedCompany.publicKey.toString())}</p>
            </div>
            <Badge className="bg-green-900 text-green-300 border-green-700">Selected</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <CardTitle className="text-white">Wallet Information</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Solana wallet address where tokens will be sent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="beneficiaryAddress" className="text-white">
              Beneficiary Address *
            </Label>
            <Input
              id="beneficiaryAddress"
              value={formData.beneficiaryAddress}
              onChange={(e) => handleInputChange('beneficiaryAddress', e.target.value)}
              className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 font-mono ${
                errors.beneficiaryAddress ? 'border-red-500' : ''
              }`}
              placeholder="Enter Solana wallet address"
              disabled={isSubmitting}
            />
            {errors.beneficiaryAddress && (
              <p className="text-red-400 text-sm flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors.beneficiaryAddress}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vesting Schedule */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <CardTitle className="text-white">Vesting Schedule</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Define the token vesting timeline and amounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-white">
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={`bg-gray-900 border-gray-600 text-white ${errors.startTime ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.startTime && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.startTime}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-white">
                End Time *
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={`bg-gray-900 border-gray-600 text-white ${errors.endTime ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.endTime && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.endTime}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliffTime" className="text-white">
                Cliff Time *
              </Label>
              <Input
                id="cliffTime"
                type="datetime-local"
                value={formData.cliffTime}
                onChange={(e) => handleInputChange('cliffTime', e.target.value)}
                className={`bg-gray-900 border-gray-600 text-white ${errors.cliffTime ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.cliffTime && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.cliffTime}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount" className="text-white">
                Total Amount *
              </Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 ${
                  errors.totalAmount ? 'border-red-500' : ''
                }`}
                placeholder="Enter total token amount"
                disabled={isSubmitting}
              />
              {errors.totalAmount && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.totalAmount}</span>
                </p>
              )}
            </div>
          </div>

          <Alert className="bg-blue-900/20 border-blue-500/50">
            <Calendar className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Cliff Period:</strong> No tokens will be released until the cliff time is reached. After the
              cliff, tokens will vest according to the schedule from start time to end time.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-3 text-lg font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Vesting Account...</span>
              </div>
            ) : (
              'Create Employee Vesting Account'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
