import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/launch/loading-skeleton"
import { Clock, UserPlus, TrendingUp } from "lucide-react"

interface ActivityItem {
  id: string
  type: "vesting" | "employee_added" | "milestone"
  description: string
  timestamp: Date
  amount?: number
}

interface RecentActivityProps {
  activities?: ActivityItem[]
  isLoading?: boolean
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "vesting",
      description: "Alice Johnson received 250 tokens",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      amount: 250,
    },
    {
      id: "2",
      type: "employee_added",
      description: "New employee Bob Smith added to vesting program",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: "3",
      type: "milestone",
      description: "Carol Davis completed cliff period",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]

  const activityData = activities || mockActivities

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "vesting":
        return TrendingUp
      case "employee_added":
        return UserPlus
      case "milestone":
        return Clock
      default:
        return Clock
    }
  }

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "vesting":
        return "text-green-400"
      case "employee_added":
        return "text-blue-400"
      case "milestone":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <LoadingSkeleton className="h-6 w-32" />
          <LoadingSkeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <LoadingSkeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-gray-400">Latest vesting events and updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activityData.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const colorClass = getActivityColor(activity.type)

          return (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-gray-700 ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{activity.description}</p>
                <p className="text-xs text-gray-400">{activity.timestamp.toLocaleString()}</p>
              </div>
              {activity.amount && (
                <div className="text-sm font-medium text-green-400">+{activity.amount.toLocaleString()}</div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
