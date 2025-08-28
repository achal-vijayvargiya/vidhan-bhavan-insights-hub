import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DebatesTable from "@/components/DebatesTable"
import { api } from "@/utils/api"

interface Debate {
  id: number
  kramank_id: number
  topic: string
  members: string[] | string
  date: string
  text: string
  status?: string
  user?: string
  last_update?: string
  [key: string]: any
}

export default function Debates() {
  const [selectedSession, setSelectedSession] = useState<string>("")
  const [selectedKramank, setSelectedKramank] = useState<string>("")

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

  const { data: kramanks, error: kramanksError, isLoading: kramanksLoading } = useQuery({
    queryKey: ["kramanks", selectedSession],
    queryFn: async () => {
      try {
        const response = await api.get(`/sessions/${selectedSession}/kramanks`);
        console.log("Kramanks API response:", response);
        // The API returns { success: true, data: { kramanks: [...] } }
        return response.data.data?.kramanks || response.data.kramanks || [];
      } catch (error) {
        console.error("Kramanks API error:", error);
        throw error;
      }
    },
    enabled: !!selectedSession,
  })

  const { data: debates, isLoading, error: debatesError } = useQuery({
    queryKey: ["debates", selectedKramank],
    queryFn: async () => {
      try {
        const response = await api.get(`/kramanks/${selectedKramank}/debates`);
        console.log("Debates API response:", response);
        // The API returns { success: true, data: { debates: [...] } }
        return response.data.data?.debates || response.data.debates || [];
      } catch (error) {
        console.error("Debates API error:", error);
        throw error;
      }
    },
    enabled: !!selectedKramank,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debates</h1>
      </div>

      <div className="flex gap-4">
        <div className="w-[240px]">
          <Select value={selectedSession} onValueChange={(value) => {
            setSelectedSession(value)
            setSelectedKramank("")
          }}>
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

        <div className="w-[240px]">
          <Select 
            value={selectedKramank} 
            onValueChange={setSelectedKramank}
            disabled={!selectedSession}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Kramank" />
            </SelectTrigger>
            <SelectContent>
              {kramanksLoading ? (
                <SelectItem value="loading" disabled>
                  Loading kramanks...
                </SelectItem>
              ) : kramanksError ? (
                <SelectItem value="error" disabled>
                  Error loading kramanks
                </SelectItem>
              ) : !kramanks || kramanks.length === 0 ? (
                <SelectItem value="no-kramanks" disabled>
                  No kramanks available
                </SelectItem>
              ) : (
                kramanks.map((kramank: any) => (
                  <SelectItem key={kramank.kramank_id} value={kramank.kramank_id}>
                    {kramank.number}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedKramank ? (
        debatesError ? (
          <div className="text-center text-red-500 py-8">
            Error loading debates: {debatesError.message}
          </div>
        ) : (
          <DebatesTable 
            data={debates || []} 
            loading={isLoading}
            onUpdate={(updatedDebate) => {
              // Handle debate updates if needed
              console.log("Debate updated:", updatedDebate)
            }}
          />
        )
      ) : (
        <div className="text-center text-muted-foreground py-8">
          Please select a session and kramank to view debates
        </div>
      )}
    </div>
  )
}