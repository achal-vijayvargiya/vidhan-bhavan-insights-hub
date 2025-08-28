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
  id: string;  // Changed from number to string to match API
  session_id: string;
  name: string;
  house?: string;
  party?: string;
  ministry?: string;
  role?: string;
  gender?: string;
  contact?: string;
  address?: string;
  image_url?: string;
  aka?: string;
  status?: string;
  user?: string;
  last_update?: string;
  position?: string;  // Alias for role
  department?: string;  // Alias for ministry
  number?: string;  // Alias for member_id
  date?: string;
  chairman?: string;  // Alias for name
  [key: string]: any;
}

interface MembersTableProps {
  data: Member[];
  loading: boolean;
}

const MembersTable: React.FC<MembersTableProps> = ({ data, loading }) => {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  
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
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Party</TableHead>
            <TableHead className="font-semibold">House</TableHead>
            <TableHead className="font-semibold">Session ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No member records found
              </TableCell>
            </TableRow>
          ) : (
            safeData.map((member) => (
              <TableRow key={member.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium font-mono">{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role || member.position || ''}</TableCell>
                <TableCell>{member.party || ''}</TableCell>
                <TableCell>{member.house || ''}</TableCell>
                <TableCell>{member.session_id}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
