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

interface Kramamk {
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

interface KramamkTableProps {
  data: Kramamk[];
  loading: boolean;
}

const KramamkTable: React.FC<KramamkTableProps> = ({ data, loading }) => {
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
            <TableHead className="font-semibold">Kramank Number</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Chairman</TableHead>
            <TableHead className="font-semibold">Session ID</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No kramank records found
              </TableCell>
            </TableRow>
          ) : (
            data.map((kramamk) => (
              <TableRow key={kramamk.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium font-mono">{kramamk.number}</TableCell>
                <TableCell>{kramamk.date }</TableCell>
                <TableCell>{kramamk.chairman}</TableCell>
                <TableCell>{kramamk.session_id}</TableCell>
                <TableCell>{kramamk.status || ''}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default KramamkTable;
