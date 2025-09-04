
import React, { useState, useMemo, useEffect } from 'react';
import ChildrenRecordsHeader from '../components/children-records/ChildrenRecordsHeader';
import ChildrenRecordsContent from '../components/children-records/ChildrenRecordsContent';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiClient, Child } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { downloadChildrenCSV } from '../utils/exportUtils';
import { House } from 'lucide-react';

interface ChildrenRecordsProps {
  onChildClick: (childId: string, childData?: any) => void;
  onEditChild?: (childId: string, childData?: any) => void;
}

const ChildrenRecords = ({ onChildClick, onEditChild }: ChildrenRecordsProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiChildren, setApiChildren] = useState<Child[]>([]);
  const [blocksData, setBlocksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const itemsPerPage = 50;

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
      if (statusFilter !== 'all') params.educationStatus = statusFilter;
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;

      console.log('Fetching children with params:', params);
      const response = await apiClient.getChildren(params);
      console.log('API response:', response);
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
  }, [currentPage, blockFilter, statusFilter, debouncedSearchTerm]);

  // Get blocks from API data
  const blocks = useMemo(() => {
    return blocksData.map(blockData => blockData.block);
  }, [blocksData]);

  // Transform API data to match expected interface for components
  const childrenData = useMemo(() => {
    return apiChildren.map(child => ({
      id: child.id,
      name: child.basicInfo.fullName,
      age: child.basicInfo.age,
      gender: child.basicInfo.gender,
      village: child.basicInfo.para,
      aadhaar: child.documentsInfo.aadhaarNumber,
      aadhaarNumber: child.documentsInfo.aadhaarNumber,
      schoolName: child.educationInfo.schoolName || '',
      school: child.educationInfo.schoolName || '',
      schoolStatus: child.educationInfo.educationStatus || child.derivedFields?.educationStatus || 'N/A', // Use educationStatus like ChildDetails page
      block: child.basicInfo.block,
      gramPanchayat: child.basicInfo.gramPanchayat || '',
      disability: child.healthInfo.hasDisability ? 'Yes' : 'No',
      caste: child.familyInfo.caste || '',
      dob: child.basicInfo.dateOfBirth || '',
      fatherName: child.familyInfo.fatherName || '',
      motherName: child.familyInfo.motherName || '',
      motherEducated: typeof child.familyInfo.motherEducated === 'boolean' ? (child.familyInfo.motherEducated ? 'Yes' : 'No') : child.familyInfo.motherEducated || '',
      fatherEducated: typeof child.familyInfo.fatherEducated === 'boolean' ? (child.familyInfo.fatherEducated ? 'Yes' : 'No') : child.familyInfo.fatherEducated || '',
      familyOccupation: child.familyInfo.familyOccupation || '',
      parentsStatus: child.familyInfo.parentsStatus || '',
      livesWithWhom: child.familyInfo.livesWithWhom || '',
      economicStatus: child.economicInfo?.economicStatus || '',
      houseNumber: child.surveyData?.['section-1']?.q1_new_house || '',
      motherTongue: child.basicInfo?.motherTongue || child.surveyData?.['section-1']?.q1_9 || '',
      otherMotherTongue: child.surveyData?.['section-1']?.q1_9_other || '',
      otherOccupation: child.surveyData?.['section-2']?.q2_1_other || '',
      otherCaste: child.surveyData?.['section-2']?.q2_2_other || '',
      otherLivesWith: child.surveyData?.['section-2']?.q2_4_other || '',
      rationCardType: child.economicInfo?.rationCardType || child.surveyData?.['section-3']?.q3_1 || '',
      rationCardNumber: child.economicInfo?.rationCardNumber || child.surveyData?.['section-3']?.q3_2 || '',
      attendanceStatus: child.surveyData?.['section-4']?.q4_3 || '',
      currentClass: child.educationInfo?.currentClass || child.surveyData?.['section-4']?.q4_4 || '',
      educationCategory: child.surveyData?.['section-4']?.q4_6 || '',
      lastClassStudied: child.surveyData?.['section-4']?.q4_7 || '',
      dropoutReasons: child.surveyData?.['section-4']?.q4_8 || '',
      otherDropoutReason: child.surveyData?.['section-4']?.q4_9 || '',
      neverEnrolledReasons: child.surveyData?.['section-4']?.q4_10 || '',
      otherNeverEnrolledReason: child.surveyData?.['section-4']?.q4_11 || '',
      hasCasteCertificate: child.documentsInfo?.hasCasteCertificate ? 'Yes' : child.surveyData?.['section-5']?.q5_1 === 'yes' ? 'Yes' : 'No',
      hasResidenceCertificate: child.documentsInfo?.hasResidenceCertificate ? 'Yes' : child.surveyData?.['section-5']?.q5_2 === 'yes' ? 'Yes' : 'No',
      hasAadhaar: child.documentsInfo?.hasAadhaar ? 'Yes' : child.surveyData?.['section-5']?.q5_3 === 'yes' ? 'Yes' : 'No',
      disabilityTypes: child.surveyData?.['section-6']?.q6_2 || '',
      otherDisability: child.surveyData?.['section-6']?.q6_3 || '',
    }));
  }, [apiChildren]);

  // No need for client-side filtering as search is now handled by the API
  const filteredData = useMemo(() => {
    return childrenData;
  }, [childrenData]);

  // Use filtered data for pagination
  const paginatedData = filteredData;

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `children_records_${timestamp}`;
    downloadChildrenCSV(filteredData, filename);
    
    toast({
      title: "Success",
      description: "Children records exported successfully",
    });
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
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

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'block') {
      setBlockFilter(value);
      setCurrentPage(1); // Reset to first page when filter changes
    } else if (filterId === 'status') {
      setStatusFilter(value);
      setCurrentPage(1); // Reset to first page when filter changes
    }
  };

  const handleEditChild = (childId: string) => {
    // Find the child data from apiChildren (original API data)
    const childData = apiChildren.find(child => child.id === childId);
    if (onEditChild && childData) {
      // Transform the API data to match the expected format for EditChildDetails
      const transformedData = {
        id: childData.id,
        villageId: childData.surveyMeta.villageId,
        fullName: childData.basicInfo.fullName,
        age: childData.basicInfo.age,
        gender: childData.basicInfo.gender,
        block: childData.basicInfo.block,
        panchayat: childData.basicInfo.gramPanchayat,
        para: childData.basicInfo.para,
        cluster: childData.basicInfo.cluster,
        motherTongue: childData.basicInfo.motherTongue,
        motherName: childData.familyInfo.motherName,
        fatherName: childData.familyInfo.fatherName,
        motherEducated: childData.familyInfo.motherEducated,
        fatherEducated: childData.familyInfo.fatherEducated,
        familyOccupation: childData.familyInfo.familyOccupation,
        caste: childData.familyInfo.caste,
        parentsStatus: childData.familyInfo.parentsStatus,
        livesWithWhom: childData.familyInfo.livesWithWhom,
        goesToSchool: childData.educationInfo.goesToSchool,
        schoolName: childData.educationInfo.schoolName || '',
        currentClass: childData.educationInfo.currentClass,
        attendanceStatus: childData.educationInfo.attendanceStatus,
        educationStatus: childData.educationInfo.educationStatus,
        hasCasteCertificate: childData.documentsInfo.hasCasteCertificate,
        hasResidenceCertificate: childData.documentsInfo.hasResidenceCertificate,
        hasAadhaar: childData.documentsInfo.hasAadhaar,
        aadhaarNumber: childData.documentsInfo.aadhaarNumber || '',
        hasDisability: childData.healthInfo.hasDisability
      };
      onEditChild(childId, transformedData);
    }
  };

  const handleEditSuccess = () => {
    // Refresh the children data after successful edit
    fetchChildren();
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

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <ChildrenRecordsHeader />
        
        <ChildrenRecordsContent
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          blockFilter={blockFilter}
          statusFilter={statusFilter}
          blocks={blocks}
          onBlockFilterChange={setBlockFilter}
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
