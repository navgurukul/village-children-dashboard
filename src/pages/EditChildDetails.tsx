
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, School, Home, Heart } from 'lucide-react';

interface EditChildDetailsProps {
  childId: string | null;
  onBack: () => void;
  onSuccess: () => void;
}

const EditChildDetails = ({ childId, onBack, onSuccess }: EditChildDetailsProps) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating child details:', formData);
    onSuccess();
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
            Back to Child Details
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Edit Child Details</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="space-y-2">
                  <Label htmlFor="id">Aadhar Number</Label>
                  <Input
                    id="id"
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caste">Caste</Label>
                  <Select value={formData.caste} onValueChange={(value) => setFormData(prev => ({ ...prev, caste: value }))}>
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    id="fatherName"
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familyIncome">Family Income Range</Label>
                  <Select value={formData.familyIncome} onValueChange={(value) => setFormData(prev => ({ ...prev, familyIncome: value }))}>
                    <SelectTrigger>
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
                    required
                  />
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
              <div className="space-y-2">
                <Label htmlFor="medicalIssues">Medical Issues</Label>
                <Textarea
                  id="medicalIssues"
                  value={formData.medicalIssues}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalIssues: e.target.value }))}
                  placeholder="Describe any medical issues..."
                />
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
                <div className="space-y-2">
                  <Label htmlFor="schoolStatus">Current Status</Label>
                  <Select value={formData.schoolStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, schoolStatus: value }))}>
                    <SelectTrigger>
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoutReason">Dropout Reason</Label>
                      <Textarea
                        id="dropoutReason"
                        value={formData.dropoutReason}
                        onChange={(e) => setFormData(prev => ({ ...prev, dropoutReason: e.target.value }))}
                        placeholder="Explain the reason for dropout..."
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Update Child Details
            </Button>
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChildDetails;
