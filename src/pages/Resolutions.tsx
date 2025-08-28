import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/utils/api"

export default function Resolutions() {
  const [selectedSession, setSelectedSession] = useState<string>("")

  const { data: sessions, error: sessionsError, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      try {
        const response = await api.get("/sessions");
        console.log("Sessions API response:", response);
        // The API returns { success: true, data: { sessions: [...] } }
        return response.data.data?.sessions || response.data.sessions || [];
      } catch (error) {
        console.error("Sessions API error:", error);
        throw error;
      }
    },
  })

  // Handle sessions error
  if (sessionsError) {
    console.error("Error fetching sessions:", sessionsError);
  }

  // Ensure sessions is always an array
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  
  // Debug logging
  console.log("Sessions data:", sessions);
  console.log("Safe sessions:", safeSessions);

  const { data: resolutions, isLoading, error } = useQuery({
    queryKey: ["resolutions", selectedSession],
    queryFn: async () => {
      try {
        const response = await api.get(`/sessions/${selectedSession}/resolutions`);
        console.log("Resolutions API response:", response);
        // The API returns { success: true, data: { resolutions: [...] } }
        return response.data.data?.resolutions || response.data.resolutions || [];
      } catch (error) {
        console.error("Resolutions API error:", error);
        throw error;
      }
    },
    enabled: !!selectedSession,
  })

  // Handle error state
  if (error) {
    console.error("Error fetching resolutions:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resolutions</h1>
      </div>

      <div className="w-[240px]">
        <Select value={selectedSession} onValueChange={setSelectedSession}>
          <SelectTrigger>
            <SelectValue placeholder="Select Session" />
          </SelectTrigger>
          <SelectContent>
            {sessionsLoading ? (
              <SelectItem value="loading" disabled>
                Loading sessions...
              </SelectItem>
            ) : sessionsError ? (
              <SelectItem value="error" disabled>
                Error loading sessions
              </SelectItem>
            ) : !safeSessions || safeSessions.length === 0 ? (
              <SelectItem value="no-sessions" disabled>
                No sessions available
              </SelectItem>
            ) : (
              safeSessions.map((session: any) => (
                <SelectItem key={session.session_id} value={session.session_id}>
                  {session.type} - {session.year} ({session.house})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedSession ? (
        error ? (
          <div className="text-center text-red-500 py-8">
            Error loading resolutions: {error.message}
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
                             <TableHeader>
                 <TableRow>
                   <TableHead>Resolution No</TableHead>
                   <TableHead>Title</TableHead>
                   <TableHead>Text</TableHead>
                   <TableHead>Status</TableHead>
                 </TableRow>
               </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading resolutions...
                    </TableCell>
                  </TableRow>
                ) : !resolutions || resolutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No resolutions found for this session
                    </TableCell>
                  </TableRow>
                ) : (
                                     resolutions.map((resolution: any) => (
                     <TableRow key={resolution.resolution_id}>
                       <TableCell className="font-medium font-mono">{resolution.resolution_no || resolution.resolution_id}</TableCell>
                       <TableCell>{resolution.title || resolution.resolution_no_en || 'N/A'}</TableCell>
                       <TableCell className="max-w-md truncate">{resolution.text || resolution.content || 'N/A'}</TableCell>
                       <TableCell>{resolution.status || 'Active'}</TableCell>
                     </TableRow>
                   ))
                )}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <div className="text-center text-muted-foreground py-8">
          Please select a session to view resolutions
        </div>
      )}
    </div>
  )
}