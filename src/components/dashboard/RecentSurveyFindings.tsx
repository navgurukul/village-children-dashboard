
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SurveyFinding {
  type: string;
  count: number;
  breakdown: string;
}

interface RecentSurveyFindingsProps {
  findings: SurveyFinding[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const RecentSurveyFindings = ({ findings, dateRange, onDateRangeChange }: RecentSurveyFindingsProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="shadow-card">
      <CardHeader className={isMobile ? 'pb-3' : ''}>
        <div className={`flex items-center justify-between ${isMobile ? 'flex-col items-start gap-3' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
            <TrendingUp className="h-5 w-5" />
            Recent Survey Findings
          </CardTitle>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className={`bg-white ${isMobile ? 'w-full' : 'w-[140px]'}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {findings.map((finding, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${isMobile ? 'p-2' : 'p-3'}`}
            >
              <div>
                <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{finding.type}</p>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{finding.breakdown}</p>
              </div>
              <Badge 
                className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'} ${
                  finding.type === 'Dropouts' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                  finding.type === 'Enrollments' ? 'bg-success/10 text-success border-success/20' : 'bg-secondary'
                }`}
              >
                <span className={finding.type === 'Never Enrolled' ? 'text-foreground' : ''}>{finding.count}</span>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSurveyFindings;
