
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Session {
  id: number;
  session_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface SessionsTableProps {
  data: Session[];
  loading: boolean;
}

const SessionsTable: React.FC<SessionsTableProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Session Name</TableHead>
            <TableHead className="font-semibold">Start Date</TableHead>
            <TableHead className="font-semibold">End Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No sessions found
              </TableCell>
            </TableRow>
          ) : (
            data.map((session) => (
              <TableRow key={session.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{session.session_name}</TableCell>
                <TableCell>{new Date(session.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(session.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant={session.status === 'Active' ? 'default' : 'secondary'}
                    className={session.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {session.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
