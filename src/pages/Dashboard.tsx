import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import KPICards from '../components/dashboard/KPICards';
import LocationFilters from '../components/dashboard/LocationFilters';
import RecentSurveyFindings from '../components/dashboard/RecentSurveyFindings';
import LongDropoutPeriod from '../components/dashboard/LongDropoutPeriod';
import TrendsChart from '../components/dashboard/TrendsChart';

const Dashboard = () => {
  const [locationFilters, setLocationFilters] = useState({
    block: 'all',
    gramPanchayat: 'all',
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
        <LocationFilters 
          filters={locationFilters} 
          onFiltersChange={setLocationFilters} 
        />

        {/* Row 1: KPI Cards */}
        <KPICards data={kpiData} />

        {/* Row 2: Key Insights - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentSurveyFindings 
            findings={recentSurveyFindings}
            dateRange={recentSurveyDateRange}
            onDateRangeChange={setRecentSurveyDateRange}
          />
          <LongDropoutPeriod data={longDropoutData} />
        </div>

        {/* Row 3: Overall Trend Chart */}
        <TrendsChart 
          data={trendsData}
          dateRange={trendsDateRange}
          onDateRangeChange={setTrendsDateRange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
