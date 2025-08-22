
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
import { apiClient, DashboardSummary } from '../lib/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const [locationFilters, setLocationFilters] = useState({
    block: 'all',
    gramPanchayat: 'all',
    village: 'all'
  });

  const [trendsDateRange, setTrendsDateRange] = useState('6months');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [blocksData, setBlocksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const fetchBlocksData = async () => {
    try {
      const response = await apiClient.getBlocksGramPanchayats();
      if (response.success) {
        setBlocksData(response.data);
      }
    } catch (error) {
      console.error('Error fetching blocks data:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await apiClient.getDashboardSummary({
        block: locationFilters.block !== 'all' ? locationFilters.block : undefined,
        gramPanchayat: locationFilters.gramPanchayat !== 'all' ? locationFilters.gramPanchayat : undefined,
        villageId: locationFilters.village !== 'all' ? locationFilters.village : undefined,
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
    fetchBlocksData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [locationFilters]);

  const handleExportPDF = async () => {
    try {
      // Show loading state
      toast({
        title: "Generating PDF",
        description: "Capturing dashboard content...",
      });

      // Find the dashboard content (excluding header with export button)
      const dashboardContent = document.querySelector('.dashboard-content');
      if (!dashboardContent) {
        throw new Error('Dashboard content not found');
      }

      // Generate canvas from the dashboard content
      const canvas = await html2canvas(dashboardContent as HTMLElement, {
        height: dashboardContent.scrollHeight,
        width: dashboardContent.scrollWidth,
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Remove any animations or hover states from the cloned document
          const clonedElement = clonedDoc.querySelector('.dashboard-content');
          if (clonedElement) {
            clonedElement.classList.add('print-mode');
          }
        }
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit the image properly
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate scale to fit content while maintaining aspect ratio
      const widthScale = pdfWidth / (canvasWidth * 0.264583); // Convert px to mm
      const heightScale = pdfHeight / (canvasHeight * 0.264583);
      const scale = Math.min(widthScale, heightScale, 1); // Don't scale up

      const scaledWidth = (canvasWidth * 0.264583) * scale;
      const scaledHeight = (canvasHeight * 0.264583) * scale;

      // Center the image on the page
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = Math.max(10, (pdfHeight - scaledHeight) / 2); // Minimum 10mm from top

      // Add header with title and timestamp
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Village Children Register - Dashboard', pdfWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const now = new Date();
      pdf.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, pdfWidth / 2, 25, { align: 'center' });

      // Add the dashboard image
      const imgData = canvas.toDataURL('image/png');
      
      if (scaledHeight > pdfHeight - 40) {
        // If content is too tall, we might need multiple pages
        let currentY = 35;
        const maxHeightPerPage = pdfHeight - 50;
        let remainingHeight = scaledHeight;
        let sourceY = 0;
        
        while (remainingHeight > 0) {
          const heightForThisPage = Math.min(remainingHeight, maxHeightPerPage);
          const sourceHeight = (heightForThisPage / scale) / 0.264583;
          
          // Create a cropped canvas for this page
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvasWidth;
          tempCanvas.height = sourceHeight;
          
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, sourceY, canvasWidth, sourceHeight, 0, 0, canvasWidth, sourceHeight);
            const tempImgData = tempCanvas.toDataURL('image/png');
            pdf.addImage(tempImgData, 'PNG', xOffset, currentY, scaledWidth, heightForThisPage);
          }
          
          sourceY += sourceHeight;
          remainingHeight -= heightForThisPage;
          
          if (remainingHeight > 0) {
            pdf.addPage();
            currentY = 10;
          }
        }
      } else {
        // Content fits on one page
        pdf.addImage(imgData, 'PNG', xOffset, 35, scaledWidth, scaledHeight);
      }

      // Download the PDF
      const fileName = `VCR_Dashboard_${now.toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Success",
        description: "Dashboard exported successfully as PDF",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export dashboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setLocationFilters(prev => {
      const newFilters = { ...prev, [filterId]: value };
      
      // Reset dependent filters when parent changes
      if (filterId === 'block') {
        newFilters.gramPanchayat = 'all';
        newFilters.village = 'all';
      } else if (filterId === 'gramPanchayat') {
        newFilters.village = 'all';
      }
      
      return newFilters;
    });
  };

  // Get blocks from API data
  const blocks = blocksData.map(block => block.block);
  
  // Get gram panchayats for selected block
  const selectedBlockData = blocksData.find(block => block.block === locationFilters.block);
  const gramPanchayats = selectedBlockData ? selectedBlockData.gramPanchayat.map((gp: any) => gp.name) : [];
  
  // Get villages for selected gram panchayat
  const selectedGramPanchayat = selectedBlockData?.gramPanchayat.find((gp: any) => gp.name === locationFilters.gramPanchayat);
  const villages = selectedGramPanchayat?.villages || [];

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
  const recentSurveyFindings = dashboardData && dashboardData.recentSurveyFindings ? [
    { 
      type: 'Dropouts', 
      count: dashboardData.recentSurveyFindings.dropouts?.total || 0, 
      breakdown: `${dashboardData.recentSurveyFindings.dropouts?.boys || 0} Boys, ${dashboardData.recentSurveyFindings.dropouts?.girls || 0} Girls` 
    },
    { 
      type: 'Enrollments', 
      count: dashboardData.recentSurveyFindings.enrollments?.total || 0, 
      breakdown: `${dashboardData.recentSurveyFindings.enrollments?.boys || 0} Boys, ${dashboardData.recentSurveyFindings.enrollments?.girls || 0} Girls` 
    },
    { 
      type: 'Never Enrolled', 
      count: dashboardData.recentSurveyFindings.neverEnrolled?.total || 0, 
      breakdown: `${dashboardData.recentSurveyFindings.neverEnrolled?.boys || 0} Boys, ${dashboardData.recentSurveyFindings.neverEnrolled?.girls || 0} Girls` 
    }
  ] : [
    { type: 'Dropouts', count: 0, breakdown: '0 Boys, 0 Girls' },
    { type: 'Enrollments', count: 0, breakdown: '0 Boys, 0 Girls' },
    { type: 'Never Enrolled', count: 0, breakdown: '0 Boys, 0 Girls' }
  ];

  // Prepare long dropout data
  const longDropoutData = dashboardData && dashboardData.longDropoutPeriods ? [
    { 
      period: '> 1 year', 
      count: dashboardData.longDropoutPeriods.moreThan1Year || 0, 
      breakdown: (dashboardData.longDropoutPeriods.moreThan1Year || 0) > 0 ? 'Data from API' : '0'
    },
    { 
      period: '6-12 months', 
      count: dashboardData.longDropoutPeriods.sixToTwelveMonths || 0, 
      breakdown: (dashboardData.longDropoutPeriods.sixToTwelveMonths || 0) > 0 ? 'Data from API' : '0'
    },
    { 
      period: '3-6 months', 
      count: dashboardData.longDropoutPeriods.threeToSixMonths || 0, 
      breakdown: (dashboardData.longDropoutPeriods.threeToSixMonths || 0) > 0 ? 'Data from API' : '0'
    }
  ] : [
    { period: '> 1 year', count: 0, breakdown: '0' },
    { period: '6-12 months', count: 0, breakdown: '0' },
    { period: '3-6 months', count: 0, breakdown: '0' }
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
        </div>

        {/* Dashboard Content for PDF Export */}
        <div className="dashboard-content space-y-6">
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
              blocksData={blocksData}
            />
          )}

          {/* Row 1: KPI Cards */}
          <KPICards data={kpiData} />

          {/* Row 2: Key Insights - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RecentSurveyFindings 
              findings={recentSurveyFindings}
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
    </div>
  );
};

export default Dashboard;
