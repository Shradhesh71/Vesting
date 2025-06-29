import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSkeleton } from '@/components/launch/loading-skeleton'
import type { LucideIcon } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
}

export function MetricsCard({ title, value, subtitle, icon: Icon, trend, isLoading }: MetricsCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-6 w-6 rounded" />
        </CardHeader>
        <CardContent>
          <LoadingSkeleton className="h-8 w-20 mb-2" />
          <LoadingSkeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className="h-6 w-6 text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1">{value.toLocaleString()}</div>
        <div className="flex items-center space-x-2">
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          {trend && (
            <span className={`text-xs ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
