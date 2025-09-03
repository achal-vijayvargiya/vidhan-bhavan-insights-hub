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
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface Debate {
  id: number;
  kramank_id: number;
  title: string;  // Add title field
  topic: string;
  members: string[] | string;
  date: string;
  text: string;
  status?: string;
  user?: string;
  last_update?: string;
  image_name?: string;
  document_name?: string;  // Added for PDF file name
  question_number?: number[] | number;
  topics?: string[] | string;
  question_by?: string;  // Who initiated the question/topic
  answer_by?: string;    // Who provided answers/responses (backend field name)
  lob_type?: string;      // Line of Business Type
  lob?: string;           // Line of Business
  sub_lob?: string;       // Sub Line of Business
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
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
      <DialogContent className="sm:max-w-[90vw] h-[90vh] overflow-hidden p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center space-x-2">
            <span>Edit Debate Details</span>
          </DialogTitle>
          <DialogDescription>
            Make changes to the debate information. Click update when you're done.
          </DialogDescription>
        </DialogHeader>
        
        {/* Three-column grid layout */}
        <div className="grid grid-cols-3 gap-4 h-[calc(100%-8rem)]">
          {/* PDF Display Section */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">PDF Document</h3>
              {formData.document_name && (
                <a
                  href={`/api/pdf/${formData.document_name}`}
                  download={formData.document_name}
                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </a>
              )}
            </div>
            <div className="h-[calc(100%-3rem)] overflow-hidden">
              {formData.document_name ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={`/api/pdf/${formData.document_name}`}
                    plugins={[defaultLayoutPluginInstance]}
                    defaultScale={1}
                    theme="dark"
                  />
                </Worker>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No PDF available
                </div>
              )}
            </div>
          </div>
          {/* Text Section */}
          <div className="border rounded-lg p-4 flex flex-col h-full">
            <h3 className="font-semibold mb-2">Debate Text</h3>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Enter debate text..."
              className="flex-1 resize-none min-h-0"
            />
          </div>

          {/* Other Fields Section */}
          <div className="border rounded-lg p-4 flex flex-col h-full">
            <h3 className="font-semibold mb-2">Other Details</h3>
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div className="space-y-2">
                <Label htmlFor="id">Debate ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_name">Image Name</Label>
                <Input
                  id="image_name"
                  value={formData.image_name || ''}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter debate title"
                />
              </div>
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
                <Label htmlFor="lob_type">Line of Business Type</Label>
                <Input
                  id="lob_type"
                  value={formData.lob_type || ''}
                  onChange={(e) => handleInputChange('lob_type', e.target.value)}
                  placeholder="Enter line of business type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lob">Line of Business</Label>
                <Input
                  id="lob"
                  value={formData.lob || ''}
                  onChange={(e) => handleInputChange('lob', e.target.value)}
                  placeholder="Enter line of business"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub_lob">Sub Line of Business</Label>
                <Input
                  id="sub_lob"
                  value={formData.sub_lob || ''}
                  onChange={(e) => handleInputChange('sub_lob', e.target.value)}
                  placeholder="Enter sub line of business"
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
                <Label htmlFor="question_number">Question Numbers (comma separated)</Label>
                <Input
                  id="question_number"
                  value={Array.isArray(formData.question_number) ? formData.question_number.join(', ') : (formData.question_number || '')}
                  onChange={(e) => handleInputChange('question_number', e.target.value)}
                  placeholder="Enter question numbers, separated by commas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topics">Topics (comma separated)</Label>
                <Input
                  id="topics"
                  value={Array.isArray(formData.topics) ? formData.topics.join(', ') : (formData.topics || '')}
                  onChange={(e) => handleInputChange('topics', e.target.value)}
                  placeholder="Enter topics, separated by commas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="question_by">Question By (Who initiated)</Label>
                <Input
                  id="question_by"
                  value={formData.question_by || ''}
                  onChange={(e) => handleInputChange('question_by', e.target.value)}
                  placeholder="Enter who initiated the question/topic"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer_by">Answers By (Who responded)</Label>
                <Input
                  id="answer_by"
                  value={formData.answer_by || ''}
                  onChange={(e) => handleInputChange('answer_by', e.target.value)}
                  placeholder="Enter who provided answers/responses"
                />
              </div>
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
