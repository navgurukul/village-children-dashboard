import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MapPin, Phone, Mail, Calendar, Building, Users } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from "@/hooks/use-mobile";

interface BalMitraDetailsProps {
  balMitraId?: string | null;
  balMitraData?: any;
  onBack?: () => void;
}

const BalMitraDetails = ({ }: BalMitraDetailsProps) => {
  const { id: balMitraId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const balMitraData = location.state?.balMitraData;
  const isMobile = useIsMobile();

  // Use actual user data or fallback to defaults
  const displayData = {
    id: balMitraData?.id || balMitraId,
    name: balMitraData?.name || 'Unknown User',
    email: balMitraData?.email || 'Not provided',
    mobile: balMitraData?.mobile || 'Not provided',
    username: balMitraData?.username || 'Not provided',
    role: balMitraData?.role || 'Unknown',
    isActive: balMitraData?.isActive || false,
    block: balMitraData?.block || balMitraData?.assignedBlock || 'Not assigned',
    gramPanchayat: balMitraData?.gramPanchayat || balMitraData?.assignedGramPanchayat || 'Not assigned',
    cluster: balMitraData?.cluster || null,
    createdAt: balMitraData?.createdAt || null,
    updatedAt: balMitraData?.updatedAt || null,
    //  loginAttempts: balMitraData?.loginAttempts || 0
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-GB', options);
  };

  if (!balMitraId && !balMitraData) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted-foreground">No Bal Mitra selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => navigate('/users')} 
            variant="link" 
            size="sm"
            className="gap-2 self-start p-0 text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Bal Mitra Details</h1>
        </div>

        {/* Overview Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-medium">{displayData.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="text-lg font-medium">{displayData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Mobile
                </label>
                <p className="text-lg font-medium">{displayData.mobile}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-lg font-medium">{displayData.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="mt-1">
                  <Badge variant={displayData.role === 'admin' ? 'default' : 'secondary'}>
                    {displayData.role}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={displayData.isActive ? 'default' : 'destructive'}>
                    {displayData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Assignment Information */}
            {(displayData.block !== 'Not assigned' || displayData.gramPanchayat !== 'Not assigned') && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Assignment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayData.block !== 'Not assigned' && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Block</label>
                      <p className="text-lg font-medium">{displayData.block}</p>
                    </div>
                  )}
                  {displayData.gramPanchayat !== 'Not assigned' && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gram Panchayat</label>
                      <p className="text-lg font-medium">{displayData.gramPanchayat}</p>
                    </div>
                  )}
                  {displayData.cluster && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cluster</label>
                      <p className="text-lg font-medium">{displayData.cluster}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayData.createdAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined Date
                  </label>
                  <p className="text-lg font-medium">{formatDate(displayData.createdAt)}</p>
                </div>
              )}
              {displayData.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-lg font-medium">{formatDate(displayData.updatedAt)}</p>
                </div>
              )}
              {/* <div>
                <label className="text-sm font-medium text-muted-foreground">Login Attempts</label>
                <p className="text-lg font-medium">{displayData.loginAttempts}</p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BalMitraDetails;