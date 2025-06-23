
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, AlertTriangle, UserX } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  return (
    <div className={`grid gap-4 md:gap-6 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
      <Card className="shadow-card">
        <CardContent className={isMobile ? "p-4" : "p-6"}>
          <div className={`flex items-center gap-3 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`p-2 md:p-3 rounded-lg bg-primary/10 ${isMobile ? 'p-2' : 'p-3'}`}>
              <Users className={`text-primary ${isMobile ? 'h-5 w-5' : 'h-8 w-8'}`} />
            </div>
            <div>
              <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {isMobile ? 'Total Children' : 'Total Children Surveyed'}
              </p>
              <p className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-3xl'}`}>
                {data.totalChildren.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className={isMobile ? "p-4" : "p-6"}>
          <div className={`flex items-center gap-3 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`p-2 md:p-3 rounded-lg bg-success/10 ${isMobile ? 'p-2' : 'p-3'}`}>
              <GraduationCap className={`text-success ${isMobile ? 'h-5 w-5' : 'h-8 w-8'}`} />
            </div>
            <div>
              <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Enrolled</p>
              <p className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-3xl'}`}>
                {data.enrolled.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className={isMobile ? "p-4" : "p-6"}>
          <div className={`flex items-center gap-3 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`p-2 md:p-3 rounded-lg bg-destructive/10 ${isMobile ? 'p-2' : 'p-3'}`}>
              <AlertTriangle className={`text-destructive ${isMobile ? 'h-5 w-5' : 'h-8 w-8'}`} />
            </div>
            <div>
              <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Dropout</p>
              <p className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-3xl'}`}>
                {data.dropout.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className={isMobile ? "p-4" : "p-6"}>
          <div className={`flex items-center gap-3 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className={`p-2 md:p-3 rounded-lg bg-warning/10 ${isMobile ? 'p-2' : 'p-3'}`}>
              <UserX className={`text-warning ${isMobile ? 'h-5 w-5' : 'h-8 w-8'}`} />
            </div>
            <div>
              <p className={`font-medium text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Never Enrolled</p>
              <p className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-3xl'}`}>
                {data.neverEnrolled.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
