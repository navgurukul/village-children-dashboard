import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, School, Home, Heart, Edit } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Child } from '@/lib/api';

interface ChildDetailsProps {
  childId?: string | null;
  childData?: Child | null;
  onBack?: () => void;
  onEdit?: (childId: string) => void;
}

const ChildDetails = ({ onEdit }: ChildDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const childData = location.state?.childData;
  // Format date from ISO string to DD-MM-YYYY
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if not valid date
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || '';
    }
  };
  
  // Transform API child data to display format
  const transformedData = childData ? {
    id: childData.id,
    aadhaarNumber: (childData.surveyData?.['section-5']?.q5_3 === 'हाँ' ? childData.surveyData?.['section-5']?.q5_4 : null) || 'N/A',
    name: childData.surveyData?.['section-1']?.q1_1 || 'N/A',
    houseNumber: childData.surveyData?.['section-1']?.q1_2 || 'N/A',
    dateOfBirth: formatDate((childData.surveyData?.['section-1']?.q1_3 || 'N/A') as string | undefined) || 'N/A',
    gender: childData.surveyData?.['section-1']?.q1_4 ||  'N/A',
    block: childData.surveyData?.['section-1']?.q1_5 || 'N/A',
    gramPanchayat: childData.surveyData?.['section-1']?.q1_6 || 'N/A',
    village: childData.surveyData?.['section-1']?.q1_7 || 'N/A',
    para: childData.surveyData?.['section-1']?.q1_8 || 'N/A',
    motherTongue: childData.surveyData?.['section-1']?.q1_9 || 'N/A',
    motherTongueOther: childData.surveyData?.['section-1']?.q1_8_other || '',
    motherName: childData.surveyData?.['section-1']?.q1_10 || 'N/A',
    fatherName: childData.surveyData?.['section-1']?.q1_11 || 'N/A',
    motherEducated: childData.surveyData?.['section-1']?.q1_12 || 'N/A',
    fatherEducated: childData.surveyData?.['section-1']?.q1_13 || 'N/A',
    caste: childData.surveyData?.['section-2']?.q2_3 || 'N/A',
    familyOccupation: childData.surveyData?.['section-2']?.q2_1 || 'N/A',
    otherOccupation: childData.surveyData?.['section-2']?.q2_2 || 'N/A',
    otherCaste: childData.surveyData?.['section-2']?.q2_4 || 'N/A',
    parentsStatus: childData.surveyData?.['section-2']?.q2_5 || 'N/A',
    livesWithWhom: childData.surveyData?.['section-2']?.q2_6 || 'N/A',
    otherLivesWith: childData.surveyData?.['section-2']?.q2_7 || 'N/A',
    economicStatus: childData.surveyData?.['section-3']?.q3_1 || 'N/A',
    rationCardType: childData.surveyData?.['section-3']?.q3_1 || 'N/A',
    rationCardNumber: childData.surveyData?.['section-3']?.q3_2 || 'N/A',
    goesToSchool: childData.surveyData?.['section-4']?.q4_1 === 'हाँ' ? 'Yes' :
                  childData.surveyData?.['section-4']?.q4_1 === 'नहीं' ? 'No' :
                  childData.surveyData?.['section-4']?.q4_1 === 'आंगनवाड़ी' ? 'Aanganwadi' : 'N/A',
    attendanceStatus: childData.surveyData?.['section-4']?.q4_5 || 'N/A',
    educationCategory: childData.surveyData?.['section-4']?.q4_6 || 'N/A',
    currentClass: childData.surveyData?.['section-4']?.q4_2 || 'N/A', 
    school: childData.surveyData?.['section-4']?.q4_3 || 'N/A', 
    schoolCommuteType: childData.surveyData?.['section-4']?.q4_4 || 'N/A', 
    lastStudiedClass: childData.surveyData?.['section-4']?.q4_8 || 'N/A',
    dropoutReasons: Array.isArray(childData.surveyData?.['section-4']?.q4_9) ? 
                     childData.surveyData?.['section-4']?.q4_9.join(', ') : 
                     childData.surveyData?.['section-4']?.q4_9 || 'N/A',
    dropoutReasonOther: childData.surveyData?.['section-4']?.q4_10 || '',
    neverEnrolledReasons: Array.isArray(childData.surveyData?.['section-4']?.q4_11) ? 
                          childData.surveyData?.['section-4']?.q4_11.join(', ') : 
                          childData.surveyData?.['section-4']?.q4_11 || 'N/A',
    neverEnrolledReasonOther: childData.surveyData?.['section-4']?.q4_12 || 'NA',
    schoolStatus: (childData.surveyData?.['section-4']?.q4_1 === 'नहीं' && childData.surveyData?.['section-4']?.q4_7 === 'शाला त्यागी') ? 'Dropout'
      : (childData.surveyData?.['section-4']?.q4_1 === 'नहीं' && childData.surveyData?.['section-4']?.q4_7 === 'अप्रवेशी') ? 'Never Enrolled'
      : (childData.surveyData?.['section-4']?.q4_1 === 'हाँ' || childData.surveyData?.['section-4']?.q4_1 === 'आंगनवाड़ी') ? 'Enrolled' : 'N/A',
    hasDisability: childData.surveyData?.['section-6']?.q6_1 === 'हाँ' ? 'Yes' :
                   childData.surveyData?.['section-6']?.q6_1 === 'नहीं' ? 'No' : 'N/A',
    disabilityTypes: Array.isArray(childData.surveyData?.['section-6']?.q6_2) ? 
                     childData.surveyData?.['section-6']?.q6_2.join(', ') :
                     childData.surveyData?.['section-6']?.q6_2 || 'N/A',
    otherDisabilitySpecification: childData.surveyData?.['section-6']?.q6_3 || 'N/A',
    hasCasteCertificate: childData.surveyData?.['section-5']?.q5_1 === 'हाँ' ? 'Yes' :
                         childData.surveyData?.['section-5']?.q5_1 === 'नहीं' ? 'No' : 'N/A',
    hasResidenceCertificate: childData.surveyData?.['section-5']?.q5_2 === 'हाँ' ? 'Yes' :
                             childData.surveyData?.['section-5']?.q5_2 === 'नहीं' ? 'No' : 'N/A',
    hasAadhaar: childData.surveyData?.['section-5']?.q5_3 === 'हाँ' ? 'Yes' :
                childData.surveyData?.['section-5']?.q5_3 === 'नहीं' ? 'No' : 'N/A',
    surveyedBy: childData.surveyMeta?.surveyedBy || 'N/A',
    surveyedAt: childData.surveyMeta?.surveyedAt ? new Date(childData.surveyMeta.surveyedAt).toLocaleDateString() : 'N/A',
    lastUpdatedAt: childData.surveyMeta?.lastUpdatedAt ? new Date(childData.surveyMeta.lastUpdatedAt).toLocaleDateString() : 'N/A',
    lastUpdatedBy: childData.surveyMeta?.lastUpdatedBy || 'N/A'
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

  if (!id || !transformedData) {
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
            onClick={() => navigate('/children-records')} 
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
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-medium">{transformedData.name}</p>
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
                <label className="text-sm font-medium text-muted-foreground">Aadhaar Number</label>
                <p className="text-lg font-medium">
                  {transformedData.hasAadhaar === 'Yes' ? transformedData.aadhaarNumber : 'Not Available'}
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
                <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                <p className="text-lg font-medium">{transformedData.fatherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                <p className="text-lg font-medium">{transformedData.motherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">House Number (Grih Kramank)</label>
                <p className="text-lg font-medium">{transformedData.houseNumber}</p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Administrative  Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M3 21h18"></path>
                <path d="M5 21V7l8-4v18"></path>
                <path d="M19 21V11l-6-4"></path>
                <path d="M9 9h1"></path>
                <path d="M9 13h1"></path>
                <path d="M9 17h1"></path>
              </svg>
              Administrative Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             
              <div>
                <label className="text-sm font-medium text-muted-foreground">Para</label>
                <p className="text-lg font-medium">{transformedData.para}</p>
              </div>

               <div>
                <label className="text-sm font-medium text-muted-foreground">Village</label>
                <p className="text-lg font-medium">{transformedData.village}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gram Panchayat</label>
                <p className="text-lg font-medium">{transformedData.gramPanchayat}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Block</label>
                <p className="text-lg font-medium">{transformedData.block}</p>
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
                <label className="text-sm font-medium text-muted-foreground">Caste</label>
                <p className="text-lg font-medium">
                  {transformedData.caste === "अन्य" || transformedData.caste === "Other" 
                    ? `${transformedData.caste} (${transformedData.otherCaste})` 
                    : transformedData.caste}
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
                <label className="text-sm font-medium text-muted-foreground">Has Caste Certificate</label>
                <p className="text-lg font-medium">{transformedData.hasCasteCertificate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Has Residence Certificate</label>
                <p className="text-lg font-medium">{transformedData.hasResidenceCertificate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Has Aadhaar</label>
                <p className="text-lg font-medium">{transformedData.hasAadhaar}</p>
              </div>
             
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
              {/* Goes to School field shown for all status types */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Goes to School</label>
                  <p className="text-lg font-medium">{transformedData.goesToSchool}</p>
                </div>
              </div>
              {/* Enrolled fields */}
              {transformedData.schoolStatus === 'Enrolled' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">School Name & Para</label>
                    <p className="text-lg font-medium">{transformedData.school}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Class</label>
                    <p className="text-lg font-medium">{transformedData.currentClass}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Commute Type</label>
                    <p className="text-lg font-medium">{transformedData.schoolCommuteType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Attendance Status</label>
                    <p className="text-lg font-medium">{transformedData.attendanceStatus}</p>
                  </div>
                </div>
              )}
              {/* Dropout fields: Only if schoolStatus is Dropout AND goesToSchool is No */}
              {transformedData.schoolStatus === 'Dropout' && transformedData.goesToSchool === 'No' && (
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
              {/* Never Enrolled fields: Only if schoolStatus is Never Enrolled AND goesToSchool is No */}
              {transformedData.schoolStatus === 'Never Enrolled' && transformedData.goesToSchool === 'No' && (
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
