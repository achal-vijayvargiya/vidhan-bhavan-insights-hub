
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

interface Debate {
  id: number;
  session_id: number;
  kramamk_id: number;
  debate_title: string;
  speaker: string;
  date: string;
  duration: string;
  content: string;
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
              <TableHead className="font-semibold">Debate Title</TableHead>
              <TableHead className="font-semibold">Speaker</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Duration</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No debates found
                </TableCell>
              </TableRow>
            ) : (
              data.map((debate) => (
                <TableRow key={debate.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{debate.debate_title}</TableCell>
                  <TableCell>{debate.speaker}</TableCell>
                  <TableCell>{new Date(debate.date).toLocaleDateString()}</TableCell>
                  <TableCell>{debate.duration}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDebate(debate)}
                      className="flex items-center space-x-1 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Button>
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
