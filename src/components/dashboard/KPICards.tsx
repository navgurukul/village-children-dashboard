
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, AlertTriangle, UserX } from 'lucide-react';
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
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Children</p>
                <p className="text-lg font-bold text-foreground">{data.totalChildren}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <GraduationCap className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Enrolled</p>
                <p className="text-lg font-bold text-foreground">{data.enrolled}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Dropout</p>
                <p className="text-lg font-bold text-foreground">{data.dropout}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <UserX className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Never Enrolled</p>
                <p className="text-lg font-bold text-foreground">{data.neverEnrolled}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Children</p>
              <p className="text-3xl font-bold text-foreground">{data.totalChildren}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <GraduationCap className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
              <p className="text-3xl font-bold text-foreground">{data.enrolled}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dropout</p>
              <p className="text-3xl font-bold text-foreground">{data.dropout}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <UserX className="h-8 w-8 text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Never Enrolled</p>
              <p className="text-3xl font-bold text-foreground">{data.neverEnrolled}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
