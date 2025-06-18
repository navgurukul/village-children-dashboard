
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, School, Home, Heart } from 'lucide-react';

interface ChildDetailsProps {
  childId: string | null;
  onBack: () => void;
}

const ChildDetails = ({ childId, onBack }: ChildDetailsProps) => {
  // Mock child data - in real app, fetch by childId
  const childData = {
    id: "1234567890123456",
    name: "Rahul Kumar",
    age: 12,
    gender: "Male",
    dateOfBirth: "2012-03-15",
    block: "Rajgangpur",
    village: "Haripur",
    fatherName: "Ramesh Kumar",
    motherName: "Sunita Devi",
    familyIncome: "₹50,000 - ₹1,00,000",
    caste: "OBC",
    medicalIssues: "None",
    schoolStatus: "Dropout",
    school: "Government Primary School, Haripur",
    dropoutReason: "Family financial issues and need to work for family income",
    lastAttended: "2024-08-15"
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return <Badge className="status-enrolled">{status}</Badge>;
      case 'Dropout':
        return <Badge className="status-dropout">{status}</Badge>;
      case 'Never Enrolled':
        return <Badge className="status-never">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!childId) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">No child selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            onClick={onBack} 
            variant="link" 
            className="gap-2 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Records
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Child Details</h1>
        </div>

        {/* Personal Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Aadhar Number</label>
                <p className="text-lg font-medium">{childData.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-medium">{childData.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <p className="text-lg font-medium">{childData.age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="text-lg font-medium">{childData.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="text-lg font-medium">{childData.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Caste</label>
                <p className="text-lg font-medium">{childData.caste}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Family Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                <p className="text-lg font-medium">{childData.fatherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                <p className="text-lg font-medium">{childData.motherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Family Income Range</label>
                <p className="text-lg font-medium">{childData.familyIncome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Village</label>
                <p className="text-lg font-medium">{childData.village}, {childData.block}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Medical Issues</label>
              <p className="text-lg font-medium">{childData.medicalIssues}</p>
            </div>
          </CardContent>
        </Card>

        {/* School Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              School Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-muted-foreground">Current Status:</label>
                {getStatusBadge(childData.schoolStatus)}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">School</label>
                <p className="text-lg font-medium">{childData.school}</p>
              </div>

              {childData.schoolStatus === 'Dropout' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Attended</label>
                    <p className="text-lg font-medium">{childData.lastAttended}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dropout Reason</label>
                    <p className="text-lg font-medium">{childData.dropoutReason}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildDetails;
