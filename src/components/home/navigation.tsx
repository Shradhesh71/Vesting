"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletButton } from "../solana/solana-provider"
import { ClusterUiSelect } from "../cluster/cluster-ui"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Vestify</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="#features"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#security"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Security
              </Link>
              <Link
                href="#docs"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Docs
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <WalletButton />
            <ClusterUiSelect />
            <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            onClick={() => window.location.href="/dashboard"}>
              Dashboard
            </Button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800/50 rounded-lg mt-2">
              <Link href="#features" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
              >
                How It Works
              </Link>
              <Link href="#security" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Security
              </Link>
              <Link href="#docs" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">
                Docs
              </Link>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <WalletButton />
                <ClusterUiSelect />
                {/* <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                  Launch App
                </Button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
