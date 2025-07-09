
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, School, Home, Heart } from 'lucide-react';
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface EditChildDetailsProps {
  childId: string | null;
  onBack: () => void;
  onSuccess: () => void;
  fromChildDetails?: boolean;
}

const EditChildDetails = ({ childId, onBack, onSuccess, fromChildDetails = false }: EditChildDetailsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "1234567890123456",
    name: "Rahul Kumar",
    age: "12",
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childId) return;

    setIsLoading(true);
    try {
      const updatePayload = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        block: formData.block,
        village: formData.village,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        familyIncome: formData.familyIncome,
        caste: formData.caste,
        medicalIssues: formData.medicalIssues,
        schoolStatus: formData.schoolStatus,
        school: formData.school,
        dropoutReason: formData.dropoutReason,
        lastAttended: formData.lastAttended
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

  const handleDelete = async () => {
    if (!childId) return;
    
    if (!window.confirm('Are you sure you want to delete this child record? This action cannot be undone.')) {
      return;
    }

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
                <Label htmlFor="id">Aadhar Number</Label>
                <Input
                  id="id"
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caste">Caste</Label>
                <Select value={formData.caste} onValueChange={(value) => setFormData(prev => ({ ...prev, caste: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Family Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                  className="bg-white"
                  required
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="familyIncome">Family Income Range</Label>
                <Select value={formData.familyIncome} onValueChange={(value) => setFormData(prev => ({ ...prev, familyIncome: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Below ₹25,000">Below ₹25,000</SelectItem>
                    <SelectItem value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</SelectItem>
                    <SelectItem value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</SelectItem>
                    <SelectItem value="Above ₹1,00,000">Above ₹1,00,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                  className="bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Medical Information</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalIssues">Medical Issues</Label>
              <Textarea
                id="medicalIssues"
                value={formData.medicalIssues}
                onChange={(e) => setFormData(prev => ({ ...prev, medicalIssues: e.target.value }))}
                className="bg-white"
                placeholder="Describe any medical issues..."
              />
            </div>
          </div>

          {/* School Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <School className="h-5 w-5" />
              <h2 className="text-xl font-semibold">School Status</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="schoolStatus">Current Status</Label>
                <Select value={formData.schoolStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, schoolStatus: value }))}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enrolled">Enrolled</SelectItem>
                    <SelectItem value="Dropout">Dropout</SelectItem>
                    <SelectItem value="Never Enrolled">Never Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  className="bg-white"
                />
              </div>

              {formData.schoolStatus === 'Dropout' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="lastAttended">Last Attended</Label>
                    <Input
                      id="lastAttended"
                      type="date"
                      value={formData.lastAttended}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastAttended: e.target.value }))}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropoutReason">Dropout Reason</Label>
                    <Textarea
                      id="dropoutReason"
                      value={formData.dropoutReason}
                      onChange={(e) => setFormData(prev => ({ ...prev, dropoutReason: e.target.value }))}
                      className="bg-white"
                      placeholder="Explain the reason for dropout..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
              Delete Record
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Child Details'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChildDetails;
