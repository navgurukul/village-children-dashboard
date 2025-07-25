import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';

interface SurveyFinding {
  type: string;
  count: number;
  breakdown: string;
}

interface RecentSurveyFindingsProps {
  findings: SurveyFinding[];
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

const RecentSurveyFindings = ({ findings, dateRange, onDateRangeChange }: RecentSurveyFindingsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Survey Findings
          </CardTitle>
          {dateRange && onDateRangeChange && (
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {findings.map((finding, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{finding.type}</p>
                <p className="text-sm text-muted-foreground">{finding.breakdown}</p>
              </div>
              <Badge 
                className={`text-sm font-semibold ${
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