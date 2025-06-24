import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from 'lucide-react';

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

interface DebateEditModalProps {
  debate: Debate;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (debate: Debate) => void;
}

const DebateEditModal: React.FC<DebateEditModalProps> = ({
  debate,
  isOpen,
  onClose,
  onUpdate,
}) => {
  // Convert members to string for editing
  const membersString = Array.isArray(debate.members) ? debate.members.join(', ') : (debate.members || '');
  const [formData, setFormData] = useState<Debate>({ ...debate, members: membersString });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...debate, members: Array.isArray(debate.members) ? debate.members.join(', ') : (debate.members || '') });
  }, [debate]);

  const handleInputChange = (field: keyof Debate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    // Convert members back to array if needed
    const updatedDebate = {
      ...formData,
      members: typeof formData.members === 'string' ? formData.members.split(',').map(m => m.trim()).filter(Boolean) : formData.members,
    };
    setTimeout(() => {
      onUpdate(updatedDebate);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Edit Debate Details</span>
          </DialogTitle>
          <DialogDescription>
            Make changes to the debate information. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              placeholder="Enter debate topic"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="members">Members (comma separated)</Label>
            <Input
              id="members"
              value={formData.members}
              onChange={(e) => handleInputChange('members', e.target.value)}
              placeholder="Enter members, separated by commas"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kramank_id">Kramank ID</Label>
              <Input
                id="kramank_id"
                type="number"
                value={formData.kramank_id}
                onChange={(e) => handleInputChange('kramank_id', parseInt(e.target.value))}
                placeholder="Kramank ID"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">Debate Text</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Enter debate text..."
              className="min-h-[120px] resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              placeholder="Status"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={isLoading}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Updating...' : 'Update'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DebateEditModal;
