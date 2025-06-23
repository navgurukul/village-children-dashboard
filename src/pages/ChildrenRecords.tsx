
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { mockStudentData } from '../data/mockData';
import SearchAndExportBar from '../components/children-records/SearchAndExportBar';
import FiltersRow from '../components/children-records/FiltersRow';
import FilterChips from '../components/FilterChips';
import ChildrenTable from '../components/children-records/ChildrenTable';
import ChildrenCardList from '../components/children-records/ChildrenCardList';
import { useIsMobile } from "@/hooks/use-mobile";

interface ChildrenRecordsProps {
  onChildClick: (childId: string) => void;
  onEditChild?: (childId: string) => void;
}

const ChildrenRecords = ({ onChildClick, onEditChild }: ChildrenRecordsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();

  // Get unique blocks for filter
  const blocks = useMemo(() => {
    return [...new Set(mockStudentData.map(student => student.block))];
  }, []);

  // Transform mockStudentData to match Child interface
  const childrenData = useMemo(() => {
    return mockStudentData.map(student => ({
      id: student.id,
      name: student.name,
      age: student.age,
      gender: student.gender,
      village: student.village,
      aadhaar: 'N/A', // Not available in StudentData
      schoolName: student.school || 'N/A',
      schoolStatus: student.schoolStatus,
      block: student.block,
      gramPanchayat: student.panchayat || 'N/A'
    }));
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return childrenData.filter(child => {
      const matchesSearch = searchTerm === '' || 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.block.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBlock = blockFilter === 'all' || child.block === blockFilter;
      const matchesStatus = statusFilter === 'all' || child.schoolStatus === statusFilter;

      return matchesSearch && matchesBlock && matchesStatus;
    });
  }, [childrenData, searchTerm, blockFilter, statusFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleDeleteChild = (childId: string) => {
    console.log('Deleting child:', childId);
  };

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'block') {
      setBlockFilter(value);
    } else if (filterId === 'status') {
      setStatusFilter(value);
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
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Enrolled', value: 'Enrolled' },
        { label: 'Dropout', value: 'Dropout' },
        { label: 'Never Enrolled', value: 'Never Enrolled' }
      ]
    }
  ];

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Children Records</h1>

        {isMobile ? (
          <div className="space-y-4">
            {/* Search Bar - Full Width */}
            <div className="w-full">
              <SearchAndExportBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
                isMobile={true}
              />
            </div>

            {/* Filter Chips */}
            <FilterChips
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />

            <div className="text-muted-foreground text-xs">
              Showing {paginatedData.length} of {filteredData.length} children
            </div>

            {/* Children Card List */}
            <ChildrenCardList
              data={paginatedData}
              onChildClick={onChildClick}
              onEditChild={onEditChild}
              onDeleteChild={handleDeleteChild}
            />
          </div>
        ) : (
          <>
            <SearchAndExportBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
            />

            <FiltersRow
              blockFilter={blockFilter}
              statusFilter={statusFilter}
              blocks={blocks}
              onBlockFilterChange={setBlockFilter}
              onStatusFilterChange={setStatusFilter}
            />

            <div className="text-muted-foreground text-xs">
              Showing {paginatedData.length} of {filteredData.length} children
            </div>

            <ChildrenTable
              data={paginatedData}
              onChildClick={onChildClick}
              onEditChild={onEditChild}
              onDeleteChild={handleDeleteChild}
            />
          </>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenRecords;
