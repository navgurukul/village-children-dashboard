
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface BulkUploadUsersProps {
  onComplete: () => void;
}

const BulkUploadUsers = ({ onComplete }: BulkUploadUsersProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any[]>([]);

  // Mock validation data
  const mockValidationData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      role: 'Bal Mitra',
      villages: 'Haripur, Rampur',
      errors: []
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: '',
      mobile: '9876543211',
      role: 'Admin',
      villages: 'All',
      errors: ['Email is required']
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      mobile: '123',
      role: 'Bal Mitra',
      villages: 'InvalidVillage',
      errors: ['Invalid mobile number', 'Village "InvalidVillage" does not exist']
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
      setUploadedData(mockValidationData);
      setValidationResults(mockValidationData);
      setCurrentStep(2);
    }
  };

  const handleDownloadTemplate = () => {
    console.log('Downloading template...');
  };

  const handleProceed = () => {
    const validUsers = validationResults.filter(user => user.errors.length === 0);
    console.log('Creating users:', validUsers);
    setCurrentStep(3);
  };

  const hasErrors = validationResults.some(user => user.errors.length > 0);

  const renderStep1 = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Step 1: Upload CSV/Excel File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload User Data</h3>
          <p className="text-muted-foreground mb-4">
            Select a CSV or Excel file containing user information
          </p>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
          </label>
        </div>
        
        <div className="text-center">
          <Button onClick={handleDownloadTemplate} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Sample Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Step 2: Validate Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Preview of uploaded data. Please fix any errors before proceeding.
            </p>
            {hasErrors && (
              <Badge variant="destructive">
                {validationResults.filter(user => user.errors.length > 0).length} errors found
              </Badge>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Mobile</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Villages</TableHead>
                  <TableHead className="font-bold">Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationResults.map((user, index) => (
                  <TableRow key={user.id} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell>
                      {user.errors.length === 0 ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.villages}</TableCell>
                    <TableCell>
                      {user.errors.length > 0 && (
                        <div className="text-destructive text-sm">
                          <ul className="list-disc list-inside">
                            {user.errors.map((error: string, idx: number) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setCurrentStep(1)} variant="outline">
              Re-upload File
            </Button>
            <Button 
              onClick={handleProceed} 
              disabled={hasErrors}
              className="flex-1"
            >
              Proceed with {validationResults.filter(user => user.errors.length === 0).length} Valid Users
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          Step 3: Upload Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="py-8">
          <CheckCircle className="h-16 w-16 mx-auto text-success mb-4" />
          <h3 className="text-2xl font-bold mb-2">Upload Successful!</h3>
          <p className="text-muted-foreground">
            {validationResults.filter(user => user.errors.length === 0).length} new users have been created successfully.
          </p>
        </div>
        
        <Button onClick={onComplete} className="w-full">
          Return to Users List
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={onComplete} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Bulk Upload Users</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default BulkUploadUsers;
