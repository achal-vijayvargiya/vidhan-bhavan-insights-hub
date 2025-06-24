import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Session {
  id: string;
  year: string;
  type: string;
  house: string;
  status?: string;
  user?: string;
  last_update?: string;
  created_at?: string;
  [key: string]: any;
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
            <TableHead className="font-semibold">Session ID</TableHead>
            <TableHead className="font-semibold">Year</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">House</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">User</TableHead>
            <TableHead className="font-semibold">Last Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No sessions found
              </TableCell>
            </TableRow>
          ) : (
            data.map((session) => (
              <TableRow key={session.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium font-mono">{session.id}</TableCell>
                <TableCell>{session.year}</TableCell>
                <TableCell>{session.type}</TableCell>
                <TableCell>{session.house}</TableCell>
                <TableCell>{session.status || ''}</TableCell>
                <TableCell>{session.user || ''}</TableCell>
                <TableCell>{session.last_update || ''}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
