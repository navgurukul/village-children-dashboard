
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, AlertTriangle, UserX } from 'lucide-react';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Children Surveyed</p>
              <p className="text-3xl font-bold text-foreground">{data.totalChildren.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-foreground">{data.enrolled.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-foreground">{data.dropout.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-foreground">{data.neverEnrolled.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
