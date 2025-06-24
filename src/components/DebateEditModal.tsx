
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
  session_id: number;
  kramamk_id: number;
  debate_title: string;
  speaker: string;
  date: string;
  duration: string;
  content: string;
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
  const [formData, setFormData] = useState<Debate>(debate);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(debate);
  }, [debate]);

  const handleInputChange = (field: keyof Debate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Updating debate:', formData);
      onUpdate(formData);
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debate_title">Debate Title</Label>
              <Input
                id="debate_title"
                value={formData.debate_title}
                onChange={(e) => handleInputChange('debate_title', e.target.value)}
                placeholder="Enter debate title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker</Label>
              <Input
                id="speaker"
                value={formData.speaker}
                onChange={(e) => handleInputChange('speaker', e.target.value)}
                placeholder="Enter speaker name"
              />
            </div>
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
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 45 min"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter debate content..."
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session_id">Session ID</Label>
              <Input
                id="session_id"
                type="number"
                value={formData.session_id}
                onChange={(e) => handleInputChange('session_id', parseInt(e.target.value))}
                placeholder="Session ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="kramamk_id">Kramamk ID</Label>
              <Input
                id="kramamk_id"
                type="number"
                value={formData.kramamk_id}
                onChange={(e) => handleInputChange('kramamk_id', parseInt(e.target.value))}
                placeholder="Kramamk ID"
              />
            </div>
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
