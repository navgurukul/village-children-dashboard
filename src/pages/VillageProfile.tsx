
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, GraduationCap, AlertTriangle, UserX, Clock, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface VillageProfileProps {
  villageId: string | null;
  onBack: () => void;
}

const VillageProfile = ({ villageId, onBack }: VillageProfileProps) => {
  const [recentUpdatesDateRange, setRecentUpdatesDateRange] = useState('30days');
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  // Mock village data
  const villageData = {
    id: '1',
    name: 'Haripur',
    block: 'Block C',
    cluster: 'Cluster 5',
    panchayat: 'Panchayat 1',
    assignedBalMitra: 'Ravi Kumar',
    totalChildren: 245,
    enrolled: { count: 189, percentage: 77.1 },
    dropout: { count: 42, percentage: 17.1 },
    neverEnrolled: { count: 14, percentage: 5.7 }
  };

  const longDropoutData = [
    { period: '> 1 Year', count: 15, breakdown: '8 Boys, 7 Girls' },
    { period: '6-12 months', count: 12, breakdown: '5 Boys, 7 Girls' },
    { period: '3-6 months', count: 8, breakdown: '4 Boys, 4 Girls' }
  ];

  const trendsData = [
    { month: 'Jan', enrolled: 180, dropout: 45, neverEnrolled: 20 },
    { month: 'Feb', enrolled: 182, dropout: 44, neverEnrolled: 19 },
    { month: 'Mar', enrolled: 185, dropout: 43, neverEnrolled: 17 },
    { month: 'Apr', enrolled: 187, dropout: 42, neverEnrolled: 16 },
    { month: 'May', enrolled: 188, dropout: 42, neverEnrolled: 15 },
    { month: 'Jun', enrolled: 189, dropout: 42, neverEnrolled: 14 }
  ];

  const recentUpdates = [
    { childName: 'Arjun Kumar', oldStatus: 'Dropout', newStatus: 'Enrolled', date: '2024-01-15' },
    { childName: 'Priya Singh', oldStatus: 'Never Enrolled', newStatus: 'Enrolled', date: '2024-01-14' },
    { childName: 'Rahul Sharma', oldStatus: 'Enrolled', newStatus: 'Dropout', date: '2024-01-12' },
    { childName: 'Anjali Devi', oldStatus: 'Never Enrolled', newStatus: 'Enrolled', date: '2024-01-10' },
    { childName: 'Vikram Patel', oldStatus: 'Dropout', newStatus: 'Enrolled', date: '2024-01-08' },
    { childName: 'Sunita Kumar', oldStatus: 'Never Enrolled', newStatus: 'Enrolled', date: '2024-01-06' },
    { childName: 'Amit Singh', oldStatus: 'Enrolled', newStatus: 'Dropout', date: '2024-01-05' },
    { childName: 'Kavita Sharma', oldStatus: 'Dropout', newStatus: 'Enrolled', date: '2024-01-03' },
    { childName: 'Ravi Kumar', oldStatus: 'Never Enrolled', newStatus: 'Enrolled', date: '2024-01-02' }
  ];

  const statusChangesSummary = {
    dropoutToEnrolled: 3,
    neverEnrolledToEnrolled: 4
  };

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case '7days': return 'Last 7 days';
      case '30days': return 'Last 30 days';
      case '90days': return 'Last 3 months';
      default: return 'Last 30 days';
    }
  };

  const displayedUpdates = showAllUpdates ? recentUpdates : recentUpdates.slice(0, 7);

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            onClick={onBack} 
            variant="link" 
            className="gap-2 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Villages
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{villageData.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">
                {villageData.block} &gt; {villageData.cluster} &gt; {villageData.panchayat}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Assigned Personnel</p>
              <p className="font-semibold">{villageData.assignedBalMitra}</p>
            </div>
          </div>
        </div>

        {/* Row 1: Key Village Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Children</p>
                  <p className="text-3xl font-bold text-foreground">{villageData.totalChildren}</p>
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
                  <p className="text-3xl font-bold text-foreground">{villageData.enrolled.count}</p>
                  <p className="text-sm text-muted-foreground">({villageData.enrolled.percentage}%)</p>
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
                  <p className="text-3xl font-bold text-foreground">{villageData.dropout.count}</p>
                  <p className="text-sm text-muted-foreground">({villageData.dropout.percentage}%)</p>
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
                  <p className="text-3xl font-bold text-foreground">{villageData.neverEnrolled.count}</p>
                  <p className="text-sm text-muted-foreground">({villageData.neverEnrolled.percentage}%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Deeper Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Children with Long Dropout Period (1/3 width) */}
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
                    <Badge variant="destructive" className="text-sm font-semibold">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* School Status Trend (2/3 width) */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                School Status Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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

        {/* Row 3: Recent Updates */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Child Status Updates
              </CardTitle>
              <Select value={recentUpdatesDateRange} onValueChange={setRecentUpdatesDateRange}>
                <SelectTrigger className="w-[150px] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">{getDateRangeLabel(recentUpdatesDateRange)}</p>
          </CardHeader>
          <CardContent>
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-success/10">
                <p className="text-sm font-medium text-muted-foreground">From Dropout to Enrolled</p>
                <p className="text-2xl font-bold text-success">{statusChangesSummary.dropoutToEnrolled}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10">
                <p className="text-sm font-medium text-muted-foreground">From Never Enrolled to Enrolled</p>
                <p className="text-2xl font-bold text-primary">{statusChangesSummary.neverEnrolledToEnrolled}</p>
              </div>
            </div>

            {/* Update Log */}
            <div className="space-y-3">
              {displayedUpdates.map((update, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                  <div className="flex-1">
                    <span className="font-medium">{update.childName}</span>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span className="text-sm">
                      Status changed from 
                      <Badge variant="outline" className="mx-1 text-xs">{update.oldStatus}</Badge>
                      to
                      <Badge variant="outline" className="mx-1 text-xs">{update.newStatus}</Badge>
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(update.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {recentUpdates.length > 7 && !showAllUpdates && (
              <Button 
                variant="outline" 
                onClick={() => setShowAllUpdates(true)}
                className="w-full mt-4"
              >
                View All Status Updates
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VillageProfile;
