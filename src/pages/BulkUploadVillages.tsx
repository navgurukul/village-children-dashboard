
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Download, FileText, CheckCircle } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useToast } from '../hooks/use-toast';

interface BulkUploadVillagesProps {
  onComplete: () => void;
}

const BulkUploadVillages = ({ onComplete }: BulkUploadVillagesProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Call API with file upload
      const response = await apiClient.bulkUploadVillages(formData);
      
      if (response.success) {
        setUploadComplete(true);
        toast({
          title: "Success",
          description: "Successfully uploaded villages",
        });
        
        // Auto-complete after 2 seconds
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload villages",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // CSV headers
    const headers = ['name', 'district', 'gramPanchayat', 'block', 'cluster', 'state'];
    
    // Sample data rows
    const sampleData = [
      ['Bahera', 'Dhanbad', 'Sijua', 'Jharia', 'Sijua-1', 'Jharkhand'],
      ['Lodna', 'Dhanbad', 'Katras', 'Jharia', 'Katras-2', 'Jharkhand'],
      ['Dhansar', 'Dhanbad', 'Bhaga', 'Jharia', 'Bhaga-3', 'Jharkhand'],
      ['Tisra', 'Dhanbad', 'Sijua', 'Jharia', 'Sijua-2', 'Jharkhand'],
      ['Kendua', 'Dhanbad', 'Katras', 'Jharia', 'Katras-1', 'Jharkhand'],
      ['Putki', 'Dhanbad', 'Putki', 'Jharia', 'Putki-1', 'Jharkhand'],
      ['Alakdiha', 'Dhanbad', 'Bhaga', 'Jharia', 'Bhaga-1', 'Jharkhand'],
      ['Bastacola', 'Dhanbad', 'Bastacola', 'Jharia', 'Bastacola-1', 'Jharkhand'],
      ['Sindri', 'Dhanbad', 'Sindri', 'Jharia', 'Sindri-1', 'Jharkhand'],
      ['Kusunda', 'Dhanbad', 'Kusunda', 'Jharia', 'Kusunda-1', 'Jharkhand']
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'village_template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            onClick={onComplete} 
            variant="link" 
            className="gap-2 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Villages
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Bulk Upload Villages</h1>
        </div>

        {/* Instructions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Step 1: Download Template</h4>
              <p className="text-sm text-muted-foreground">
                Download the CSV template with the required column headers for village data.
              </p>
              <Button onClick={downloadTemplate} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Step 2: Fill in Village Data</h4>
              <p className="text-sm text-muted-foreground">
                Fill in the template with village information including name, block, cluster, and panchayat details.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Step 3: Upload File</h4>
              <p className="text-sm text-muted-foreground">
                Upload the completed CSV file. Make sure all required fields are filled.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Villages File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!uploadComplete ? (
              <>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="bg-white"
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={onComplete} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Villages'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-success mx-auto" />
                <div>
                  <h3 className="font-semibold text-success">Upload Successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    Villages have been successfully uploaded to the system.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkUploadVillages;
