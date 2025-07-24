
import React, { useState, useMemo, useEffect } from 'react';
import ChildrenRecordsHeader from '../components/children-records/ChildrenRecordsHeader';
import ChildrenRecordsContent from '../components/children-records/ChildrenRecordsContent';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiClient, Child } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { downloadChildrenCSV } from '../utils/exportUtils';

interface ChildrenRecordsProps {
  onChildClick: (childId: string, childData?: any) => void;
  onEditChild?: (childId: string, childData?: any) => void;
}

const ChildrenRecords = ({ onChildClick, onEditChild }: ChildrenRecordsProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [apiChildren, setApiChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<string | null>(null);
  const itemsPerPage = 50;

  // Fetch children data from API
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (blockFilter !== 'all') params.block = blockFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      console.log('Fetching children with params:', params);
      const response = await apiClient.getChildren(params);
      console.log('API response:', response);
      // Filter out deleted children
      const activeChildren = response.data.children.filter(child => !child.auditInfo.isDeleted);
      setApiChildren(activeChildren);
      setTotalCount(activeChildren.length);
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
    fetchChildren();
  }, [currentPage, blockFilter, statusFilter]);

  // Get unique blocks for filter from API data
  const blocks = useMemo(() => {
    return [...new Set(apiChildren.map(child => child.basicInfo.block))];
  }, [apiChildren]);

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
      schoolName: child.educationInfo.schoolName,
      schoolStatus: child.educationInfo.educationStatus,
      block: child.basicInfo.block,
      gramPanchayat: child.basicInfo.gramPanchayat || ''
    }));
  }, [apiChildren]);

  // Filter data (client-side filtering for search only)
  // The API already handles block and status filtering
  const filteredData = useMemo(() => {
    if (!searchTerm) return childrenData;
    
    return childrenData.filter(child => {
      const matchesSearch = searchTerm === '' || 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.block.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [childrenData, searchTerm]);

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
    } else if (filterId === 'status') {
      setStatusFilter(value);
    }
  };

  const handleEditChild = (childId: string) => {
    // Find the child data from apiChildren (original API data)
    const childData = apiChildren.find(child => child.id === childId);
    if (onEditChild) {
      onEditChild(childId, childData);
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
