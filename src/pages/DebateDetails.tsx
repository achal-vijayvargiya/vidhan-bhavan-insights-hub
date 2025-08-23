import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from 'lucide-react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface Debate {
  id: string;
  kramank_id: number;
  topic: string;
  members: string[] | string;
  date: string;
  text: string;
  status?: string;
  user?: string;
  last_update?: string;
  image_name?: string;
  document_name?: string;
  question_number?: number[] | number;
  topics?: string[] | string;
  answers_by?: string[] | string;
  lob_type?: string;
  lob?: string;
  sub_lob?: string;
  [key: string]: any;
}

const DebateDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Debate | null>(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(`/api/debates/${id}`);
        if (!response.ok) throw new Error('Failed to fetch debate');
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error fetching debate:', error);
      }
    };

    if (id) fetchDebate();
  }, [id]);

  const handleInputChange = (field: keyof Debate, value: string | number) => {
    if (!formData) return;
    setFormData(prev => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!formData) return;
    setIsLoading(true);
    try {
      const updatedDebate = {
        ...formData,
        members: typeof formData.members === 'string' 
          ? formData.members.split(',').map(m => m.trim()).filter(Boolean) 
          : formData.members,
      };

      const response = await fetch(`/api/debates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDebate),
      });

      if (!response.ok) throw new Error('Failed to update debate');
      
      // Show success message or handle response
    } catch (error) {
      console.error('Error updating debate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Debate Details</h1>
        </div>
        <Button
          onClick={handleUpdate}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm"
        >
          <Save className="h-3 w-3" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-5 gap-6 h-[calc(100vh-12rem)] text-sm">
        {/* PDF Display Section - 60% */}
        <div className="col-span-3 border rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-base">PDF Document</h3>
            {formData.document_name && (
              <a
                href={`/api/pdf/${formData.document_name}`}
                download={formData.document_name}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Download PDF</span>
              </a>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
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

        {/* Debate Details Section - 40% */}
        <div className="col-span-2 border rounded-lg p-4 flex flex-col">
          <h3 className="font-semibold text-base mb-4">Debate Details</h3>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            <div className="space-y-1.5">
              <Label htmlFor="topic" className="text-sm">Topic</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="Enter debate topic"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lob_type" className="text-sm">Line of Business Type</Label>
              <Input
                id="lob_type"
                value={formData.lob_type || ''}
                onChange={(e) => handleInputChange('lob_type', e.target.value)}
                placeholder="Enter line of business type"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lob" className="text-sm">Line of Business</Label>
              <Input
                id="lob"
                value={formData.lob || ''}
                onChange={(e) => handleInputChange('lob', e.target.value)}
                placeholder="Enter line of business"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub_lob" className="text-sm">Sub Line of Business</Label>
              <Input
                id="sub_lob"
                value={formData.sub_lob || ''}
                onChange={(e) => handleInputChange('sub_lob', e.target.value)}
                placeholder="Enter sub line of business"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="members" className="text-sm">Members (comma separated)</Label>
              <Input
                id="members"
                value={formData.members}
                onChange={(e) => handleInputChange('members', e.target.value)}
                placeholder="Enter members, separated by commas"
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-sm">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kramank_id" className="text-sm">Kramank ID</Label>
                <Input
                  id="kramank_id"
                  type="number"
                  value={formData.kramank_id}
                  onChange={(e) => handleInputChange('kramank_id', parseInt(e.target.value))}
                  placeholder="Kramank ID"
                  className="text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="question_number" className="text-sm">Question Numbers (comma separated)</Label>
              <Input
                id="question_number"
                value={Array.isArray(formData.question_number) ? formData.question_number.join(', ') : (formData.question_number || '')}
                onChange={(e) => handleInputChange('question_number', e.target.value)}
                placeholder="Enter question numbers, separated by commas"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topics" className="text-sm">Topics (comma separated)</Label>
              <Input
                id="topics"
                value={Array.isArray(formData.topics) ? formData.topics.join(', ') : (formData.topics || '')}
                onChange={(e) => handleInputChange('topics', e.target.value)}
                placeholder="Enter topics, separated by commas"
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="answers_by" className="text-sm">Answers By (comma separated)</Label>
              <Input
                id="answers_by"
                value={Array.isArray(formData.answers_by) ? formData.answers_by.join(', ') : (formData.answers_by || '')}
                onChange={(e) => handleInputChange('answers_by', e.target.value)}
                placeholder="Enter answers by, separated by commas"
                className="text-sm"
              />
            </div>

            {/* Text Field at Bottom */}
            <div className="space-y-1.5 mt-6 border-t pt-4">
              <Label htmlFor="text" className="text-sm font-medium">Debate Text</Label>
              <Textarea
                id="text"
                value={formData.text}
                readOnly
                className="h-[200px] resize-none bg-gray-50 text-sm"
                placeholder="No debate text available..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebateDetails;