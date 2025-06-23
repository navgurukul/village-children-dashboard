import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, GraduationCap, AlertTriangle, UserX, Clock, TrendingUp, Calendar, Download, School } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";

interface VillageProfileProps {
  villageId: string | null;
  onBack: () => void;
}

const VillageProfile = ({ villageId, onBack }: VillageProfileProps) => {
  const [recentUpdatesDateRange, setRecentUpdatesDateRange] = useState('30days');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();

  // Mock village data
  const villageData = {
    id: '1',
    name: 'Haripur',
    block: 'Block C',
    gramPanchayat: 'Gram Panchayat 1',
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

  const schoolsData = [
    { name: 'Primary School Haripur', enrolled: 89 },
    { name: 'Government High School', enrolled: 67 },
    { name: 'Anganwadi Center 1', enrolled: 23 },
    { name: 'Anganwadi Center 2', enrolled: 10 }
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
    neverEnrolledToEnrolled: 4,
    enrolledToDropout: 2
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return <Badge className="bg-success/10 text-success-dark border-success/20">{status}</Badge>;
      case 'Dropout':
        return <Badge className="bg-destructive/10 text-destructive-dark border-destructive/20">{status}</Badge>;
      case 'Never Enrolled':
        return <Badge className="bg-warning/10 text-warning-dark border-warning/20">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-GB', options);
  };

  const handleExportPDF = () => {
    console.log('Exporting status updates as PDF...');
  };

  const handleExportCSV = () => {
    console.log('Exporting status updates as CSV...');
  };

  // Pagination calculations
  const totalPages = Math.ceil(recentUpdates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUpdates = recentUpdates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
                {villageData.block} &gt; {villageData.gramPanchayat}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Assigned Bal Mitra</p>
              <p className="font-semibold">{villageData.assignedBalMitra}</p>
            </div>
          </div>
        </div>

        {/* Row 1: Key Village Metrics */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Children</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{villageData.totalChildren}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <GraduationCap className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-success`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{villageData.enrolled.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertTriangle className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-destructive`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dropout</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{villageData.dropout.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <UserX className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-warning`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Never Enrolled</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>{villageData.neverEnrolled.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Deeper Insights with Schools Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-sm font-semibold">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schools Card */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Schools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schoolsData.map((school, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-muted-foreground">Students Enrolled</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-semibold">
                      {school.enrolled}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: School Status Trend */}
        <Card className="shadow-card mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              School Status Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div style={{ minWidth: isMobile ? '600px' : '100%' }}>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Row 4: Recent Updates Section */}
        <div className="space-y-6">
          {/* Header with Title, Filter, and Export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h2 className="text-2xl font-semibold">Recent Child Status Updates</h2>
            </div>
            <div className="flex items-center gap-4">
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
              {!isMobile && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2 bg-white">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 bg-white">
                    <Download className="h-4 w-4" />
                    CSV
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-success/10">
              <p className="text-sm font-medium text-muted-foreground">From Dropout to Enrolled</p>
              <p className="text-2xl font-bold text-success">{statusChangesSummary.dropoutToEnrolled}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10">
              <p className="text-sm font-medium text-muted-foreground">From Never Enrolled to Enrolled</p>
              <p className="text-2xl font-bold text-primary">{statusChangesSummary.neverEnrolledToEnrolled}</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10">
              <p className="text-sm font-medium text-muted-foreground">From Enrolled to Dropout</p>
              <p className="text-2xl font-bold text-destructive">{statusChangesSummary.enrolledToDropout}</p>
            </div>
          </div>

          {/* Status Updates List/Table */}
          {isMobile ? (
            <div className="space-y-4">
              {currentUpdates.map((update, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start py-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{update.childName}</h3>
                        <span className="text-sm text-muted-foreground">{formatDate(update.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span>Status Change:</span>
                        {getStatusBadge(update.oldStatus)}
                        <span>→</span>
                        {getStatusBadge(update.newStatus)}
                      </div>
                    </div>
                  </div>
                  {index < currentUpdates.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold">Student Name</TableHead>
                          <TableHead className="font-bold">Previous Status</TableHead>
                          <TableHead className="font-bold">Current Status</TableHead>
                          <TableHead className="font-bold">Date of Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentUpdates.map((update, index) => (
                          <TableRow 
                            key={index} 
                            className={`${index % 2 === 0 ? "bg-muted/30" : ""}`}
                          >
                            <TableCell className="p-4 font-medium">{update.childName}</TableCell>
                            <TableCell className="p-4">{getStatusBadge(update.oldStatus)}</TableCell>
                            <TableCell className="p-4">{getStatusBadge(update.newStatus)}</TableCell>
                            <TableCell className="p-4">{formatDate(update.date)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VillageProfile;
