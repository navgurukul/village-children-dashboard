import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, GraduationCap, AlertTriangle, UserX, MapPin, Calendar } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface VillageProfileProps {
  villageId: string | null;
  villageData: any;
  onBack: () => void;
}

interface Para {
  id: string;
  name: string;
  nameHindi?: string;
  totalChildren?: number;
  enrolledChildren?: number;
  dropoutChildren?: number;
  neverEnrolledChildren?: number;
  // Keep these for backward compatibility
  district?: string;
  blocks?: string[];
  gramPanchayats?: string[];
  gramPanchayat?: string;
  totalPopulation?: number;
  state?: string;
}

// Interface for a Gram Panchayat
interface GramPanchayat {
  id: string;
  name: string;
  district: string;
  blocks?: string[];
  state?: string;
  totalChildren?: number;
  enrolledChildren?: number;
  dropoutChildren?: number;
  neverEnrolledChildren?: number;
  totalParas?: number;
}

const VillageProfile = ({ villageId, villageData, onBack }: VillageProfileProps) => {
  const isMobile = useIsMobile();
  const [relatedParas, setRelatedParas] = useState<Para[]>([]);
  const { toast } = useToast();

  // Set related paras directly from villageData
  useEffect(() => {
    if (villageData?.paras) {
      setRelatedParas(villageData.paras);
    } else {
      setRelatedParas([]);
    }
  }, [villageData]);


  
  // Use actual para data or fallback to defaults
  const displayData = {
    id: villageData?.id || villageId,
    name: villageData?.name || 'Unknown Para',
    blocks: villageData?.blocks || [villageData?.block || 'Unknown Block'],
    gramPanchayats: villageData?.gramPanchayats || [villageData?.gramPanchayat || 'Unknown Gram Panchayat'],
    assignedBalMitra: villageData?.name || villageData?.balMitraName || villageData?.assignedBalMitra || 'Not Assigned',
    totalChildren: villageData?.totalChildren || 0,
    enrolled: { 
      count: villageData?.enrolledChildren || 0, 
      percentage: villageData?.totalChildren ? 
        ((villageData?.enrolledChildren || 0) / villageData?.totalChildren * 100).toFixed(1) : 0 
    },
    dropout: { 
      count: villageData?.dropoutChildren || 0, 
      percentage: villageData?.totalChildren ? 
        ((villageData?.dropoutChildren || 0) / villageData?.totalChildren * 100).toFixed(1) : 0 
    },
    neverEnrolled: { 
      count: villageData?.neverEnrolledChildren || 0, 
      percentage: villageData?.totalChildren ? 
        ((villageData?.neverEnrolledChildren || 0) / villageData?.totalChildren * 100).toFixed(1) : 0 
    }
  };

  // Additional para information from API
  const additionalInfo = {
    population: villageData?.totalPopulation || villageData?.population || null,
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
            Back to Gram Panchayats
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{displayData.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {displayData.blocks?.join(', ')}
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
              <p className="font-semibold">{displayData.name || 'Not Assigned'}</p>
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
                <h3 className="text-lg font-semibold">Gram Panchayat Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {additionalInfo.createdAt && (
                  <div>
                    <p className="text-muted-foreground">Added On</p>
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

        {/* Paras in this Gram Panchayat */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Paras in {villageData.name}</h3>
              </div>
            </div>

            {relatedParas.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No paras found in this Gram Panchayat</p>
            ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">Para Name</TableHead>
                        <TableHead className="font-bold">Block</TableHead>
                        <TableHead className="font-bold">Total Children</TableHead>
                        <TableHead className="font-bold">Enrolled</TableHead>
                        <TableHead className="font-bold">Dropout</TableHead>
                        <TableHead className="font-bold">Never Enrolled</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedParas.map((para, index) => (
                        <TableRow 
                          key={para.id} 
                          className={`${index % 2 === 0 ? "bg-muted/30" : ""} cursor-pointer hover:bg-muted/50`}
                        >
                          <TableCell className="font-medium">
                            {para.name}
                          </TableCell>
                          <TableCell>{villageData.block || ''}</TableCell>
                          <TableCell>{para.totalChildren || 0}</TableCell>
                          <TableCell>
                            <Badge className="bg-success/10 text-success border-success/20">
                              {para.enrolledChildren || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                              {para.dropoutChildren || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-warning/10 text-warning border-warning/20">
                              {para.neverEnrolledChildren || 0}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default VillageProfile;