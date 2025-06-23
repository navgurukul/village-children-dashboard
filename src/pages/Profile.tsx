
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Camera, Trash2, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: ''
    }));
  };

  return (
    <div className={`p-4 md:p-6 bg-background min-h-screen ${isMobile ? 'pt-4' : ''}`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {!isMobile && (
          <Button 
            onClick={onBack} 
            variant="link" 
            className="gap-2 p-0 h-auto mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        <Card className="shadow-card">
          <CardHeader className={isMobile ? 'pb-4' : ''}>
            <CardTitle className={isMobile ? 'text-xl' : 'text-2xl'}>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'}`}>
                <AvatarImage src={profileData.profilePicture} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="profile-upload"
                  />
                  <Button variant="outline" className={`gap-2 ${isMobile ? 'w-full' : ''}`}>
                    <Upload className="h-4 w-4" />
                    {profileData.profilePicture ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                </div>
                
                {profileData.profilePicture && (
                  <Button
                    variant="outline"
                    onClick={handleRemovePicture}
                    className={`gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground ${isMobile ? 'w-full' : ''}`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Picture
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={isMobile ? 'text-sm' : ''}>Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className={isMobile ? 'text-base' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile" className={isMobile ? 'text-sm' : ''}>Mobile Number</Label>
                <Input
                  id="mobile"
                  value={profileData.mobile}
                  onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value }))}
                  className={isMobile ? 'text-base' : ''}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-4 ${isMobile ? 'flex-col pt-4' : 'pt-6'}`}>
              <Button className={isMobile ? 'w-full' : ''}>
                Save Changes
              </Button>
              {!isMobile && (
                <Button variant="outline" onClick={onBack}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logout Section */}
        {isMobile && (
          <div className="pt-8">
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
