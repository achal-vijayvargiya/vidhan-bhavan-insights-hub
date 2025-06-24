import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Calendar, MessageSquare } from 'lucide-react';
import SessionsTable from '@/components/SessionsTable';
import MembersTable from '@/components/MembersTable';
import KarywalisTable from '@/components/KarywalisTable';
import DebatesTable from '@/components/DebatesTable';
import { useToast } from '@/hooks/use-toast';

const API_BASE = "http://localhost:8000";

const Index = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [kramamkData, setKramamkData] = useState([]);
  const [debatesData, setDebatesData] = useState([]);
  const [filteredKramamkData, setFilteredKramamkData] = useState([]);
  const [filteredDebatesData, setFilteredDebatesData] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sessions
        const sessionsRes = await fetch(`${API_BASE}/sessions`);
        const sessions = await sessionsRes.json();

        // Fetch kramank
        const kramankRes = await fetch(`${API_BASE}/kramank`);
        const kramank = await kramankRes.json();

        // Fetch debates
        const debatesRes = await fetch(`${API_BASE}/debates`);
        const debates = await debatesRes.json();

        setSessionsData(sessions);
        setKramamkData(kramank);
        setDebatesData(debates);
        setFilteredKramamkData(kramank);
        setFilteredDebatesData(debates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSessionChange = (sessionId: string) => {
    setSelectedSession(sessionId);
    
    if (sessionId === 'all' || sessionId === '') {
      setFilteredKramamkData(kramamkData);
      setFilteredDebatesData(debatesData);
    } else {
      // Filter kramank data by session
      const filteredKramank = kramamkData.filter(item => item.session_id === sessionId);
      setFilteredKramamkData(filteredKramank);
      
      // Filter debates data by session (assuming debates have kramank_id that can be matched)
      const kramankIds = filteredKramank.map(item => item.id);
      const filteredDebates = debatesData.filter(debate => kramankIds.includes(debate.kramank_id));
      setFilteredDebatesData(filteredDebates);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Vidhan Bhavan</h1>
                <p className="text-sm text-gray-600">Document Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Only Sessions and Debates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{sessionsData.length}</div>
              <p className="text-xs text-muted-foreground">Active and completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debates</CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{filteredDebatesData.length}</div>
              <p className="text-xs text-muted-foreground">Recorded discussions</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Vidhan Bhavan Records</CardTitle>
            <CardDescription>
              Manage sessions, members, karywalis, and debates from the legislative assembly
            </CardDescription>
            
            {/* Session Selection Dropdown */}
            <div className="flex items-center space-x-4 pt-4">
              <label htmlFor="session-select" className="text-sm font-medium text-gray-700">
                Select Session:
              </label>
              <Select value={selectedSession} onValueChange={handleSessionChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a session" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="all">All Sessions</SelectItem>
                  {sessionsData.map((session: any) => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.id} - {session.year} ({session.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="members" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Members</span>
                </TabsTrigger>
                <TabsTrigger value="karywalis" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Karywalis</span>
                </TabsTrigger>
                <TabsTrigger value="debates" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Debates</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="members">
                <MembersTable data={filteredKramamkData} loading={loading} />
              </TabsContent>

              <TabsContent value="karywalis">
                <KarywalisTable data={filteredKramamkData} loading={loading} />
              </TabsContent>

              <TabsContent value="debates">
                <DebatesTable 
                  data={filteredDebatesData} 
                  loading={loading}
                  onUpdate={(updatedDebate) => {
                    setDebatesData(prev => 
                      prev.map(debate => 
                        debate.id === updatedDebate.id ? updatedDebate : debate
                      )
                    );
                    // Also update filtered data
                    setFilteredDebatesData(prev => 
                      prev.map(debate => 
                        debate.id === updatedDebate.id ? updatedDebate : debate
                      )
                    );
                    toast({
                      title: "Success",
                      description: "Debate updated successfully",
                    });
                  }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
