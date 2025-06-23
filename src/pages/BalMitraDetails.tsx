
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MapPin, TrendingUp, Calendar, Users, GraduationCap, AlertTriangle, UserX } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface BalMitraDetailsProps {
  balMitraId: number | null;
  onBack: () => void;
}

const BalMitraDetails = ({ balMitraId, onBack }: BalMitraDetailsProps) => {
  const [dateRange, setDateRange] = useState('30days');

  // Mock Bal Mitra data
  const balMitraData = {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@vcr.org',
    mobile: '+91 98765 43210',
    joiningDate: '2024-02-10',
    block: 'Rajgangpur',
    gramPanchayat: 'Gram Panchayat 1',
    villages: ['Haripur', 'Rampur', 'Lakshmipur', 'Govindpur', 'Shantipur']
  };

  const performanceData = {
    totalSurveyed: 450,
    enrolled: 320,
    dropout: 85,
    neverEnrolled: 45
  };

  const activityData = [
    { date: '2024-06-01', surveyed: 15 },
    { date: '2024-06-02', surveyed: 12 },
    { date: '2024-06-03', surveyed: 18 },
    { date: '2024-06-04', surveyed: 0 },
    { date: '2024-06-05', surveyed: 22 },
    { date: '2024-06-06', surveyed: 16 },
    { date: '2024-06-07', surveyed: 14 },
    { date: '2024-06-08', surveyed: 20 },
    { date: '2024-06-09', surveyed: 0 },
    { date: '2024-06-10', surveyed: 25 },
    { date: '2024-06-11', surveyed: 19 },
    { date: '2024-06-12', surveyed: 17 },
    { date: '2024-06-13', surveyed: 13 },
    { date: '2024-06-14', surveyed: 21 },
    { date: '2024-06-15', surveyed: 0 }
  ];

  const villagePerformance = [
    { village: 'Haripur', enrolled: 65, dropout: 20, neverEnrolled: 8 },
    { village: 'Rampur', enrolled: 58, dropout: 15, neverEnrolled: 12 },
    { village: 'Lakshmipur', enrolled: 72, dropout: 18, neverEnrolled: 5 },
    { village: 'Govindpur', enrolled: 61, dropout: 16, neverEnrolled: 10 },
    { village: 'Shantipur', enrolled: 64, dropout: 16, neverEnrolled: 10 }
  ];

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7days': return 'Last 7 days';
      case '30days': return 'Last 30 days';
      case '90days': return 'Last 90 days';
      default: return 'Last 30 days';
    }
  };

  if (!balMitraId) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted-foreground">No Bal Mitra selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={onBack} 
            variant="link" 
            size="sm"
            className="gap-2 self-start p-0 text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Bal Mitra Details</h1>
        </div>

        {/* Overview Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-medium">{balMitraData.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg font-medium">{balMitraData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                <p className="text-lg font-medium">{balMitraData.mobile}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Joining Date</label>
                <p className="text-lg font-medium">{balMitraData.joiningDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Block</label>
                <p className="text-lg font-medium">{balMitraData.block}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gram Panchayat</label>
                <p className="text-lg font-medium">{balMitraData.gramPanchayat}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-muted-foreground">Assigned Villages</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {balMitraData.villages.map((village) => (
                  <Badge key={village} variant="secondary">{village}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Range Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Performance Data Range:</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Performance Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance ({getDateRangeLabel()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-primary/20 w-fit mx-auto mb-2">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Total Surveyed</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{performanceData.totalSurveyed}</p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-success/20 w-fit mx-auto mb-2">
                  <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-success" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{performanceData.enrolled}</p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-destructive/20 w-fit mx-auto mb-2">
                  <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-destructive" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Dropout</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{performanceData.dropout}</p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-warning/20 w-fit mx-auto mb-2">
                  <UserX className="h-6 w-6 md:h-8 md:w-8 text-warning" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Never Enrolled</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{performanceData.neverEnrolled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Survey Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="surveyed" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Children Surveyed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Village Performance */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Village-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <ResponsiveContainer width="100%" height={250} minWidth={300}>
                  <BarChart data={villagePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="village" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="enrolled" stackId="a" fill="hsl(var(--success))" name="Enrolled" />
                    <Bar dataKey="dropout" stackId="a" fill="hsl(var(--destructive))" name="Dropout" />
                    <Bar dataKey="neverEnrolled" stackId="a" fill="hsl(var(--warning))" name="Never Enrolled" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BalMitraDetails;
