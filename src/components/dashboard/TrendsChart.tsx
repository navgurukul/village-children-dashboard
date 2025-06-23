
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TrendData {
  month: string;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
}

interface TrendsChartProps {
  data: TrendData[];
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const TrendsChart = ({ data, dateRange, onDateRangeChange }: TrendsChartProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="shadow-card">
      <CardHeader className={isMobile ? 'pb-3' : ''}>
        <div className={`flex items-center justify-between ${isMobile ? 'flex-col items-start gap-3' : ''}`}>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
            <Calendar className="h-5 w-5" />
            School Status Trend
          </CardTitle>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className={`bg-white ${isMobile ? 'w-full' : 'w-[150px]'}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="enrolled" 
              stroke="hsl(var(--success))" 
              strokeWidth={2} 
              name="Enrolled"
            />
            <Line 
              type="monotone" 
              dataKey="dropout" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2} 
              name="Dropout"
            />
            <Line 
              type="monotone" 
              dataKey="neverEnrolled" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2} 
              name="Never Enrolled"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendsChart;
