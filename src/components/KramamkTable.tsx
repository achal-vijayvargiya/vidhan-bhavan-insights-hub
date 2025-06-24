
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

interface Kramamk {
  id: number;
  session_id: number;
  kramamk_number: string;
  title: string;
  date: string;
  type: string;
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'discussion':
        return 'bg-blue-100 text-blue-800';
      case 'question':
        return 'bg-yellow-100 text-yellow-800';
      case 'bill':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Kramamk Number</TableHead>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No kramamk records found
              </TableCell>
            </TableRow>
          ) : (
            data.map((kramamk) => (
              <TableRow key={kramamk.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium font-mono">{kramamk.kramamk_number}</TableCell>
                <TableCell>{kramamk.title}</TableCell>
                <TableCell>{new Date(kramamk.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(kramamk.type)}>
                    {kramamk.type}
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

export default KramamkTable;
