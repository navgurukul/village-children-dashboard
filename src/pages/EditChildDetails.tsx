import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, User, School, Home, Heart } from 'lucide-react';
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Child {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  block: string;
  panchayat: string;
  para: string;
  motherName: string;
  fatherName: string;
  educationStatus: string;
  schoolName: string;
  aadhaarNumber: string;
  caste: string;
}

interface EditChildDetailsProps {
  childId: string | null;
  childData?: Child | null;
  onBack: () => void;
  onSuccess: () => void;
  fromChildDetails?: boolean;
}

const EditChildDetails = ({ childId, childData, onBack, onSuccess, fromChildDetails = false }: EditChildDetailsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    para: "",
    panchayat: "",
    cluster: "",
    block: "",
    motherTongue: "",
    motherTongueOther: "", // Add field for other mother tongue
    motherName: "",
    fatherName: "",
    motherEducated: false,
    fatherEducated: false,
    familyOccupation: "",
    otherOccupation: "", // Add field for other occupation
    caste: "",
    otherCaste: "", // Add field for other caste
    parentsStatus: "",
    livesWithWhom: "",
    otherLivesWith: "", // Add field for other lives with
    goesToSchool: true,
    schoolName: "",
    schoolPara: "",
    currentClass: "",
    attendanceStatus: "",
    educationStatus: "",
    lastStudiedClass: "", // Add field for last studied class (dropouts)
    dropoutReasons: [], // Add field for dropout reasons
    dropoutReasonOther: "", // Add field for other dropout reason
    neverEnrolledReasons: [], // Add field for never enrolled reasons
    neverEnrolledReasonOther: "", // Add field for other never enrolled reason
    economicStatus: "", // Ration card type
    rationCardNumber: "", // Ration card number
    hasCasteCertificate: false,
    hasResidenceCertificate: false,
    hasAadhaar: false,
    aadhaarNumber: "",
    hasDisability: false,
    disabilityTypes: [], // Add field for disability types
    otherDisabilitySpecification: "" // Add field for other disability
  });

  // Show loading initially since we don't have child data
  useEffect(() => {
    if (childData) {
      // Map from API response to form data
      const data = childData as any; // Cast to access additional fields
      
      // Extract data from surveyData if available
      const surveyData = data.surveyData || {};
      const section1 = surveyData['section-1'] || {};
      const section2 = surveyData['section-2'] || {};
      const section3 = surveyData['section-3'] || {};
      const section4 = surveyData['section-4'] || {};
      const section5 = surveyData['section-5'] || {};
      const section6 = surveyData['section-6'] || {};
      
      // Helper for yes/no conversion
      const convertToBoolean = (value?: string) => value === 'हाँ';
      
      setFormData({
        // Section 1 - Personal info
        fullName: section1.q1_1 || data.fullName || "",
        age: data.age?.toString() || "",
        gender: section1.q1_4 || data.gender || "",
        para: section1.q1_5 || data.para || "",
        panchayat: section1.q1_6 || data.panchayat || "",
        cluster: data.cluster || "",
        block: section1.q1_8 || data.block || "",
        motherTongue: section1.q1_9 || data.motherTongue || "",
        motherTongueOther: section1.q1_9_other || "",
        motherName: section1.q1_10 || data.motherName || "",
        fatherName: section1.q1_11 || data.fatherName || "",
        motherEducated: convertToBoolean(section1.q1_12) || data.motherEducated || false,
        fatherEducated: convertToBoolean(section1.q1_13) || data.fatherEducated || false,
        
        // Section 2 - Family info
        familyOccupation: section2.q2_1 || data.familyOccupation || "",
        otherOccupation: section2.q2_1_other || "",
        caste: section2.q2_2 || data.caste || "",
        otherCaste: section2.q2_2_other || "",
        parentsStatus: section2.q2_3 || data.parentsStatus || "",
        livesWithWhom: section2.q2_4 || data.livesWithWhom || "",
        otherLivesWith: section2.q2_4_other || "",
        
        // Section 3 - Economic info
        economicStatus: section3.q3_1 || data.economicStatus || "",
        rationCardNumber: section3.q3_2 || data.rationCardNumber || "",
        
        // Section 4 - Education info
        goesToSchool: convertToBoolean(section4.q4_1) || data.goesToSchool || false,
        schoolName: section4.q4_2 || data.schoolName || "",
        schoolPara: data.schoolPara || "", 
        currentClass: section4.q4_4 || data.currentClass || "",
        attendanceStatus: section4.q4_5 || data.attendanceStatus || "",
        educationStatus: section4.q4_6 === "शाला त्यागी" ? "dropout" : 
                        section4.q4_6 === "अप्रवेशी" ? "never_enrolled" : 
                        convertToBoolean(section4.q4_1) ? "enrolled" : 
                        data.educationStatus || "",
        lastStudiedClass: section4.q4_7 || "",
        dropoutReasons: Array.isArray(section4.q4_8) ? section4.q4_8 : 
                        section4.q4_8 ? [section4.q4_8] : [],
        dropoutReasonOther: section4.q4_9 || "",
        neverEnrolledReasons: Array.isArray(section4.q4_10) ? section4.q4_10 : 
                            section4.q4_10 ? [section4.q4_10] : [],
        neverEnrolledReasonOther: section4.q4_11 || "",
        
        // Section 5 - Document info
        hasCasteCertificate: convertToBoolean(section5.q5_2) || data.hasCasteCertificate || false,
        hasResidenceCertificate: convertToBoolean(section5.q5_3) || data.hasResidenceCertificate || false,
        hasAadhaar: convertToBoolean(section5.q5_1) || data.hasAadhaar || false,
        aadhaarNumber: section5.q5_4 || data.aadhaarNumber || "",
        
        // Section 6 - Health info
        hasDisability: convertToBoolean(section6.q6_1) || data.hasDisability || false,
        disabilityTypes: Array.isArray(section6.q6_2) ? section6.q6_2 :
                         section6.q6_2 ? [section6.q6_2] : [],
        otherDisabilitySpecification: section6.q6_3 || ""
      });
      setIsLoadingData(false);
    } else if (childId) {
      setIsLoadingData(false);
    }
  }, [childData, childId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childId) return;

    setIsLoading(true);
    try {
      // Format the payload according to the API specification
      const updatePayload: import('@/lib/api').UpdateChildPayload = {
        villageId: (childData as any)?.villageId || "8fbb3da4-0a54-4ea5-bc68-24aaa7861329", // Get from child data
        surveyData: {
          "section-1": {
            "q1_1": formData.fullName,
            "q1_2": formData.age,
            "q1_3": "2012-03-15", // This should be calculated from age or stored separately
            "q1_4": formData.gender,
            "q1_5": formData.para,
            "q1_6": formData.panchayat,
            "q1_7": formData.cluster,
            "q1_8": formData.block,
            "q1_9": formData.motherTongue,
            "q1_9_other": formData.motherTongue === "अन्य" ? formData.motherTongueOther : null,
            "q1_10": formData.motherName,
            "q1_11": formData.fatherName,
            "q1_12": formData.motherEducated ? "हाँ" : "नहीं",
            "q1_13": formData.fatherEducated ? "हाँ" : "नहीं"
          },
          "section-2": {
            "q2_1": formData.familyOccupation,
            "q2_1_other": formData.otherOccupation || null,
            "q2_2": formData.caste,
            "q2_2_other": formData.otherCaste || null,
            "q2_3": formData.parentsStatus,
            "q2_4": formData.livesWithWhom,
            "q2_4_other": formData.otherLivesWith || null,
            "q2_5": null
          },
          "section-3": {
            "q3_1": formData.economicStatus || "BPL",
            "q3_2": formData.rationCardNumber
          },
          "section-4": {
            "q4_1": formData.goesToSchool ? "हाँ" : "नहीं",
            "q4_2": formData.schoolName,
            "q4_3": formData.currentClass,
            "q4_4": formData.attendanceStatus,
            "q4_5": formData.educationStatus,
            "q4_6": formData.educationStatus === "dropout" ? "शाला त्यागी" : 
                   formData.educationStatus === "never_enrolled" ? "अप्रवेशी" : formData.currentClass,
            "q4_7": formData.lastStudiedClass || null,
            "q4_8": formData.dropoutReasons.length > 0 ? formData.dropoutReasons : null,
            "q4_9": formData.dropoutReasons.includes("अन्य") ? formData.dropoutReasonOther : null,
            "q4_10": formData.neverEnrolledReasons.length > 0 ? formData.neverEnrolledReasons : null,
            "q4_11": formData.neverEnrolledReasons.includes("अन्य") ? formData.neverEnrolledReasonOther : null
          },
          "section-5": {
            "q5_1": formData.hasAadhaar ? "हाँ" : "नहीं",
            "q5_2": formData.hasCasteCertificate ? "हाँ" : "नहीं",
            "q5_3": formData.hasResidenceCertificate ? "हाँ" : "नहीं",
            "q5_4": formData.aadhaarNumber
          },
          "section-6": {
            "q6_1": formData.hasDisability ? "हाँ" : "नहीं",
            "q6_2": formData.disabilityTypes.length > 0 ? formData.disabilityTypes : null,
            "q6_3": formData.otherDisabilitySpecification || null
          }
        }
      };

      await apiClient.updateChild(childId, updatePayload);
      toast({
        title: "Success",
        description: "Child details updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating child:', error);
      toast({
        title: "Error",
        description: "Failed to update child details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!childId) return;

    setIsLoading(true);
    try {
      await apiClient.deleteChild(childId);
      toast({
        title: "Success",
        description: "Child record deleted successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        title: "Error",
        description: "Failed to delete child record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
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
            {fromChildDetails ? 'Back to Child Details' : 'Back to Records'}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Edit Child Details</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="लड़का">लड़का</SelectItem>
                    <SelectItem value="लड़की">लड़की</SelectItem>
                    <SelectItem value="अन्य">अन्य</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caste">Caste</Label>
                <Select value={formData.caste} onValueChange={(value) => setFormData(prev => ({ ...prev, caste: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GEN">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="अन्य">अन्य (Other)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.caste === "अन्य" && (
                <div className="space-y-2">
                  <Label htmlFor="otherCaste">Other Caste (Specify)</Label>
                  <Input
                    id="otherCaste"
                    type="text"
                    value={formData.otherCaste}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherCaste: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                    if (value.length <= 12) {
                      setFormData(prev => ({ ...prev, aadhaarNumber: value }));
                    }
                  }}
                  className="bg-white"
                  maxLength={12}
                  pattern="[0-9]{12}"
                  title="Please enter exactly 12 digits"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherTongue">Mother Tongue</Label>
                <Select value={formData.motherTongue} onValueChange={(value) => setFormData(prev => ({ ...prev, motherTongue: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="हिन्दी">हिन्दी</SelectItem>
                    <SelectItem value="संथाली">संथाली</SelectItem>
                    <SelectItem value="उड़िया">उड़िया</SelectItem>
                    <SelectItem value="कुरुख">कुरुख</SelectItem>
                    <SelectItem value="मुंडारी">मुंडारी</SelectItem>
                    <SelectItem value="हो">हो</SelectItem>
                    <SelectItem value="खड़िया">खड़िया</SelectItem>
                    <SelectItem value="अन्य">अन्य (Other)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.motherTongue === "अन्य" && (
                <div className="space-y-2">
                  <Label htmlFor="motherTongueOther">Other Mother Tongue (Specify)</Label>
                  <Input
                    id="motherTongueOther"
                    type="text"
                    value={formData.motherTongueOther}
                    onChange={(e) => setFormData(prev => ({ ...prev, motherTongueOther: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Family Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Family Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="familyOccupation">Family Occupation</Label>
                <Select value={formData.familyOccupation} onValueChange={(value) => setFormData(prev => ({ ...prev, familyOccupation: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="खेती">खेती (Farming)</SelectItem>
                    <SelectItem value="मजदूरी">मजदूरी (Labor)</SelectItem>
                    <SelectItem value="नौकरी">नौकरी (Job)</SelectItem>
                    <SelectItem value="अन्य">अन्य (Other)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.familyOccupation === "अन्य" && (
                <div className="space-y-2">
                  <Label htmlFor="otherOccupation">Other Occupation (Specify)</Label>
                  <Input
                    id="otherOccupation"
                    type="text"
                    value={formData.otherOccupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherOccupation: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="parentsStatus">Parents Status</Label>
                <Select value={formData.parentsStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, parentsStatus: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="दोनों जीवित हैं">दोनों जीवित हैं</SelectItem>
                    <SelectItem value="केवल माता जीवित">केवल माता जीवित</SelectItem>
                    <SelectItem value="केवल पिता जीवित">केवल पिता जीवित</SelectItem>
                    <SelectItem value="दोनों नहीं हैं">दोनों नहीं हैं</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="livesWithWhom">Lives With</Label>
                <Select value={formData.livesWithWhom} onValueChange={(value) => setFormData(prev => ({ ...prev, livesWithWhom: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="माता-पिता">माता-पिता के साथ</SelectItem>
                    <SelectItem value="दादा-दादी">दादा-दादी</SelectItem>
                    <SelectItem value="रिश्तेदार">रिश्तेदारों के साथ</SelectItem>
                    <SelectItem value="अकेले">अकेले</SelectItem>
                    <SelectItem value="अन्य">अन्य (Other)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.livesWithWhom === "अन्य" && (
                <div className="space-y-2">
                  <Label htmlFor="otherLivesWith">Other Living Arrangement (Specify)</Label>
                  <Input
                    id="otherLivesWith"
                    type="text"
                    value={formData.otherLivesWith}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherLivesWith: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="para">Para/Ward</Label>
                <Input
                  id="para"
                  type="text"
                  value={formData.para}
                  onChange={(e) => setFormData(prev => ({ ...prev, para: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panchayat">Panchayat</Label>
                <Input
                  id="panchayat"
                  type="text"
                  value={formData.panchayat}
                  onChange={(e) => setFormData(prev => ({ ...prev, panchayat: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blockField">Block</Label>
                <Input
                  id="blockField"
                  type="text"
                  value={formData.block}
                  onChange={(e) => setFormData(prev => ({ ...prev, block: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cluster">Cluster</Label>
                <Input
                  id="cluster"
                  type="text"
                  value={formData.cluster}
                  onChange={(e) => setFormData(prev => ({ ...prev, cluster: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="motherEducated"
                  checked={formData.motherEducated}
                  onChange={(e) => setFormData(prev => ({ ...prev, motherEducated: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="motherEducated">Mother Educated</Label>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="fatherEducated"
                  checked={formData.fatherEducated}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherEducated: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="fatherEducated">Father Educated</Label>
              </div>
            </div>
          </div>

          {/* Economic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Economic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="economicStatus">Economic Status / Ration Card Type</Label>
                <Select value={formData.economicStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, economicStatus: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APL">APL</SelectItem>
                    <SelectItem value="BPL">BPL</SelectItem>
                    <SelectItem value="Antyodaya">Antyodaya</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rationCardNumber">Ration Card Number</Label>
                <Input
                  id="rationCardNumber"
                  type="text"
                  value={formData.rationCardNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, rationCardNumber: e.target.value }))}
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Medical & Certificate Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasDisability"
                  checked={formData.hasDisability}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasDisability: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="hasDisability">Has Disability</Label>
              </div>
              
              {formData.hasDisability && (
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="disabilityTypes">Disability Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.disabilityTypes.includes("दृष्टिबाधित")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...formData.disabilityTypes, "दृष्टिबाधित"]
                            : formData.disabilityTypes.filter(t => t !== "दृष्टिबाधित");
                          setFormData(prev => ({ ...prev, disabilityTypes: updatedTypes }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>दृष्टिबाधित (Visually Impaired)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.disabilityTypes.includes("श्रवण बाधित")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...formData.disabilityTypes, "श्रवण बाधित"]
                            : formData.disabilityTypes.filter(t => t !== "श्रवण बाधित");
                          setFormData(prev => ({ ...prev, disabilityTypes: updatedTypes }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>श्रवण बाधित (Hearing Impaired)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.disabilityTypes.includes("अस्थि बाधित")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...formData.disabilityTypes, "अस्थि बाधित"]
                            : formData.disabilityTypes.filter(t => t !== "अस्थि बाधित");
                          setFormData(prev => ({ ...prev, disabilityTypes: updatedTypes }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>अस्थि बाधित (Physically Challenged)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.disabilityTypes.includes("अन्य")}
                        onChange={(e) => {
                          const updatedTypes = e.target.checked
                            ? [...formData.disabilityTypes, "अन्य"]
                            : formData.disabilityTypes.filter(t => t !== "अन्य");
                          setFormData(prev => ({ ...prev, disabilityTypes: updatedTypes }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>अन्य (Other)</span>
                    </label>
                  </div>
                </div>
              )}
              
              {formData.hasDisability && formData.disabilityTypes.includes("अन्य") && (
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="otherDisabilitySpecification">Other Disability Type (Specify)</Label>
                  <Input
                    id="otherDisabilitySpecification"
                    type="text"
                    value={formData.otherDisabilitySpecification}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherDisabilitySpecification: e.target.value }))}
                    className="bg-white"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasCasteCertificate"
                  checked={formData.hasCasteCertificate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasCasteCertificate: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="hasCasteCertificate">Has Caste Certificate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasResidenceCertificate"
                  checked={formData.hasResidenceCertificate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasResidenceCertificate: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="hasResidenceCertificate">Has Residence Certificate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasAadhaar"
                  checked={formData.hasAadhaar}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasAadhaar: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="hasAadhaar">Has Aadhaar</Label>
              </div>
            </div>
          </div>

          {/* School Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <School className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Education Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="educationStatus">Education Status</Label>
                <Select value={formData.educationStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, educationStatus: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                    <SelectItem value="dropout">Dropout</SelectItem>
                    <SelectItem value="never_enrolled">Never Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolPara">School Para/Ward</Label>
                <Input
                  id="schoolPara"
                  type="text"
                  value={formData.schoolPara}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolPara: e.target.value }))}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentClass">Current Class</Label>
                <Input
                  id="currentClass"
                  type="text"
                  value={formData.currentClass}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentClass: e.target.value }))}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendanceStatus">Attendance Status</Label>
                <Select value={formData.attendanceStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, attendanceStatus: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="नियमित">नियमित</SelectItem>
                    <SelectItem value="अनियमित">अनियमित</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="goesToSchool"
                  checked={formData.goesToSchool}
                  onChange={(e) => setFormData(prev => ({ ...prev, goesToSchool: e.target.checked }))}
                  className="h-4 w-4"
                />
                <Label htmlFor="goesToSchool">Goes to School</Label>
              </div>
              
              {formData.educationStatus === "dropout" && (
                <>
                  <div className="space-y-2 col-span-3">
                    <Label htmlFor="lastStudiedClass">Last Class Studied</Label>
                    <Select value={formData.lastStudiedClass} onValueChange={(value) => setFormData(prev => ({ ...prev, lastStudiedClass: value }))}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Class 1</SelectItem>
                        <SelectItem value="2">Class 2</SelectItem>
                        <SelectItem value="3">Class 3</SelectItem>
                        <SelectItem value="4">Class 4</SelectItem>
                        <SelectItem value="5">Class 5</SelectItem>
                        <SelectItem value="6">Class 6</SelectItem>
                        <SelectItem value="7">Class 7</SelectItem>
                        <SelectItem value="8">Class 8</SelectItem>
                        <SelectItem value="9">Class 9</SelectItem>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="11">Class 11</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 col-span-3">
                    <Label htmlFor="dropoutReasons">Dropout Reasons</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.dropoutReasons.includes("आर्थिक स्थिति")}
                          onChange={(e) => {
                            const updatedReasons = e.target.checked
                              ? [...formData.dropoutReasons, "आर्थिक स्थिति"]
                              : formData.dropoutReasons.filter(r => r !== "आर्थिक स्थिति");
                            setFormData(prev => ({ ...prev, dropoutReasons: updatedReasons }));
                          }}
                          className="h-4 w-4"
                        />
                        <span>आर्थिक स्थिति (Financial Situation)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.dropoutReasons.includes("रुचि नहीं")}
                          onChange={(e) => {
                            const updatedReasons = e.target.checked
                              ? [...formData.dropoutReasons, "रुचि नहीं"]
                              : formData.dropoutReasons.filter(r => r !== "रुचि नहीं");
                            setFormData(prev => ({ ...prev, dropoutReasons: updatedReasons }));
                          }}
                          className="h-4 w-4"
                        />
                        <span>रुचि नहीं (Not Interested)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.dropoutReasons.includes("स्कूल दूर")}
                          onChange={(e) => {
                            const updatedReasons = e.target.checked
                              ? [...formData.dropoutReasons, "स्कूल दूर"]
                              : formData.dropoutReasons.filter(r => r !== "स्कूल दूर");
                            setFormData(prev => ({ ...prev, dropoutReasons: updatedReasons }));
                          }}
                          className="h-4 w-4"
                        />
                        <span>स्कूल दूर (School Far Away)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.dropoutReasons.includes("घरेलू काम")}
                          onChange={(e) => {
                            const updatedReasons = e.target.checked
                              ? [...formData.dropoutReasons, "घरेलू काम"]
                              : formData.dropoutReasons.filter(r => r !== "घरेलू काम");
                            setFormData(prev => ({ ...prev, dropoutReasons: updatedReasons }));
                          }}
                          className="h-4 w-4"
                        />
                        <span>घरेलू काम (Household Work)</span>
                      </label>
                    </div>
                  </div>
                </>
              )}
              
              {formData.educationStatus === "never_enrolled" && (
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="neverEnrolledReasons">Reasons for Never Enrolling</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.neverEnrolledReasons.includes("आर्थिक स्थिति")}
                        onChange={(e) => {
                          const updatedReasons = e.target.checked
                            ? [...formData.neverEnrolledReasons, "आर्थिक स्थिति"]
                            : formData.neverEnrolledReasons.filter(r => r !== "आर्थिक स्थिति");
                          setFormData(prev => ({ ...prev, neverEnrolledReasons: updatedReasons }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>आर्थिक स्थिति (Financial Situation)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.neverEnrolledReasons.includes("रुचि नहीं")}
                        onChange={(e) => {
                          const updatedReasons = e.target.checked
                            ? [...formData.neverEnrolledReasons, "रुचि नहीं"]
                            : formData.neverEnrolledReasons.filter(r => r !== "रुचि नहीं");
                          setFormData(prev => ({ ...prev, neverEnrolledReasons: updatedReasons }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>रुचि नहीं (Not Interested)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.neverEnrolledReasons.includes("स्कूल दूर")}
                        onChange={(e) => {
                          const updatedReasons = e.target.checked
                            ? [...formData.neverEnrolledReasons, "स्कूल दूर"]
                            : formData.neverEnrolledReasons.filter(r => r !== "स्कूल दूर");
                          setFormData(prev => ({ ...prev, neverEnrolledReasons: updatedReasons }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>स्कूल दूर (School Far Away)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.neverEnrolledReasons.includes("जागरूकता की कमी")}
                        onChange={(e) => {
                          const updatedReasons = e.target.checked
                            ? [...formData.neverEnrolledReasons, "जागरूकता की कमी"]
                            : formData.neverEnrolledReasons.filter(r => r !== "जागरूकता की कमी");
                          setFormData(prev => ({ ...prev, neverEnrolledReasons: updatedReasons }));
                        }}
                        className="h-4 w-4"
                      />
                      <span>जागरूकता की कमी (Lack of Awareness)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Child Details'}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Child Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this child record? This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditChildDetails;
