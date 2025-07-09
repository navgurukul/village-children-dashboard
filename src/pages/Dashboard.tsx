
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import KPICards from '../components/dashboard/KPICards';
import LocationFilters from '../components/dashboard/LocationFilters';
import FilterChips from '../components/FilterChips';
import RecentSurveyFindings from '../components/dashboard/RecentSurveyFindings';
import LongDropoutPeriod from '../components/dashboard/LongDropoutPeriod';
import TrendsChart from '../components/dashboard/TrendsChart';
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient, DashboardOverview } from '../lib/api';

const Dashboard = () => {
  const [locationFilters, setLocationFilters] = useState({
    block: 'all',
    gramPanchayat: 'all',
    village: 'all'
  });

  const [recentSurveyDateRange, setRecentSurveyDateRange] = useState('30days');
  const [trendsDateRange, setTrendsDateRange] = useState('6months');
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Convert filter period to API format
      const periodMap: { [key: string]: string } = {
        '7days': '7d',
        '30days': '30d',
        '90days': '90d'
      };

      const response = await apiClient.getDashboardOverview({
        period: periodMap[recentSurveyDateRange] || '30d',
        block: locationFilters.block !== 'all' ? locationFilters.block : undefined,
        panchayat: locationFilters.gramPanchayat !== 'all' ? locationFilters.gramPanchayat : undefined,
      });

      if (response.success) {
        setDashboardData(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [locationFilters, recentSurveyDateRange]);

  const handleExportPDF = () => {
    console.log('Exporting dashboard as PDF...');
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setLocationFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  // Mock data for dropdowns - in real app, this would come from API
  const blocks = ['Block A', 'Block B', 'Block C'];
  const gramPanchayats = ['Gram Panchayat 1', 'Gram Panchayat 2', 'Gram Panchayat 3'];
  const villages = ['Village 1', 'Village 2', 'Village 3', 'Village 4', 'Village 5'];

  const filterOptions = [
    {
      label: 'Block',
      value: locationFilters.block,
      options: [
        { label: 'All Blocks', value: 'all' },
        ...blocks.map(block => ({ label: block, value: block }))
      ]
    },
    {
      label: 'Gram Panchayat',
      value: locationFilters.gramPanchayat,
      options: [
        { label: 'All Gram Panchayats', value: 'all' },
        ...gramPanchayats.map(gp => ({ label: gp, value: gp }))
      ]
    },
    {
      label: 'Village',
      value: locationFilters.village,
      options: [
        { label: 'All Villages', value: 'all' },
        ...villages.map(village => ({ label: village, value: village }))
      ]
    }
  ];

  // Prepare KPI data
  const kpiData = dashboardData ? {
    totalChildren: dashboardData.totalChildren,
    enrolled: dashboardData.enrolled,
    dropout: dashboardData.dropout,
    neverEnrolled: dashboardData.neverEnrolled
  } : {
    totalChildren: 0,
    enrolled: 0,
    dropout: 0,
    neverEnrolled: 0
  };

  // Prepare recent survey findings
  const recentSurveyFindings = dashboardData ? [
    { 
      type: 'Dropouts', 
      count: dashboardData.dropout, 
      breakdown: `${dashboardData.genderBreakdown.dropout.boys} Boys, ${dashboardData.genderBreakdown.dropout.girls} Girls` 
    },
    { 
      type: 'Enrollments', 
      count: dashboardData.enrolled, 
      breakdown: `${dashboardData.genderBreakdown.enrolled.boys} Boys, ${dashboardData.genderBreakdown.enrolled.girls} Girls` 
    },
    { 
      type: 'Never Enrolled', 
      count: dashboardData.neverEnrolled, 
      breakdown: `${dashboardData.genderBreakdown.neverEnrolled.boys} Boys, ${dashboardData.genderBreakdown.neverEnrolled.girls} Girls` 
    }
  ] : [
    { type: 'Dropouts', count: 0, breakdown: '0 Boys, 0 Girls' },
    { type: 'Enrollments', count: 0, breakdown: '0 Boys, 0 Girls' },
    { type: 'Never Enrolled', count: 0, breakdown: '0 Boys, 0 Girls' }
  ];

  // Prepare long dropout data (mock data for now as it's not in the API response)
  const longDropoutData = [
    { period: '> 1 year', count: Math.floor(dashboardData?.dropout * 0.6) || 0, breakdown: 'Data not available' },
    { period: '6-12 months', count: Math.floor(dashboardData?.dropout * 0.3) || 0, breakdown: 'Data not available' },
    { period: '3-6 months', count: Math.floor(dashboardData?.dropout * 0.1) || 0, breakdown: 'Data not available' }
  ];

  // Mock trends data (this would need a separate API endpoint)
  const trendsData = [
    { month: 'Jan', enrolled: kpiData.enrolled, dropout: kpiData.dropout, neverEnrolled: kpiData.neverEnrolled },
    { month: 'Feb', enrolled: kpiData.enrolled, dropout: kpiData.dropout, neverEnrolled: kpiData.neverEnrolled },
    { month: 'Mar', enrolled: kpiData.enrolled, dropout: kpiData.dropout, neverEnrolled: kpiData.neverEnrolled },
    { month: 'Apr', enrolled: kpiData.enrolled, dropout: kpiData.dropout, neverEnrolled: kpiData.neverEnrolled },
    { month: 'May', enrolled: kpiData.enrolled, dropout: kpiData.dropout, neverEnrolled: kpiData.neverEnrolled },
    { month: 'Jun', enrolled: kpiData.enrolled, dropout: kpiData.dropout, neverEnrolled: kpiData.neverEnrolled }
  ];

  if (loading) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          {!isMobile && (
            <Button onClick={handleExportPDF} className="gap-2">
              <FileText className="h-4 w-4" />
              Export as PDF
            </Button>
          )}
        </div>

        {/* Location Filters */}
        {isMobile ? (
          <FilterChips
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        ) : (
          <LocationFilters 
            filters={locationFilters} 
            onFiltersChange={setLocationFilters} 
          />
        )}

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
