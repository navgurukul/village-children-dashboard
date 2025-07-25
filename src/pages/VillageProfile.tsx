import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, GraduationCap, AlertTriangle, UserX, MapPin, Calendar } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface VillageProfileProps {
  villageId: string | null;
  villageData: any;
  onBack: () => void;
}

const VillageProfile = ({ villageId, villageData, onBack }: VillageProfileProps) => {
  const isMobile = useIsMobile();

  // Use actual village data or fallback to defaults
  const displayData = {
    id: villageData?.id || villageId,
    name: villageData?.name || 'Unknown Village',
    block: villageData?.block || 'Unknown Block',
    gramPanchayat: villageData?.gramPanchayat || 'Unknown Gram Panchayat',
    assignedBalMitra: villageData?.balMitraName || 'Not Assigned',
    totalChildren: villageData?.['Total Children'] || 0,
    enrolled: { 
      count: villageData?.['Enrolled'] || 0, 
      percentage: villageData?.['Total Children'] ? 
        ((villageData?.['Enrolled'] || 0) / villageData?.['Total Children'] * 100).toFixed(1) : 0 
    },
    dropout: { 
      count: villageData?.['Dropout'] || 0, 
      percentage: villageData?.['Total Children'] ? 
        ((villageData?.['Dropout'] || 0) / villageData?.['Total Children'] * 100).toFixed(1) : 0 
    },
    neverEnrolled: { 
      count: villageData?.['Never Enrolled'] || 0, 
      percentage: villageData?.['Total Children'] ? 
        ((villageData?.['Never Enrolled'] || 0) / villageData?.['Total Children'] * 100).toFixed(1) : 0 
    }
  };

  // Additional village information from API
  const additionalInfo = {
    population: villageData?.population || null,
    district: villageData?.district || 'Unknown District',
    state: villageData?.state || 'Unknown State',
    cluster: villageData?.cluster || null,
    createdAt: villageData?.createdAt || null,
    updatedAt: villageData?.updatedAt || null
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            onClick={onBack} 
            variant="link" 
            className="gap-2 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Villages
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{displayData.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {displayData.block} &gt; {displayData.gramPanchayat}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{additionalInfo.district}, {additionalInfo.state}</span>
                </div>
                {additionalInfo.population && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Population: {additionalInfo.population.toLocaleString()}</span>
                  </div>
                )}
                {additionalInfo.cluster && (
                  <div className="flex items-center gap-1">
                    <span>Cluster: {additionalInfo.cluster}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Assigned Bal Mitra</p>
              <p className="font-semibold">{displayData.assignedBalMitra}</p>
            </div>
          </div>
        </div>

        {/* Key Village Metrics */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Children</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{displayData.totalChildren}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <GraduationCap className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-success`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{displayData.enrolled.count}</p>
                  {displayData.totalChildren > 0 && (
                    <p className="text-xs text-muted-foreground">{displayData.enrolled.percentage}% of total</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertTriangle className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-destructive`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dropout</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{displayData.dropout.count}</p>
                  {displayData.totalChildren > 0 && (
                    <p className="text-xs text-muted-foreground">{displayData.dropout.percentage}% of total</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <UserX className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-warning`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Never Enrolled</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{displayData.neverEnrolled.count}</p>
                  {displayData.totalChildren > 0 && (
                    <p className="text-xs text-muted-foreground">{displayData.neverEnrolled.percentage}% of total</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        {(additionalInfo.createdAt || additionalInfo.updatedAt) && (
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Village Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {additionalInfo.createdAt && (
                  <div>
                    <p className="text-muted-foreground">Village Added</p>
                    <p className="font-medium">{new Date(additionalInfo.createdAt).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</p>
                  </div>
                )}
                {additionalInfo.updatedAt && (
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(additionalInfo.updatedAt).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VillageProfile;