'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSkeleton } from '@/components/launch/loading-skeleton'

interface VestingChartProps {
  data?: Array<{ month: string; vested: number; remaining: number }>
  isLoading?: boolean
}

export function VestingChart({ data, isLoading }: VestingChartProps) {
  // Mock chart data
  const chartData = data || [
    { month: 'Jan', vested: 4000, remaining: 8000 },
    { month: 'Feb', vested: 5000, remaining: 7000 },
    { month: 'Mar', vested: 6000, remaining: 6000 },
    { month: 'Apr', vested: 7000, remaining: 5000 },
    { month: 'May', vested: 8000, remaining: 4000 },
    { month: 'Jun', vested: 9000, remaining: 3000 },
  ]

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <LoadingSkeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...chartData.map((d) => d.vested + d.remaining))

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Vesting Progress</CardTitle>
        <CardDescription className="text-gray-400">Token vesting timeline over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-8 text-sm text-gray-400">{item.month}</div>
              <div className="flex-1 flex h-6 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${(item.vested / maxValue) * 100}%` }}
                />
                <div className="bg-gray-600" style={{ width: `${(item.remaining / maxValue) * 100}%` }} />
              </div>
              <div className="w-20 text-sm text-gray-400 text-right">
                {(item.vested + item.remaining).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-400">Vested</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <span className="text-sm text-gray-400">Remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
