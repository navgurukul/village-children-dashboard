
import React from 'react';
import { Button } from "@/components/ui/button";
import SearchAndExportBar from './SearchAndExportBar';
import FiltersRow from './FiltersRow';
import FilterChips from '../FilterChips';
import ChildrenTable from './ChildrenTable';
import ChildrenCardList from './ChildrenCardList';
import { useIsMobile } from "@/hooks/use-mobile";

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  aadhaar: string;
  aadhaarNumber: string;
  schoolName: string;
  schoolStatus: string;
  block: string;
  gramPanchayat: string;
}

interface ChildrenRecordsContentProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  blockFilter: string;
  statusFilter: string;
  blocks: string[];
  onBlockFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  paginatedData: Child[];
  filteredData: Child[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onChildClick: (childId: string) => void;
  onEditChild?: (childId: string) => void;
  onDeleteChild: (childId: string) => void;
  handleExportCSV: () => void;
  handleExportPDF: () => void;
  handleFilterChange: (filterId: string, value: string) => void;
  filterOptions: Array<{
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
  }>;
}

const ChildrenRecordsContent = ({
  searchTerm,
  onSearchChange,
  blockFilter,
  statusFilter,
  blocks,
  onBlockFilterChange,
  onStatusFilterChange,
  paginatedData,
  filteredData,
  currentPage,
  setCurrentPage,
  onChildClick,
  onEditChild,
  onDeleteChild,
  handleExportCSV,
  handleExportPDF,
  handleFilterChange,
  filterOptions
}: ChildrenRecordsContentProps) => {
  const isMobile = useIsMobile();
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          <div className="w-full">
            <SearchAndExportBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
              isMobile={true}
            />
          </div>

          <FilterChips
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />

          <div className="text-muted-foreground text-xs">
            Showing {paginatedData.length} of {filteredData.length} children
          </div>

          <ChildrenCardList
            data={paginatedData}
            onChildClick={onChildClick}
            onEditChild={onEditChild}
            onDeleteChild={onDeleteChild}
          />
        </div>
      ) : (
        <>
          <SearchAndExportBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            onExportCSV={handleExportCSV}
            onExportPDF={handleExportPDF}
          />

          <FiltersRow
            blockFilter={blockFilter}
            statusFilter={statusFilter}
            blocks={blocks}
            onBlockFilterChange={onBlockFilterChange}
            onStatusFilterChange={onStatusFilterChange}
          />

          <div className="text-muted-foreground text-xs">
            Showing {paginatedData.length} of {filteredData.length} children
          </div>

          <ChildrenTable
            data={paginatedData}
            onChildClick={onChildClick}
            onEditChild={onEditChild}
            onDeleteChild={onDeleteChild}
          />
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button 
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-xs">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default ChildrenRecordsContent;
