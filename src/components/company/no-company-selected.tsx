import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function NoCompanySelected() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="bg-gray-800 border-gray-700 max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <CardTitle className="text-white">No Company Selected</CardTitle>
          <CardDescription className="text-gray-400">
            Please select a company from the dashboard to view and manage employee vesting accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
