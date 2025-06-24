
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

interface Karywali {
  id: number;
  session_id: string;
  number: string;
  date: string;
  chairman: string;
  type?: string;
  status?: string;
  user?: string;
  last_update?: string;
  [key: string]: any;
}

interface KarywalisTableProps {
  data: Karywali[];
  loading: boolean;
}

const KarywalisTable: React.FC<KarywalisTableProps> = ({ data, loading }) => {
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
            <TableHead className="font-semibold">Karywali Number</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Chairman</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Session ID</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No karywali records found
              </TableCell>
            </TableRow>
          ) : (
            data.map((karywali) => (
              <TableRow key={karywali.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium font-mono">{karywali.number}</TableCell>
                <TableCell>{karywali.date}</TableCell>
                <TableCell>{karywali.chairman}</TableCell>
                <TableCell>{karywali.type || 'Regular'}</TableCell>
                <TableCell>{karywali.session_id}</TableCell>
                <TableCell>{karywali.status || ''}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default KarywalisTable;
