'use client'

import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'
import React from 'react'

export function AppLayout({
  children,
  // links,
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        {/* <AppHeader links={links} /> */}
        {/* <main className="flex-grow container mx-auto p-4"> */}
        {/* <ClusterChecker>
            <AccountChecker />
          </ClusterChecker> */}
        {children}
        {/* </main> */}
        {/* <AppFooter /> */}
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
