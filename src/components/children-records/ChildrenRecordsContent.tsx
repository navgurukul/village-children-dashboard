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
  school: string;
  schoolStatus: string;
  block: string;
  gramPanchayat: string;
  para: string; 
}

interface ChildrenRecordsContentProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  blockFilter: string;
  statusFilter: string;
  blocks: string[];
  onBlockFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  gramPanchayatFilter: string;
  gramPanchayats: string[];
  onGramPanchayatFilterChange: (value: string) => void;
  paginatedData: Child[];
  filteredData: Child[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  onChildClick: (childId: string) => void;
  onEditChild?: (childId: string) => void;
  onDeleteChild: (childId: string) => void;
  handleExportCSV: () => void;
  handleFilterChange: (filterId: string, value: string) => void;
  filterOptions: Array<{
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
  }>;
  totalCount: number;
}

const ChildrenRecordsContent = ({
  searchTerm,
  onSearchChange,
  blockFilter,
  statusFilter,
  blocks,
  onBlockFilterChange,
  onStatusFilterChange,
  gramPanchayatFilter,
  gramPanchayats,
  onGramPanchayatFilterChange,
  paginatedData,
  filteredData,
  currentPage,
  totalPages,
  setCurrentPage,
  onChildClick,
  onEditChild,
  onDeleteChild,
  handleExportCSV,
  handleFilterChange,
  filterOptions,
  totalCount
}: ChildrenRecordsContentProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          <div className="w-full">
            <SearchAndExportBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              onExportCSV={handleExportCSV}
              isMobile={true}
            />
          </div>

          <FilterChips
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />

          <div className="text-muted-foreground text-xs">
            Showing {paginatedData.length} of {totalCount} children
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
          />

          <FiltersRow
            blockFilter={blockFilter}
            statusFilter={statusFilter}
            blocks={blocks}
            onBlockFilterChange={onBlockFilterChange}
            onStatusFilterChange={onStatusFilterChange}
            gramPanchayatFilter={gramPanchayatFilter}
            gramPanchayats={gramPanchayats}
            onGramPanchayatFilterChange={onGramPanchayatFilterChange}
          />

          <div className="text-muted-foreground text-xs">
            Showing {paginatedData.length} of {totalCount} children
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
