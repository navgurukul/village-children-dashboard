import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, LogOut, User, Camera, Upload, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

const Profile = ({ onBack, onLogout }: ProfileProps) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = useIsMobile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock admin data
  const adminData = {
    name: 'Admin User',
    email: 'admin@portal.com',
    mobile: '+91 98765 43210',
    role: 'Admin'
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setProfileImage(null);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={onBack} 
            variant="link" 
            className="gap-2 p-0 h-auto self-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Profile Card */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className={`${isMobile ? 'space-y-6' : 'flex items-start gap-8'}`}>
              {/* Profile Picture Section */}
              <div className={`${isMobile ? 'flex flex-col items-center' : 'flex-shrink-0'}`}>
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profileImage || ""} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      <User className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute bottom-0 right-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" className="rounded-full h-10 w-10 p-0">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleImageUpload} disabled={isUploading}>
                          <Upload className="mr-2 h-4 w-4" />
                          {profileImage ? 'Change Picture' : 'Upload Picture'}
                        </DropdownMenuItem>
                        {profileImage && (
                          <DropdownMenuItem onClick={handleImageRemove} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Picture
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Profile Information */}
              <div className={`${isMobile ? 'w-full' : 'flex-1'} space-y-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-lg font-medium">{adminData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg font-medium">{adminData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                    <p className="text-lg font-medium">{adminData.mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <Badge variant="default" className="text-sm">
                      {adminData.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button - Moved to bottom on mobile */}
        <div className={`${isMobile ? 'pt-8 border-t' : ''}`}>
          <Button 
            onClick={onLogout} 
            variant="destructive" 
            className={`gap-2 ${isMobile ? 'w-full' : ''}`}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
