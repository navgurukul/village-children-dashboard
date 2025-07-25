
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
    motherName: "",
    fatherName: "",
    motherEducated: false,
    fatherEducated: false,
    familyOccupation: "",
    caste: "",
    parentsStatus: "",
    livesWithWhom: "",
    goesToSchool: true,
    schoolName: "",
    schoolPara: "",
    currentClass: "",
    attendanceStatus: "",
    educationStatus: "",
    hasCasteCertificate: false,
    hasResidenceCertificate: false,
    hasAadhaar: false,
    aadhaarNumber: "",
    hasDisability: false
  });

  // Show loading initially since we don't have child data
  useEffect(() => {
    if (childData) {
      // Map from API response to form data
      const data = childData as any; // Cast to access additional fields
      setFormData({
        fullName: data.fullName || "",
        age: data.age?.toString() || "",
        gender: data.gender || "",
        para: data.para || "",
        panchayat: data.panchayat || "",
        cluster: data.cluster || "",
        block: data.block || "",
        motherTongue: data.motherTongue || "",
        motherName: data.motherName || "",
        fatherName: data.fatherName || "",
        motherEducated: data.motherEducated || false,
        fatherEducated: data.fatherEducated || false,
        familyOccupation: data.familyOccupation || "",
        caste: data.caste || "",
        parentsStatus: data.parentsStatus || "",
        livesWithWhom: data.livesWithWhom || "",
        goesToSchool: data.goesToSchool !== undefined ? data.goesToSchool : true,
        schoolName: data.schoolName || "",
        schoolPara: data.schoolPara || "",
        currentClass: data.currentClass || "",
        attendanceStatus: data.attendanceStatus || "",
        educationStatus: data.educationStatus || "",
        hasCasteCertificate: data.hasCasteCertificate || false,
        hasResidenceCertificate: data.hasResidenceCertificate || false,
        hasAadhaar: data.hasAadhaar || false,
        aadhaarNumber: data.aadhaarNumber || "",
        hasDisability: data.hasDisability || false
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
      const updatePayload = {
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
            "q1_10": formData.motherName,
            "q1_11": formData.fatherName,
            "q1_12": formData.motherEducated ? "हाँ" : "नहीं",
            "q1_13": formData.fatherEducated ? "हाँ" : "नहीं"
          },
          "section-2": {
            "q2_1": formData.familyOccupation,
            "q2_2": formData.caste,
            "q2_3": formData.parentsStatus,
            "q2_4": formData.livesWithWhom,
            "q2_5": null
          },
          "section-3": {
            "q3_1": "BPL", // This should come from form data if available
            "q3_2": formData.aadhaarNumber
          },
          "section-4": {
            "q4_1": formData.goesToSchool ? "हाँ" : "नहीं",
            "q4_2": null,
            "q4_3": null,
            "q4_4": null,
            "q4_5": formData.educationStatus,
            "q4_6": formData.currentClass,
            "q4_7": [], // This should come from form data if available
            "q4_8": null
          },
          "section-5": {
            "q5_1": formData.hasAadhaar ? "हाँ" : "नहीं",
            "q5_2": formData.hasCasteCertificate ? "हाँ" : "नहीं",
            "q5_3": formData.hasResidenceCertificate ? "हाँ" : "नहीं",
            "q5_4": formData.aadhaarNumber
          },
          "section-6": {
            "q6_1": formData.hasDisability ? "हाँ" : "नहीं",
            "q6_2": null
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
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                <Input
                  id="aadhaarNumber"
                  type="text"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, aadhaarNumber: e.target.value }))}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherTongue">Mother Tongue</Label>
                <Input
                  id="motherTongue"
                  type="text"
                  value={formData.motherTongue}
                  onChange={(e) => setFormData(prev => ({ ...prev, motherTongue: e.target.value }))}
                  className="bg-white"
                />
              </div>
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
                <Input
                  id="familyOccupation"
                  type="text"
                  value={formData.familyOccupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, familyOccupation: e.target.value }))}
                  className="bg-white"
                />
              </div>
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
                    <SelectItem value="माता-पिता के साथ">माता-पिता के साथ</SelectItem>
                    <SelectItem value="हॉस्टल">हॉस्टल</SelectItem>
                    <SelectItem value="रिश्तेदारों के साथ">रिश्तेदारों के साथ</SelectItem>
                    <SelectItem value="अकेले">अकेले</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                <Label htmlFor="block">Block</Label>
                <Input
                  id="block"
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
