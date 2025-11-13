import React, { useState, useMemo, useEffect } from 'react';
import ChildrenRecordsHeader from '../components/children-records/ChildrenRecordsHeader';
import ChildrenRecordsContent from '../components/children-records/ChildrenRecordsContent';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiClient, Child } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { downloadChildrenCSV } from '../utils/exportUtils';
import { ExportJob } from '../components/NotificationCenter';
import mixpanel from '../lib/mixpanel';

interface ChildrenRecordsProps {
  onChildClick: (childId: string, childData?: any) => void;
  onEditChild?: (childId: string, childData?: any) => void;
  onAddExportJob?: (job: ExportJob) => void;
  onUpdateExportJob?: (jobId: string, updates: Partial<ExportJob>) => void;
}

const ChildrenRecords = ({ onChildClick, onEditChild, onAddExportJob, onUpdateExportJob }: ChildrenRecordsProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [gramPanchayatFilter, setGramPanchayatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiChildren, setApiChildren] = useState<Child[]>([]);
  const [blocksData, setBlocksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Format date from ISO string to DD-MM-YYYY
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if not valid date
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString || '';
    }
  };

  // Fetch blocks data from API
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

  // Fetch children data from API
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (blockFilter !== 'all') params.block = blockFilter;
       if (gramPanchayatFilter !== 'all') params.gramPanchayat = gramPanchayatFilter;
      if (statusFilter !== 'all') params.educationStatus = statusFilter;
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;

      const response = await apiClient.getChildren(params);
      // Filter out deleted children
      const activeChildren = response.data.children.filter(child => !child.auditInfo.isDeleted);
      setApiChildren(activeChildren);
      setTotalCount(response.data.pagination.totalRecords);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to fetch children data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocksData();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchChildren();
  }, [currentPage, blockFilter, gramPanchayatFilter, statusFilter, debouncedSearchTerm]);

  // Get blocks from API data
  const blocks = useMemo(() => {
    return blocksData.map(blockData => blockData.block);
  }, [blocksData]);

  // Get Gram Panchayats for selected block
  const gramPanchayats = useMemo(() => {
    if (blockFilter === 'all') return [];
    const blockObj = blocksData.find(b => b.block === blockFilter);
    return blockObj ? blockObj.gramPanchayats : [];
  }, [blocksData, blockFilter]);

  // Transform API data to match expected interface for components
  const childrenData = useMemo(() => {
    return apiChildren.map(child => ({
      id: child.id,
      name: child.surveyData?.['section-1']?.q1_1 || '',
      gender: child.surveyData?.['section-1']?.q1_4 || '',
      aadhaar: child.surveyData?.['section-5']?.q5_3 === 'हाँ' ? child.surveyData?.['section-5']?.q5_4 : '',
      aadhaarNumber: child.surveyData?.['section-5']?.q5_3 === 'हाँ' ? child.surveyData?.['section-5']?.q5_4 : '',
      schoolName: child.surveyData?.['section-4']?.q4_3 || '',
      school: child.surveyData?.['section-4']?.q4_3 || '',
      schoolStatus: (child.surveyData?.['section-4']?.q4_1 === 'नहीं' && child.surveyData?.['section-4']?.q4_7 === 'शाला त्यागी') ? 'Dropout'
        : (child.surveyData?.['section-4']?.q4_1 === 'नहीं' && child.surveyData?.['section-4']?.q4_7 === 'अप्रवेशी') ? 'Never Enrolled'
        : (child.surveyData?.['section-4']?.q4_1 === 'हाँ' || child.surveyData?.['section-4']?.q4_1 === 'आंगनवाड़ी') ? 'Enrolled' : 'N/A',
      block: child.surveyData?.['section-1']?.q1_5 || '', 
      gramPanchayat: child.surveyData?.['section-1']?.q1_6 || '', 
      village: child.surveyData?.['section-1']?.q1_7 || '', 
      para: child.surveyData?.['section-1']?.q1_8 || '', 
      disability: child.surveyData?.['section-6']?.q6_1 === 'हाँ' ? 'Yes' : 'No',
      caste: child.surveyData?.['section-2']?.q2_3 === 'अन्य' ? 'अन्य' : child.surveyData?.['section-2']?.q2_3 || '',
      otherCaste: child.surveyData?.['section-2']?.q2_3 === 'अन्य' ? child.surveyData?.['section-2']?.q2_4 || '' : '',
      dob: formatDate(child.surveyData?.['section-1']?.q1_3 ? String(child.surveyData?.['section-1']?.q1_3) : undefined) || '',
      fatherName: child.surveyData?.['section-1']?.q1_11 || '',
      motherName: child.surveyData?.['section-1']?.q1_10 || '',
      motherEducated: child.surveyData?.['section-1']?.q1_12 || 'N/A',
      fatherEducated: child.surveyData?.['section-1']?.q1_13 || 'N/A',
      familyOccupation: child.surveyData?.['section-2']?.q2_1 === 'अन्य' ? 'अन्य' : child.surveyData?.['section-2']?.q2_1 || '',
      otherOccupation: child.surveyData?.['section-2']?.q2_1 === 'अन्य' ? child.surveyData?.['section-2']?.q2_2 || '' : '',
      parentsStatus: child.surveyData?.['section-2']?.q2_5 || '',
      livesWithWhom: child.surveyData?.['section-2']?.q2_6 === 'अन्य' ? 'अन्य' : child.surveyData?.['section-2']?.q2_6 || '',
      otherLivesWith: child.surveyData?.['section-2']?.q2_6 === 'अन्य' ? child.surveyData?.['section-2']?.q2_7 || '' : '',
      economicStatus: child.surveyData?.['section-3']?.q3_1 || '',
      houseNumber: child.surveyData?.['section-1']?.q1_2 || child.surveyData?.['section-1']?.q1_new_house || '', // Updated to use correct q1_2 field
      motherTongue: child.surveyData?.['section-1']?.q1_9 || '', // Updated to use correct q1_8 field
      otherMotherTongue: child.surveyData?.['section-1']?.q1_8_other || '', // Updated to use correct q1_8_other field
      attendanceStatus: child.surveyData?.['section-4']?.q4_5 || '', // Using q4_5 for attendance status from survey
      currentClass: (child.surveyData?.['section-4']?.q4_1 === 'आंगनवाड़ी')
        ? ''
        : child.surveyData?.['section-4']?.q4_2 || '',
      // Add schoolCommuteType for reference if needed in future
      schoolCommuteType: child.surveyData?.['section-4']?.q4_4 || '',
      educationCategory: child.surveyData?.['section-4']?.q4_6 || '',
      lastClassStudied: child.surveyData?.['section-4']?.q4_8 || '',
      dropoutReasons: child.surveyData?.['section-4']?.q4_9 || '',
      otherDropoutReason: child.surveyData?.['section-4']?.q4_10 || '',
      neverEnrolledReasons: child.surveyData?.['section-4']?.q4_11 || '',
      otherNeverEnrolledReason: child.surveyData?.['section-4']?.q4_12 || '',
      hasCasteCertificate: child.surveyData?.['section-5']?.q5_1 === 'हाँ' ? 'Yes' : 'No',
      hasResidenceCertificate: child.surveyData?.['section-5']?.q5_2 === 'हाँ' ? 'Yes' : 'No',
      hasAadhaar: child.surveyData?.['section-5']?.q5_3 === 'हाँ' ? 'Yes' : 'No',
      disabilityTypes: child.surveyData?.['section-6']?.q6_2 || '',
      otherDisability: child.surveyData?.['section-6']?.q6_3 || '',
      goesToSchool: child.surveyData?.['section-4']?.q4_1 || '',
      rationCardType: child.surveyData?.['section-3']?.q3_1 || '',
      rationCardNumber: child.surveyData?.['section-3']?.q3_2 || '',
      surveyedAt: formatDate(child.surveyMeta?.surveyedAt),
    }));
  }, [apiChildren]);

  // No need for client-side filtering as search is now handled by the API
  const filteredData = useMemo(() => {
    return childrenData;
  }, [childrenData]);

  // Use filtered data for pagination
  const paginatedData = filteredData;

  // Unified export handler for children records: 'current' page or 'all' data
  const handleExportCSV = async (type: 'current' | 'all') => {
    // Get all user info from localStorage
    const userId = localStorage.getItem('user_id') || 'unknown';
    const userName = localStorage.getItem('user_name') || 'unknown';
    const userEmail = localStorage.getItem('user_email') || 'unknown';
    const userRole = localStorage.getItem('user_role') || 'unknown';

    const filtersApplied = {
      block: blockFilter,
      gramPanchayat: gramPanchayatFilter,
      status: statusFilter,
      search: debouncedSearchTerm
    };

    if (type === 'current') {
      const fileName = `children_records_${new Date().toISOString().split('T')[0]}.csv`;
      downloadChildrenCSV(childrenData, fileName);
      toast({ title: 'Success', description: 'Children records exported successfully' });

      // Mixpanel tracking with all user properties for current page export
      mixpanel.track('Export CSV', {
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        user_role: userRole,
        export_type: 'current_page',
        export_page: 'Children Records',
        filters_applied: filtersApplied,
      });
      return;
    }

    // Backend export for all data
    toast({ title: 'Exporting', description: 'Preparing full export. This may take a while.' });
    try {
      // Build query parameters from filters
      const params = new URLSearchParams();
      if (blockFilter !== 'all') params.append('block', blockFilter);
      if (gramPanchayatFilter !== 'all') params.append('gramPanchayat', gramPanchayatFilter);
      if (statusFilter !== 'all') params.append('educationStatus', statusFilter);
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);

      const queryString = params.toString();
      const endpoint = `/export/children${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      if (response.success && response.data && typeof response.data === 'object' && 'jobId' in response.data) {
        const jobId = (response.data as any).jobId;
        const createdAt = (response.data as any).createdAt ? new Date((response.data as any).createdAt) : new Date();
        
        // Add job to notification center - polling will be started by AppShell
        if (onAddExportJob) {
          onAddExportJob({
            id: jobId,
            status: 'processing',
            title: 'Children Records CSV Export - All Data',
            type: 'children-export',
            createdAt: createdAt,
            fileName: `children_records_all_${new Date().toISOString().split('T')[0]}.csv`,
          });
        }

        // Mixpanel tracking with all user properties for full export
        mixpanel.track('Export CSV', {
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          user_role: userRole,
          export_type: 'all',
          export_page: 'Children Records',
          job_id: jobId,
          filters_applied: filtersApplied,
        });
        
        toast({ title: 'Export Started', description: 'Your export is being processed. Check notifications for updates.' });
      } else {
        throw new Error('Failed to generate export');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: 'Error', description: 'Failed to start export. Please try again.' });
    }
  };

  const handleDeleteChild = (childId: string) => {
    setChildToDelete(childId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteChild = async () => {
    if (!childToDelete) return;

    try {
      await apiClient.deleteChild(childToDelete);
      toast({
        title: "Success",
        description: "Child record deleted successfully",
      });
      fetchChildren();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        title: "Error",
        description: "Failed to delete child record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChildToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const filterOptions = [
    {
      label: 'Block',
      value: blockFilter,
      options: [
        { label: 'All Blocks', value: 'all' },
        ...blocks.map(block => ({ label: block, value: block }))
      ]
    },
    {
      label: 'Gram Panchayat',
      value: gramPanchayatFilter,
      options: [
        { label: 'All Gram Panchayats', value: 'all' },
        ...gramPanchayats.map(gp => ({ label: gp, value: gp }))
      ]
    },
    {
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'Dropout', value: 'dropout' },
        { label: 'Never Enrolled', value: 'never_enrolled' }
      ]
    }
  ];

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'block') {
      setBlockFilter(value);
      setGramPanchayatFilter('all'); // Reset Gram Panchayat when block changes
      setCurrentPage(1);
    } else if (filterId === 'gramPanchayat') {
      setGramPanchayatFilter(value);
      setCurrentPage(1);
    } else if (filterId === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  const handleEditChild = (childId: string) => {
    // Find the child data from apiChildren (original API data)
    const childData = apiChildren.find(child => child.id === childId);
    if (onEditChild && childData) {
      // Calculate education status from surveyData
      const educationStatus = (childData.surveyData?.['section-4']?.q4_1 === 'नहीं' && childData.surveyData?.['section-4']?.q4_7 === 'शाला त्यागी') ? 'Dropout'
        : (childData.surveyData?.['section-4']?.q4_1 === 'नहीं' && childData.surveyData?.['section-4']?.q4_7 === 'अप्रवेशी') ? 'Never Enrolled'
        : (childData.surveyData?.['section-4']?.q4_1 === 'हाँ' || childData.surveyData?.['section-4']?.q4_1 === 'आंगनवाड़ी') ? 'Enrolled'
        : 'N/A';

      // Transform the API data to match the expected format for EditChildDetails
      const transformedData = {
        id: childData.id,
        villageId: childData.surveyMeta?.villageId || '',
        fullName: childData.surveyData?.['section-1']?.q1_1 || '',
        gender: childData.surveyData?.['section-1']?.q1_4 || '',
        block: childData.surveyData?.['section-1']?.q1_5 || '',
        panchayat: childData.surveyData?.['section-1']?.q1_6 || '',
        para: childData.surveyData?.['section-1']?.q1_8 || '',
        cluster: '', // surveyData में नहीं है
        motherTongue: childData.surveyData?.['section-1']?.q1_9 || '',
        motherName: childData.surveyData?.['section-1']?.q1_10 || '',
        fatherName: childData.surveyData?.['section-1']?.q1_11 || '',
        motherEducated: childData.surveyData?.['section-1']?.q1_12 || '',
        fatherEducated: childData.surveyData?.['section-1']?.q1_13 || '',
        familyOccupation: childData.surveyData?.['section-2']?.q2_1 || '',
        caste: childData.surveyData?.['section-2']?.q2_3 || '',
        parentsStatus: childData.surveyData?.['section-2']?.q2_5 || '',
        livesWithWhom: childData.surveyData?.['section-2']?.q2_6 || '',
        goesToSchool: childData.surveyData?.['section-4']?.q4_1 || '',
        schoolName: childData.surveyData?.['section-4']?.q4_3 || '',
        currentClass: childData.surveyData?.['section-4']?.q4_2 || '',
        attendanceStatus: childData.surveyData?.['section-4']?.q4_5 || '',
        educationStatus: educationStatus,
        hasCasteCertificate: childData.surveyData?.['section-5']?.q5_1 === 'हाँ' ? true : false,
        hasResidenceCertificate: childData.surveyData?.['section-5']?.q5_2 === 'हाँ' ? true : false,
        hasAadhaar: childData.surveyData?.['section-5']?.q5_3 === 'हाँ' ? true : false,
        aadhaarNumber: childData.surveyData?.['section-5']?.q5_3 === 'हाँ' ? childData.surveyData?.['section-5']?.q5_4 : '',
        hasDisability: childData.surveyData?.['section-6']?.q6_1 === 'हाँ' ? true : false
      };
      onEditChild(childId, transformedData);
    }
  };

  const handleEditSuccess = () => {
    // Refresh the children data after successful edit
    fetchChildren();
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <ChildrenRecordsHeader />
        
        <ChildrenRecordsContent
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          blockFilter={blockFilter}
          gramPanchayatFilter={gramPanchayatFilter}
          statusFilter={statusFilter}
          blocks={blocks}
          gramPanchayats={gramPanchayats}
          onBlockFilterChange={setBlockFilter}
          onGramPanchayatFilterChange={setGramPanchayatFilter}
          onStatusFilterChange={setStatusFilter}
          paginatedData={paginatedData}
          filteredData={filteredData}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onChildClick={(childId: string) => {
            const childData = apiChildren.find(child => child.id === childId);
            onChildClick(childId, childData);
          }}
          onEditChild={handleEditChild}
          onDeleteChild={handleDeleteChild}
          handleExportCSV={handleExportCSV}
          handleFilterChange={handleFilterChange}
          filterOptions={filterOptions}
          totalCount={totalCount}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Child Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this child record? This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteChild}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChildrenRecords;
