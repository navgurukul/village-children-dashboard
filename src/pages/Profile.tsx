
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, X, User, LogOut } from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

const Profile = ({ onBack, onLogout }: ProfileProps) => {
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    mobile: '+91 9876543210',
    profilePicture: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileData(prev => ({ ...prev, profilePicture: '' }));
  };

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    onBack();
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            onClick={onBack} 
            variant="link" 
            className="gap-2 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Profile Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.profilePicture} alt="Profile" />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <label htmlFor="profile-upload">
                  <Button variant="outline" className="gap-2" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4" />
                      {profileData.profilePicture ? 'Change Picture' : 'Upload Picture'}
                    </span>
                  </Button>
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {profileData.profilePicture && (
                  <Button variant="outline" size="icon" onClick={handleRemoveImage}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={profileData.mobile}
                onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value }))}
                className="bg-white"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <Button 
              onClick={onLogout} 
              variant="destructive" 
              className="gap-2 w-full"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
