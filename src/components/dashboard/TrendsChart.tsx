
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from 'lucide-react';

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
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            School Status Trend
          </CardTitle>
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-[150px] bg-white">
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
        <ResponsiveContainer width="100%" height={350}>
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
