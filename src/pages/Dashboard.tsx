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
import mixpanel from '../lib/mixpanel';

const Dashboard = () => {
  const [analyticsFilters, setAnalyticsFilters] = useState({
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined },
    block: 'all',
    gramPanchayat: 'all'
  });

  const [trendsDateRange, setTrendsDateRange] = useState('6months');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [blocksData, setBlocksData] = useState<any[]>([]);
  const [initialLoad, setInitialLoad] = useState(true); // NEW
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
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
    setLoadingOverview(true);
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
    } finally {
      setLoadingOverview(false);
    }
  };

  const fetchDashboardData = async (isInitial = false) => {
    try {
      setLoadingSummary(true);

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
      setLoadingSummary(false);
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
    // Call both APIs in parallel so each section can render as soon as it arrives
    fetchDashboardData(true); // Only show loading spinner on initial load
    fetchDashboardOverview();
    setInitialLoad(false);
    
    // Track page view when component mounts with enhanced user information
    mixpanel.track('Page View', {
      page_name: 'Dashboard Page View',
      user_id: localStorage.getItem('user_id') || 'unknown',
      user_name: localStorage.getItem('user_name') || 'unknown',
      user_role: localStorage.getItem('user_role') || 'unknown',
      view_time: new Date().toISOString()
    });
    // eslint-disable-next-line
  }, []);

  // Keep initialLoad true until both initial requests complete (so skeletons only during initial dashboard load)
  useEffect(() => {
    if (!loadingSummary && !loadingOverview) {
      setInitialLoad(false);
    }
  }, [loadingSummary, loadingOverview]);

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

  const gramPanchayats = React.useMemo(() => {
    if (analyticsFilters.block === 'all') return [];
    const blockObj = blocksData.find(b => b.block === analyticsFilters.block);
    return blockObj ? blockObj.gramPanchayat.map((gp: any) => gp.name) : [];
  }, [blocksData, analyticsFilters.block]);

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
        ...gramPanchayats.map(gp => ({ label: gp, value: gp }))
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

          {/*  KPI Cards */}
          {initialLoad && loadingSummary && !dashboardData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded bg-muted/20 h-24 animate-pulse" />
              <div className="p-4 rounded bg-muted/20 h-24 animate-pulse" />
              <div className="p-4 rounded bg-muted/20 h-24 animate-pulse" />
              <div className="p-4 rounded bg-muted/20 h-24 animate-pulse" />
            </div>
          ) : (
            <KPICards data={kpiData} />
          )}

          {/* Survey Analytics */}
          {surveyData && (
            overviewData ? (
              <SurveyAnalyticsDisplay
                survey={surveyData}
                analyticsData={analyticsData}
                totalSurveys={totalSurveys}
              />
            ) : (
              <div className="text-muted-foreground">No analytics available</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;