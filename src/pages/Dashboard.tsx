
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, AlertTriangle, UserX, FileText, TrendingUp, Calendar, Clock, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const [locationFilters, setLocationFilters] = useState({
    block: 'all',
    cluster: 'all',
    panchayat: 'all',
    village: 'all'
  });

  const [recentSurveyDateRange, setRecentSurveyDateRange] = useState('30days');
  const [trendsDateRange, setTrendsDateRange] = useState('6months');

  // Mock data
  const kpiData = {
    totalChildren: 2543,
    enrolled: 1876,
    dropout: 432,
    neverEnrolled: 235
  };

  const recentSurveyFindings = [
    { type: 'Dropouts', count: 15, breakdown: '9 Boys, 6 Girls' },
    { type: 'Enrollments', count: 23, breakdown: '12 Boys, 11 Girls' },
    { type: 'Never Enrolled', count: 8, breakdown: '4 Boys, 4 Girls' }
  ];

  const longDropoutData = [
    { period: '> 1 year', count: 156, breakdown: '64 Boys, 92 Girls' },
    { period: '6-12 months', count: 89, breakdown: '37 Boys, 52 Girls' },
    { period: '3-6 months', count: 45, breakdown: '19 Boys, 26 Girls' }
  ];

  const trendsData = [
    { month: 'Jan', enrolled: 1820, dropout: 410, neverEnrolled: 250 },
    { month: 'Feb', enrolled: 1835, dropout: 420, neverEnrolled: 245 },
    { month: 'Mar', enrolled: 1850, dropout: 425, neverEnrolled: 240 },
    { month: 'Apr', enrolled: 1860, dropout: 430, neverEnrolled: 238 },
    { month: 'May', enrolled: 1870, dropout: 432, neverEnrolled: 235 },
    { month: 'Jun', enrolled: 1876, dropout: 432, neverEnrolled: 235 }
  ];

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case '7days': return 'Last 7 days';
      case '30days': return 'Last 30 days';
      case '90days': return 'Last 3 months';
      case '6months': return 'Last 6 months';
      case '1year': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  const handleExportPDF = () => {
    console.log('Exporting dashboard as PDF...');
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Button onClick={handleExportPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Export as PDF
          </Button>
        </div>

        {/* Location Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
          </div>
          
          <Select value={locationFilters.block} onValueChange={(value) => setLocationFilters(prev => ({ ...prev, block: value }))}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="All Blocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              <SelectItem value="block1">Block 1</SelectItem>
              <SelectItem value="rajgangpur">Rajgangpur</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilters.cluster} onValueChange={(value) => setLocationFilters(prev => ({ ...prev, cluster: value }))}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="All Clusters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
              <SelectItem value="cluster1">Cluster 1</SelectItem>
              <SelectItem value="cluster2">Cluster 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilters.panchayat} onValueChange={(value) => setLocationFilters(prev => ({ ...prev, panchayat: value }))}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="All Panchayats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Panchayats</SelectItem>
              <SelectItem value="panchayat1">Panchayat 1</SelectItem>
              <SelectItem value="panchayat2">Panchayat 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilters.village} onValueChange={(value) => setLocationFilters(prev => ({ ...prev, village: value }))}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="All Villages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Villages</SelectItem>
              <SelectItem value="village1">Village 1</SelectItem>
              <SelectItem value="village2">Village 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Children Surveyed</p>
                  <p className="text-3xl font-bold text-foreground">{kpiData.totalChildren.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-foreground">{kpiData.enrolled.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-foreground">{kpiData.dropout.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-foreground">{kpiData.neverEnrolled.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Key Insights - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Survey Findings */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Survey Findings
                </CardTitle>
                <Select value={recentSurveyDateRange} onValueChange={setRecentSurveyDateRange}>
                  <SelectTrigger className="w-[140px] bg-white">
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
                {recentSurveyFindings.map((finding, index) => (
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

          {/* Children with Long Dropout Period */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Children with Long Dropout Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {longDropoutData.map((item, index) => (
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
        </div>

        {/* Row 3: Overall Trend Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                School Status Trend
              </CardTitle>
              <Select value={trendsDateRange} onValueChange={setTrendsDateRange}>
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
              <LineChart data={trendsData}>
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
      </div>
    </div>
  );
};

export default Dashboard;
