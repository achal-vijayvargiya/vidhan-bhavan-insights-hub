
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

interface Member {
  id: number;
  session_id: string;
  number: string;
  date: string;
  chairman: string;
  status?: string;
  user?: string;
  last_update?: string;
  [key: string]: any;
}

interface MembersTableProps {
  data: Member[];
  loading: boolean;
}

const MembersTable: React.FC<MembersTableProps> = ({ data, loading }) => {
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
            <TableHead className="font-semibold">Member ID</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Constituency</TableHead>
            <TableHead className="font-semibold">Party</TableHead>
            <TableHead className="font-semibold">Session ID</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No member records found
              </TableCell>
            </TableRow>
          ) : (
            data.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium font-mono">{member.number}</TableCell>
                <TableCell>{member.chairman}</TableCell>
                <TableCell>{member.constituency || 'N/A'}</TableCell>
                <TableCell>{member.party || 'N/A'}</TableCell>
                <TableCell>{member.session_id}</TableCell>
                <TableCell>{member.status || ''}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
