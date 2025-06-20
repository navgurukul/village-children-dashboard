
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

interface DropoutData {
  period: string;
  count: number;
  breakdown: string;
}

interface LongDropoutPeriodProps {
  data: DropoutData[];
}

const LongDropoutPeriod = ({ data }: LongDropoutPeriodProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Children with Long Dropout Period
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{item.period}</p>
                <p className="text-sm text-muted-foreground">{item.breakdown}</p>
              </div>
              <Badge className="bg-destructive/10 text-destructive text-sm font-semibold border-destructive/20">
                {item.count}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LongDropoutPeriod;
