
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { mockStudentData } from '../data/mockData';
import SearchAndExportBar from '../components/children-records/SearchAndExportBar';
import FiltersRow from '../components/children-records/FiltersRow';
import ChildrenTable from '../components/children-records/ChildrenTable';

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

  // Get unique blocks for filter
  const blocks = useMemo(() => {
    return [...new Set(mockStudentData.map(student => student.block))];
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return mockStudentData.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.block.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBlock = blockFilter === 'all' || student.block === blockFilter;
      const matchesStatus = statusFilter === 'all' || student.schoolStatus === statusFilter;

      return matchesSearch && matchesBlock && matchesStatus;
    });
  }, [searchTerm, blockFilter, statusFilter]);

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

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Children Records</h1>

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
