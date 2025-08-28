import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Calendar, MessageSquare } from "lucide-react"
import { api } from "@/utils/api"

function Index() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/stats").then((res) => res.data),
  })

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Welcome to Vidhan Bhavan</h1>
            <p className="text-muted-foreground">Document Management System</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sessions_count || 0}</div>
            <p className="text-xs text-muted-foreground">Active and completed sessions</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debates</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.debates_count || 0}</div>
            <p className="text-xs text-muted-foreground">Recorded discussions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Index;
