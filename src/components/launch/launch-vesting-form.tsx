"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ellipsify } from "@/utils/ellipsify"
import { FormSkeleton } from "./loading-skeleton"
import { Shield, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { ExplorerLink } from "../cluster/cluster-ui"
import { useVestingProgram } from "../vesting/vesting-data-access"

export function LaunchVestingForm() {
  const { programId, isLoading: programLoading, createVestingAccount } = useVestingProgram()
  const [formData, setFormData] = useState({
    companyName: "",
    mintTokenAddress: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required"
    }

    if (!formData.mintTokenAddress.trim()) {
      newErrors.mintTokenAddress = "Token mint address is required"
    } else {
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
      if (!base58Regex.test(formData.mintTokenAddress)) {
        newErrors.mintTokenAddress = "Please enter a valid Solana address"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await createVestingAccount.mutateAsync({ companyName: formData.companyName, mint: formData.mintTokenAddress });
      console.log("Vesting contract created:", formData)
    } catch (error) {
      console.error("Error creating vesting contract:", error)
    } finally {
      setIsSubmitting(false)
      setFormData({ companyName: "", mintTokenAddress: "" })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (programLoading) {
    return <FormSkeleton />
  }

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <CardTitle className="text-white">Verified Program</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            This vesting contract is powered by our audited, open-source program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-400 mb-1">Program ID</p>
              <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} className="text-lg" />
            </div>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Launch Vesting Contract</CardTitle>
          <CardDescription className="text-gray-400">
            Create a secure, automated token vesting schedule for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name Field */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white">
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 ${
                  errors.companyName ? "border-red-500" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.companyName && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.companyName}</span>
                </p>
              )}
            </div>

            {/* Token Mint Address Field */}
            <div className="space-y-2">
              <Label htmlFor="mintTokenAddress" className="text-white">
                SPL Token Mint Address
              </Label>
              <Input
                id="mintTokenAddress"
                type="text"
                placeholder="Enter SPL token mint address"
                value={formData.mintTokenAddress}
                onChange={(e) => handleInputChange("mintTokenAddress", e.target.value)}
                className={`bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 font-mono ${
                  errors.mintTokenAddress ? "border-red-500" : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.mintTokenAddress && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.mintTokenAddress}</span>
                </p>
              )}
            </div>

            {/* SPL Token Info Alert */}
            <Alert className="bg-blue-900/20 border-blue-500/50">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Only SPL (Solana Program Library) token addresses are accepted. Make sure your token is properly minted
                on Solana.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-3 text-lg font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Vesting Contract...</span>
                </div>
              ) : (
                "Launch Vesting Contract"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Audited Smart Contracts</h3>
          </div>
          <p className="text-gray-400 text-sm">Our contracts have been audited by leading security firms</p>
        </div>

        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Open Source</h3>
          </div>
          <p className="text-gray-400 text-sm">Fully transparent and verifiable code on GitHub</p>
        </div>

        <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Immutable</h3>
          </div>
          <p className="text-gray-400 text-sm">Once deployed, vesting schedules cannot be tampered with</p>
        </div>
      </div>
    </div>
  )
}
