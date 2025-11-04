import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, AlertTriangle, UserX, Info } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface KPIData {
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
}

interface KPICardsProps {
  data: KPIData;
}

const KPICards = ({ data }: KPICardsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Card className="bg-white shadow-sm border-border/40">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"/>
              <span className="font-medium">Live Data — updates instantly as new records are added.</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Children</p>
                <p className="text-lg font-bold text-foreground">{data.totalChildren}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
              <div className="p-2 rounded-lg bg-success/10">
                <GraduationCap className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Enrolled</p>
                <p className="text-lg font-bold text-foreground">{data.enrolled}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Dropout</p>
                <p className="text-lg font-bold text-foreground">{data.dropout}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/50">
              <div className="p-2 rounded-lg bg-warning/10">
                <UserX className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Never Enrolled</p>
                <p className="text-lg font-bold text-foreground">{data.neverEnrolled}</p>
              </div>
            </div>
          </div>
          
          {/* <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <p>Note: These summary metrics show all-time data and are not affected by date filters.</p>
          </div> */}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border-border/40 p-6">
      <div className="flex items-center gap-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"/>
          <span className="font-medium">Live Data — updates instantly as new records as added.</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-primary/5 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Children</p>
              <p className="text-3xl font-bold text-foreground">{data.totalChildren}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent/50 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <GraduationCap className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
              <p className="text-3xl font-bold text-foreground">{data.enrolled}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent/50 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dropout</p>
              <p className="text-3xl font-bold text-foreground">{data.dropout}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent/50 rounded-md shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/20">
              <UserX className="h-8 w-8 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Never Enrolled</p>
              <p className="text-3xl font-bold text-foreground">{data.neverEnrolled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <p>Note: These summary metrics show all-time data and are not affected by date range filters.</p>
      </div> */}
    </Card>
  );
};

export default KPICards;
