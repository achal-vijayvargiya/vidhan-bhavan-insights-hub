import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building, Calendar, MessageSquare, LogOut, User } from 'lucide-react';
import MembersTable from '@/components/MembersTable';
import KarywalisTable from '@/components/KarywalisTable';
import DebatesTable from '@/components/DebatesTable';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const API_BASE = "http://localhost:8000";

const Index = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [debatesCount, setDebatesCount] = useState(0);
  const [selectedSession, setSelectedSession] = useState('');
  const [membersData, setMembersData] = useState([]);
  const [debatesData, setDebatesData] = useState([]);
  const [karyawaliData, setKaryawaliData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sessionsRes = await fetch(`${API_BASE}/api/sessions`);
        const sessionsData = await sessionsRes.json();
        const sessions = sessionsData.success ? sessionsData.data.sessions : [];
        
        let debatesCount = 0;
        try {
          const debatesRes = await fetch(`${API_BASE}/api/debates`);
          const debatesData = await debatesRes.json();
          debatesCount = debatesData.success ? debatesData.data.summary.total_debates : 0;
          console.log("Debate count: " + debatesCount);
        } catch (e) {
          debatesCount = 0;
        }
        
        setSessionsData(sessions);
        setDebatesCount(debatesCount);
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

  const handleSessionChange = async (sessionId: string) => {
    setSelectedSession(sessionId);
    setLoading(true);
    try {
      if (sessionId === 'all' || sessionId === '') {
        setMembersData([]);
        setDebatesData([]);
        setKaryawaliData([]);
        setLoading(false);
        return;
      }
      
      // Call APIs with session_id as path parameter
      const [membersRes, kramanksRes] = await Promise.all([
        fetch(`${API_BASE}/api/sessions/${sessionId}/members`),
        fetch(`${API_BASE}/api/sessions/${sessionId}/kramanks`)
      ]);
      
      const [membersData, kramanksData] = await Promise.all([
        membersRes.json(),
        kramanksRes.json()
      ]);
      
      // Extract data from API responses
      const members = membersData.success ? membersData.data.members : [];
      const kramanks = kramanksData.success ? kramanksData.data.kramanks : [];
      
      // Get debates for all kramanks in this session
      let allDebates = [];
      for (const kramank of kramanks) {
        try {
          const debatesRes = await fetch(`${API_BASE}/api/kramanks/${kramank.kramank_id}/debates`);
          const debatesData = await debatesRes.json();
          if (debatesData.success) {
            allDebates = [...allDebates, ...debatesData.data.debates];
          }
        } catch (error) {
          console.error(`Error fetching debates for kramank ${kramank.kramank_id}:`, error);
        }
      }
      
      setMembersData(members);
      setDebatesData(allDebates);
      setKaryawaliData(kramanks); // Using kramanks as karyawali data
    } catch (error) {
      console.error('Error fetching session data:', error);
      toast({
        title: "Error",
        description: "Failed to load session data. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Welcome, {user?.username}</span>
              </div>
              <div className="text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
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
              <div className="text-2xl font-bold text-purple-600">{debatesCount}</div>
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
                    <SelectItem key={session.session_id} value={session.session_id}>
                      {session.session_id} - {session.year} ({session.type})
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
                <MembersTable data={membersData} loading={loading} />
              </TabsContent>

              <TabsContent value="karywalis">
                <KarywalisTable data={karyawaliData} loading={loading} />
              </TabsContent>

              <TabsContent value="debates">
                <DebatesTable 
                  data={debatesData} 
                  loading={loading}
                  onUpdate={(updatedDebate) => {
                    setDebatesData(prev => 
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
