import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from 'lucide-react';
import DebateEditModal from './DebateEditModal';

// Updated Debate interface to match API
interface Debate {
  id: number;
  kramank_id: number;
  topic: string;
  members: string[] | string;
  date: string;
  text: string;
  status?: string;
  user?: string;
  last_update?: string;
  [key: string]: any;
}

interface DebatesTableProps {
  data: Debate[];
  loading: boolean;
  onUpdate: (debate: Debate) => void;
}

const DebatesTable: React.FC<DebatesTableProps> = ({ data, loading, onUpdate }) => {
  const [selectedDebate, setSelectedDebate] = useState<Debate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDebate = (debate: Debate) => {
    setSelectedDebate(debate);
    setIsModalOpen(true);
  };

  const handleUpdateDebate = (updatedDebate: Debate) => {
    onUpdate(updatedDebate);
    setIsModalOpen(false);
    setSelectedDebate(null);
  };

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
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Topic</TableHead>
              <TableHead className="font-semibold">Members</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Kramank ID</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No debates found
                </TableCell>
              </TableRow>
            ) : (
              data.map((debate: Debate) => (
                <TableRow key={debate.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{debate.topic}</TableCell>
                  <TableCell>{Array.isArray(debate.members) ? debate.members.join(', ') : debate.members}</TableCell>
                  <TableCell>{debate.date}</TableCell>
                  <TableCell>{debate.kramank_id}</TableCell>
                  <TableCell>{debate.status || ''}</TableCell>
                  <TableCell>
                    <a
                      href={`/debates/${debate.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedDebate && (
        <DebateEditModal
          debate={selectedDebate}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDebate(null);
          }}
          onUpdate={handleUpdateDebate}
        />
      )}
    </>
  );
};

export default DebatesTable;
