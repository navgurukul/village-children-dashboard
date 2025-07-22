
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, School, Home, Heart, Edit } from 'lucide-react';
import { Child } from '@/lib/api';

interface ChildDetailsProps {
  childId: string | null;
  childData?: Child | null;
  onBack: () => void;
  onEdit?: (childId: string) => void;
}

const ChildDetails = ({ childId, childData: propChildData, onBack, onEdit }: ChildDetailsProps) => {
  // Transform API child data to display format
  const transformedData = propChildData ? {
    id: propChildData.documentsInfo?.aadhaarNumber || propChildData.id,
    name: propChildData.basicInfo?.fullName || 'N/A',
    age: propChildData.basicInfo?.age || 'N/A',
    gender: propChildData.basicInfo?.gender || 'N/A',
    dateOfBirth: propChildData.basicInfo?.dateOfBirth || 'N/A',
    block: propChildData.basicInfo?.block || 'N/A',
    village: propChildData.basicInfo?.para || 'N/A',
    gramPanchayat: propChildData.basicInfo?.gramPanchayat || 'N/A',
    cluster: propChildData.basicInfo?.cluster || 'N/A',
    motherTongue: propChildData.basicInfo?.motherTongue || 'N/A',
    fatherName: propChildData.familyInfo?.fatherName || 'N/A',
    motherName: propChildData.familyInfo?.motherName || 'N/A',
    caste: propChildData.familyInfo?.caste || 'N/A',
    familyOccupation: propChildData.familyInfo?.familyOccupation || 'N/A',
    parentsStatus: propChildData.familyInfo?.parentsStatus || 'N/A',
    livesWithWhom: propChildData.familyInfo?.livesWithWhom || 'N/A',
    motherEducated: propChildData.familyInfo?.motherEducated ? 'Yes' : 'No',
    fatherEducated: propChildData.familyInfo?.fatherEducated ? 'Yes' : 'No',
    economicStatus: propChildData.economicInfo?.economicStatus || propChildData.derivedFields?.economicStatus || 'N/A',
    rationCardType: propChildData.economicInfo?.rationCardType || 'N/A',
    rationCardNumber: propChildData.economicInfo?.rationCardNumber || 'N/A',
    schoolStatus: propChildData.educationInfo?.educationStatus || propChildData.derivedFields?.educationStatus || 'N/A',
    school: propChildData.educationInfo?.schoolName || 'N/A',
    currentClass: propChildData.educationInfo?.currentClass || 'N/A',
    attendanceStatus: propChildData.educationInfo?.attendanceStatus || 'N/A',
    goesToSchool: propChildData.educationInfo?.goesToSchool ? 'Yes' : 'No',
    hasDisability: propChildData.healthInfo?.hasDisability ? 'Yes' : 'No',
    hasCasteCertificate: propChildData.documentsInfo?.hasCasteCertificate ? 'Yes' : 'No',
    hasResidenceCertificate: propChildData.documentsInfo?.hasResidenceCertificate ? 'Yes' : 'No',
    hasAadhaar: propChildData.documentsInfo?.hasAadhaar ? 'Yes' : 'No',
    isVulnerable: propChildData.derivedFields?.isVulnerable ? 'Yes' : 'No',
    ageGroup: propChildData.derivedFields?.ageGroup || 'N/A',
    priorityLevel: propChildData.derivedFields?.priorityLevel || 'N/A',
    riskFactors: propChildData.derivedFields?.riskFactors?.join(', ') || 'None',
    surveyedBy: propChildData.surveyMeta?.surveyedBy || 'N/A',
    surveyedAt: propChildData.surveyMeta?.surveyedAt ? new Date(propChildData.surveyMeta.surveyedAt).toLocaleDateString() : 'N/A',
    lastUpdatedAt: propChildData.surveyMeta?.lastUpdatedAt ? new Date(propChildData.surveyMeta.lastUpdatedAt).toLocaleDateString() : 'N/A',
    lastUpdatedBy: propChildData.surveyMeta?.lastUpdatedBy || 'N/A'
  } : null;

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

  if (!childId || !transformedData) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">No child selected or child data not available</p>
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Child Details</h1>
            {onEdit && (
              <Button onClick={() => onEdit(childId)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Details
              </Button>
            )}
          </div>
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
                <p className="text-lg font-medium">{transformedData.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-medium">{transformedData.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <p className="text-lg font-medium">{transformedData.age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="text-lg font-medium">{transformedData.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="text-lg font-medium">{transformedData.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Caste</label>
                <p className="text-lg font-medium">{transformedData.caste}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother Tongue</label>
                <p className="text-lg font-medium">{transformedData.motherTongue}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cluster</label>
                <p className="text-lg font-medium">{transformedData.cluster}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                <p className="text-lg font-medium">{transformedData.fatherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                <p className="text-lg font-medium">{transformedData.motherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Father Educated</label>
                <p className="text-lg font-medium">{transformedData.fatherEducated}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother Educated</label>
                <p className="text-lg font-medium">{transformedData.motherEducated}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Family Occupation</label>
                <p className="text-lg font-medium">{transformedData.familyOccupation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Parents Status</label>
                <p className="text-lg font-medium">{transformedData.parentsStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Lives With</label>
                <p className="text-lg font-medium">{transformedData.livesWithWhom}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Village</label>
                <p className="text-lg font-medium">{transformedData.village}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Block</label>
                <p className="text-lg font-medium">{transformedData.block}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gram Panchayat</label>
                <p className="text-lg font-medium">{transformedData.gramPanchayat}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Economic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Economic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Economic Status</label>
                <p className="text-lg font-medium">{transformedData.economicStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ration Card Type</label>
                <p className="text-lg font-medium">{transformedData.rationCardType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ration Card Number</label>
                <p className="text-lg font-medium">{transformedData.rationCardNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health & Documents Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health & Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Has Disability</label>
                <p className="text-lg font-medium">{transformedData.hasDisability}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Has Aadhaar</label>
                <p className="text-lg font-medium">{transformedData.hasAadhaar}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Has Caste Certificate</label>
                <p className="text-lg font-medium">{transformedData.hasCasteCertificate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Has Residence Certificate</label>
                <p className="text-lg font-medium">{transformedData.hasResidenceCertificate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Is Vulnerable</label>
                <p className="text-lg font-medium">{transformedData.isVulnerable}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age Group</label>
                <p className="text-lg font-medium">{transformedData.ageGroup}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority Level</label>
                <p className="text-lg font-medium">{transformedData.priorityLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Risk Factors</label>
                <p className="text-lg font-medium">{transformedData.riskFactors}</p>
              </div>
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
                {getStatusBadge(transformedData.schoolStatus)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">School</label>
                  <p className="text-lg font-medium">{transformedData.school}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Class</label>
                  <p className="text-lg font-medium">{transformedData.currentClass}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Attendance Status</label>
                  <p className="text-lg font-medium">{transformedData.attendanceStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Goes to School</label>
                  <p className="text-lg font-medium">{transformedData.goesToSchool}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Survey Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Survey Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Surveyed By</label>
                <p className="text-lg font-medium">{transformedData.surveyedBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Surveyed At</label>
                <p className="text-lg font-medium">{transformedData.surveyedAt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated At</label>
                <p className="text-lg font-medium">{transformedData.lastUpdatedAt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated By</label>
                <p className="text-lg font-medium">{transformedData.lastUpdatedBy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildDetails;
