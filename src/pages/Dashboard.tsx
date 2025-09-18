import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import KPICards from '../components/dashboard/KPICards';
import FilterChips from '../components/FilterChips';
import SurveyAnalyticsFilters from '../components/survey-analytics/SurveyAnalyticsFilters';
import SurveyAnalyticsDisplay from '../components/survey-analytics/SurveyAnalyticsDisplay';
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient, DashboardSummary } from '../lib/api';
import { Survey } from '@/types/survey';

const Dashboard = () => {
  const [analyticsFilters, setAnalyticsFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    block: 'all',
    gramPanchayat: 'all'
  });

  const [trendsDateRange, setTrendsDateRange] = useState('6months');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [blocksData, setBlocksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // NEW
  const [surveyData, setSurveyData] = useState<Survey | null>(null);
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const fetchBlocksData = async () => {
    try {
      const response = await apiClient.getBlocksGramPanchayats();
      if (response.success) {
        // Transform the data to match the expected format
        const transformedData = response.data.map(block => ({
          block: block.block,
          gramPanchayat: (block as any).gramPanchayats?.map((name: string) => ({ name, isAssigned: false })) || []
        }));
        setBlocksData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching blocks data:', error);
    }
  };

  const fetchSurveyQuestions = async () => {
    try {
      const response = await apiClient.getSurveyQuestions();
      if (response.success) {
        setSurveyData(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch survey questions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching survey questions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey questions",
        variant: "destructive",
      });
    }
  };

  const fetchDashboardOverview = async () => {
    try {
      // Include date range parameters in the API call
      const params: any = {
        block: analyticsFilters.block !== 'all' ? analyticsFilters.block : undefined,
        gramPanchayat: analyticsFilters.gramPanchayat !== 'all' ? analyticsFilters.gramPanchayat : undefined,
      };
      
      // Add date range parameters if they exist
      if (analyticsFilters.dateRange.from) {
        params.startDate = analyticsFilters.dateRange.from.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
      
      if (analyticsFilters.dateRange.to) {
        params.endDate = analyticsFilters.dateRange.to.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
      
      const response = await apiClient.getDashboardOverview(params);

      if (response.success) {
        setOverviewData(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard overview",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard overview",
        variant: "destructive",
      });
    }
  };

  const fetchDashboardData = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true); // Only show loading on initial load

      // Include date range parameters in the API call
      const params: any = {
        block: analyticsFilters.block !== 'all' ? analyticsFilters.block : undefined,
        gramPanchayat: analyticsFilters.gramPanchayat !== 'all' ? analyticsFilters.gramPanchayat : undefined,
      };
      
      // Add date range parameters if they exist
      if (analyticsFilters.dateRange.from) {
        params.startDate = analyticsFilters.dateRange.from.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
      
      if (analyticsFilters.dateRange.to) {
        params.endDate = analyticsFilters.dateRange.to.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
      
      const response = await apiClient.getDashboardSummary(params);

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
      if (isInitial) setLoading(false); // Only hide loading on initial load
    }
  };

  useEffect(() => {
    fetchBlocksData();
  }, []);

  useEffect(() => {
    fetchSurveyQuestions();
  }, []);

  useEffect(() => {
    fetchDashboardOverview();
  }, [analyticsFilters]);

  // Initial load effect
  useEffect(() => {
    fetchDashboardData(true); // Only show loading spinner on initial load
    setInitialLoad(false);
    // eslint-disable-next-line
  }, []);

  // Filter change effect (no loading spinner)
  useEffect(() => {
    if (!initialLoad) fetchDashboardData(false);
    // eslint-disable-next-line
  }, [analyticsFilters]);

  const handleFilterChange = (filterId: string, value: string) => {
    setAnalyticsFilters(prev => {
      const newFilters = { ...prev, [filterId]: value };
      
      // Reset dependent filters when parent changes
      if (filterId === 'block') {
        newFilters.gramPanchayat = 'all';
      }
      
      return newFilters;
    });
  };

  // Process and use analytics data directly from overview API
  const totalSurveys = overviewData?.summary?.totalSurveys || 0;
  
  // Process sections data into a format compatible with our components
  const analyticsData = React.useMemo(() => {
    if (!overviewData || !overviewData.sections) return null;
    
    // Convert the sections/questions structure into a flat map of questionId -> analytics
    const processedData: Record<string, any> = {};
    
    overviewData.sections.forEach(section => {
      section.questions.forEach(question => {
        // Important: match the key in the analytics object to the id in the question object
        const questionKey = question.questionId;

        // Map the API's questionId (q1_1) to the expected id format in our survey data
        processedData[questionKey] = {
          totalResponses: question.totalResponses,
          responseRate: question.responseRate,
          chartType: question.chartType,
          // If the question has options (multiple choice, single choice)
          data: question.options 
            ? question.options.map((option: any) => ({
                label: option.label,
                count: option.count,
                percentage: option.percentage
              }))
            // If the question has summary data (written, etc.)
            : (question.data ? [question.data] : [])
        };
      });
    });
    
    return processedData;
  }, [overviewData]);

  const filterOptions = [
    {
      label: 'Block',
      value: analyticsFilters.block,
      options: [
        { label: 'All Blocks', value: 'all' },
        ...blocksData.map(block => ({ label: block.block, value: block.block }))
      ]
    },
    {
      label: 'Gram Panchayat',
      value: analyticsFilters.gramPanchayat,
      options: [
        { label: 'All Gram Panchayats', value: 'all' },
        ...(blocksData.find(block => block.block === analyticsFilters.block)?.gramPanchayat || [])
          .map((gp: any) => ({ label: gp.name, value: gp.name }))
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
          <h1 className="text-3xl font-bold text-foreground">Survey Analytics Dashboard</h1>
        </div>
        {/* Dashboard Content for PDF Export */}
        <div className="dashboard-content space-y-6">
          {/* Analytics Filters */}
          {isMobile ? (
            <FilterChips
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />
          ) : (
            <SurveyAnalyticsFilters
              filters={analyticsFilters}
              onFiltersChange={setAnalyticsFilters}
              blocksData={blocksData}
            />
          )}

          {/* KPI Cards */}
          <KPICards data={kpiData} />

          {/* Survey Analytics */}
          {surveyData && (
            overviewData ? (
              <>
                <SurveyAnalyticsDisplay
                  survey={surveyData}
                  analyticsData={analyticsData}
                  totalSurveys={totalSurveys}
                />
              </>
            ) : (
              <div className="text-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading survey analytics data...</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;