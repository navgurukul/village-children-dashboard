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
    id: propChildData.id,
    aadhaarNumber: (propChildData.surveyData?.['section-5']?.q5_1 === 'हाँ' ? propChildData.surveyData?.['section-5']?.q5_4 : null) || 
                  (propChildData.documentsInfo?.hasAadhaar ? propChildData.documentsInfo?.aadhaarNumber : null) || 
                  'N/A',
    name: propChildData.surveyData?.['section-1']?.q1_1 || 'N/A',
    houseNumber: propChildData.surveyData?.['section-1']?.q1_new_house || 'N/A',
    age: propChildData.basicInfo?.age || 'N/A',
    gender: propChildData.surveyData?.['section-1']?.q1_4 || propChildData.basicInfo?.gender || 'N/A',
    dateOfBirth: propChildData.basicInfo?.dateOfBirth || 'N/A',
    block: propChildData.surveyData?.['section-1']?.q1_8 || propChildData.basicInfo?.block || 'N/A',
    village: propChildData.surveyData?.['section-1']?.q1_5 || propChildData.basicInfo?.para || 'N/A',
    gramPanchayat: propChildData.surveyData?.['section-1']?.q1_6 || propChildData.basicInfo?.gramPanchayat || 'N/A',
    cluster: propChildData.basicInfo?.cluster || 'N/A',
    motherTongue: propChildData.surveyData?.['section-1']?.q1_9 || propChildData.basicInfo?.motherTongue || 'N/A',
    motherTongueOther: propChildData.surveyData?.['section-1']?.q1_9_other || '',
    fatherName: propChildData.surveyData?.['section-1']?.q1_11 || propChildData.familyInfo?.fatherName || 'N/A',
    motherName: propChildData.surveyData?.['section-1']?.q1_10 || propChildData.familyInfo?.motherName || 'N/A',
    caste: propChildData.surveyData?.['section-2']?.q2_2 || propChildData.familyInfo?.caste || 'N/A',
    familyOccupation: propChildData.surveyData?.['section-2']?.q2_1 || propChildData.familyInfo?.familyOccupation || 'N/A',
    otherOccupation: propChildData.surveyData?.['section-2']?.q2_1_other || 'N/A',
    otherCaste: propChildData.surveyData?.['section-2']?.q2_2_other || 'N/A',
    parentsStatus: propChildData.surveyData?.['section-2']?.q2_3 || propChildData.familyInfo?.parentsStatus || 'N/A',
    livesWithWhom: propChildData.surveyData?.['section-2']?.q2_4 || propChildData.familyInfo?.livesWithWhom || 'N/A',
    otherLivesWith: propChildData.surveyData?.['section-2']?.q2_4_other || 'N/A',
    motherEducated: propChildData.surveyData?.['section-1']?.q1_12 ? 
                    (propChildData.surveyData?.['section-1']?.q1_12 === "नहीं" ? 'No' : 
                    propChildData.surveyData?.['section-1']?.q1_12) : 
                    propChildData.familyInfo?.motherEducated ? 'Yes' : 'No',
    fatherEducated: propChildData.surveyData?.['section-1']?.q1_13 ?
                    (propChildData.surveyData?.['section-1']?.q1_13 === "नहीं" ? 'No' : 
                    propChildData.surveyData?.['section-1']?.q1_13) : 
                    propChildData.familyInfo?.fatherEducated ? 'Yes' : 'No',
    economicStatus: propChildData.surveyData?.['section-3']?.q3_1 || propChildData.economicInfo?.economicStatus || propChildData.derivedFields?.economicStatus || 'N/A',
    rationCardType: propChildData.surveyData?.['section-3']?.q3_1 || propChildData.economicInfo?.rationCardType || 'N/A',
    rationCardNumber: propChildData.surveyData?.['section-3']?.q3_2 || propChildData.economicInfo?.rationCardNumber || 'N/A',
    goesToSchool: propChildData.surveyData?.['section-4']?.q4_1 === 'हाँ' ? 'Yes' : 
                  propChildData.surveyData?.['section-4']?.q4_1 === 'नहीं' ? 'No' : 
                  propChildData.educationInfo?.goesToSchool ? 'Yes' : 'No',
    attendanceStatus: propChildData.surveyData?.['section-4']?.q4_5 || propChildData.educationInfo?.attendanceStatus || 'N/A',
    educationCategory: propChildData.surveyData?.['section-4']?.q4_6 || 'N/A',
    school: propChildData.surveyData?.['section-4']?.q4_2 || propChildData.educationInfo?.schoolName || 'N/A',
    currentClass: propChildData.surveyData?.['section-4']?.q4_4 || propChildData.educationInfo?.currentClass || 'N/A',
    lastStudiedClass: propChildData.surveyData?.['section-4']?.q4_7 || 'N/A',
    dropoutReasons: Array.isArray(propChildData.surveyData?.['section-4']?.q4_8) ? 
                     propChildData.surveyData?.['section-4']?.q4_8.join(', ') : 
                     propChildData.surveyData?.['section-4']?.q4_8 || 'N/A',
    dropoutReasonOther: propChildData.surveyData?.['section-4']?.q4_9 || '',
    neverEnrolledReasons: Array.isArray(propChildData.surveyData?.['section-4']?.q4_10) ? 
                          propChildData.surveyData?.['section-4']?.q4_10.join(', ') : 
                          propChildData.surveyData?.['section-4']?.q4_10 || 'N/A',
    neverEnrolledReasonOther: propChildData.surveyData?.['section-4']?.q4_11 || '',
    schoolStatus: propChildData.surveyData?.['section-4']?.q4_6 === 'शाला त्यागी' ? 'Dropout' :
                  propChildData.surveyData?.['section-4']?.q4_6 === 'अप्रवेशी' ? 'Never Enrolled' :
                  propChildData.surveyData?.['section-4']?.q4_1 === 'हाँ' ? 'Enrolled' :
                  propChildData.educationInfo?.educationStatus || propChildData.derivedFields?.educationStatus || 'N/A',
    hasDisability: propChildData.surveyData?.['section-6']?.q6_1 === 'हाँ' ? 'Yes' :
                   propChildData.surveyData?.['section-6']?.q6_1 === 'नहीं' ? 'No' : 
                   propChildData.healthInfo?.hasDisability ? 'Yes' : 'No',
    disabilityTypes: Array.isArray(propChildData.surveyData?.['section-6']?.q6_2) ? 
                     propChildData.surveyData?.['section-6']?.q6_2.join(', ') :
                     propChildData.surveyData?.['section-6']?.q6_2 || 'N/A',
    otherDisabilitySpecification: propChildData.surveyData?.['section-6']?.q6_3 || 'N/A',
    hasCasteCertificate: propChildData.surveyData?.['section-5']?.q5_2 === 'हाँ' ? 'Yes' :
                         propChildData.surveyData?.['section-5']?.q5_2 === 'नहीं' ? 'No' :
                         propChildData.documentsInfo?.hasCasteCertificate ? 'Yes' : 'No',
    hasResidenceCertificate: propChildData.surveyData?.['section-5']?.q5_3 === 'हाँ' ? 'Yes' :
                             propChildData.surveyData?.['section-5']?.q5_3 === 'नहीं' ? 'No' :
                             propChildData.documentsInfo?.hasResidenceCertificate ? 'Yes' : 'No',
    hasAadhaar: propChildData.surveyData?.['section-5']?.q5_1 === 'हाँ' ? 'Yes' :
                propChildData.surveyData?.['section-5']?.q5_1 === 'नहीं' ? 'No' :
                propChildData.documentsInfo?.hasAadhaar ? 'Yes' : 'No',
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
      case 'शाला त्यागी':
      case 'Dropout':
        return <Badge className="status-dropout">Dropout</Badge>;
      case 'अप्रवेशी':
      case 'Never Enrolled':
        return <Badge className="status-never">Never Enrolled</Badge>;
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
                <label className="text-sm font-medium text-muted-foreground">Aadhaar Number</label>
                <p className="text-lg font-medium">
                  {transformedData.hasAadhaar === 'Yes' ? transformedData.aadhaarNumber : 'Not Available'}
                </p>
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
                <p className="text-lg font-medium">
                  {transformedData.caste === "अन्य" || transformedData.caste === "Other" 
                    ? `${transformedData.caste} (${transformedData.otherCaste})` 
                    : transformedData.caste}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother Tongue</label>
                <p className="text-lg font-medium">
                  {transformedData.motherTongue === "अन्य" && transformedData.motherTongueOther ? 
                    `${transformedData.motherTongue} (${transformedData.motherTongueOther})` : 
                    transformedData.motherTongue}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">House Number (Grih Kramank)</label>
                <p className="text-lg font-medium">{transformedData.houseNumber}</p>
              </div>
              {/* <div>
                <label className="text-sm font-medium text-muted-foreground">Cluster</label>
                <p className="text-lg font-medium">{transformedData.cluster}</p>
              </div> */}
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
                <p className="text-lg font-medium">
                  {transformedData.familyOccupation === "अन्य" || transformedData.familyOccupation === "Other" 
                    ? `${transformedData.familyOccupation} (${transformedData.otherOccupation})` 
                    : transformedData.familyOccupation}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Parents Status</label>
                <p className="text-lg font-medium">{transformedData.parentsStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Lives With</label>
                <p className="text-lg font-medium">
                  {transformedData.livesWithWhom === "अन्य" || transformedData.livesWithWhom === "Other" 
                    ? `${transformedData.livesWithWhom} (${transformedData.otherLivesWith})` 
                    : transformedData.livesWithWhom}
                </p>
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
              {transformedData.hasDisability === 'Yes' && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Disability Types</label>
                  <p className="text-lg font-medium">{transformedData.disabilityTypes}</p>
                </div>
              )}
              {transformedData.hasDisability === 'Yes' && transformedData.disabilityTypes.includes('अन्य') && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Other Disability</label>
                  <p className="text-lg font-medium">{transformedData.otherDisabilitySpecification}</p>
                </div>
              )}
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
              
              {transformedData.schoolStatus === 'Enrolled' && (
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
              )}

              {transformedData.schoolStatus === 'Dropout' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Class Studied</label>
                    <p className="text-lg font-medium">{transformedData.lastStudiedClass}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Dropout Reasons</label>
                    <p className="text-lg font-medium">
                      {transformedData.dropoutReasons.includes('अन्य') && transformedData.dropoutReasonOther ? 
                       `${transformedData.dropoutReasons} (${transformedData.dropoutReasonOther})` : 
                       transformedData.dropoutReasons}
                    </p>
                  </div>
                </div>
              )}

              {transformedData.schoolStatus === 'Never Enrolled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Reasons for Never Enrolling</label>
                    <p className="text-lg font-medium">
                      {transformedData.neverEnrolledReasons.includes('अन्य') && transformedData.neverEnrolledReasonOther ? 
                       `${transformedData.neverEnrolledReasons} (${transformedData.neverEnrolledReasonOther})` : 
                       transformedData.neverEnrolledReasons}
                    </p>
                  </div>
                </div>
              )}
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
