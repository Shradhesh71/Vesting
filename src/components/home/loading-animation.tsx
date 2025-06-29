"use client"

import { useEffect, useState } from "react"

export function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto"
            style={{ animationDirection: "reverse", animationDuration: "1s" }}
          ></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Vestify</h2>
        <p className="text-gray-400">Loading your vesting platform...</p>
      </div>
    </div>
  )
}
