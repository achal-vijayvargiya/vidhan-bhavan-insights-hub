import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MembersTable from "@/components/MembersTable"
import { api } from "@/utils/api"

export default function Members() {
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

  const { data: members, isLoading, error } = useQuery({
    queryKey: ["members", selectedSession],
    queryFn: async () => {
      try {
        const response = await api.get(`/sessions/${selectedSession}/members`);
        console.log("Members API response:", response);
        // The API returns { success: true, data: { members: [...] } }
        return response.data.data?.members || response.data.members || [];
      } catch (error) {
        console.error("Members API error:", error);
        throw error;
      }
    },
    enabled: !!selectedSession,
  })

  // Handle error state
  if (error) {
    console.error("Error fetching members:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Members</h1>
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
            Error loading members: {error.message}
          </div>
        ) : (
          <MembersTable data={members || []} loading={isLoading} />
        )
      ) : (
        <div className="text-center text-muted-foreground py-8">
          Please select a session to view members
        </div>
      )}
    </div>
  )
}