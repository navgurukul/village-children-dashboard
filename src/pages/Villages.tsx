
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import VillagesHeader from '../components/villages/VillagesHeader';
import VillagesSearchAndActions from '../components/villages/VillagesSearchAndActions';
import VillagesFilters from '../components/villages/VillagesFilters';
import FilterChips from '../components/FilterChips';
import VillagesTable from '../components/villages/VillagesTable';
import VillagesCardList from '../components/villages/VillagesCardList';
import { useIsMobile } from "@/hooks/use-mobile";

interface Village {
  id: string;
  name: string;
  block: string;
  gramPanchayat: string;
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  assignedBalMitra: string;
}

interface VillagesProps {
  onAddVillage: () => void;
  onBulkUpload: () => void;
  onVillageClick: (villageId: string) => void;
  onEditVillage: (villageId: string) => void;
  onDeleteVillage: (villageId: string) => void;
}

const Villages = ({ onAddVillage, onBulkUpload, onVillageClick, onEditVillage,onDeleteVillage }: VillagesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [gramPanchayatFilter, setGramPanchayatFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();

  // Mock villages data
  const villagesData: Village[] = [
    {
      id: '1',
      name: 'Haripur',
      block: 'Block C',
      gramPanchayat: 'Gram Panchayat 1',
      totalChildren: 245,
      enrolled: 189,
      dropout: 42,
      neverEnrolled: 14,
      assignedBalMitra: 'Ravi Kumar'
    },
    // ... more villages data
  ];

  // Get unique blocks and gram panchayats for filters
  const blocks = useMemo(() => {
    return [...new Set(villagesData.map(village => village.block))];
  }, []);

  const gramPanchayats = useMemo(() => {
    return [...new Set(villagesData.map(village => village.gramPanchayat))];
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return villagesData.filter(village => {
      const matchesSearch = searchTerm === '' || 
        village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.gramPanchayat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.assignedBalMitra.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBlock = blockFilter === 'all' || village.block === blockFilter;
      const matchesGramPanchayat = gramPanchayatFilter === 'all' || village.gramPanchayat === gramPanchayatFilter;

      return matchesSearch && matchesBlock && matchesGramPanchayat;
    });
  }, [searchTerm, blockFilter, gramPanchayatFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'block') {
      setBlockFilter(value);
    } else if (filterId === 'gram panchayat') {
      setGramPanchayatFilter(value);
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
    }
  ];

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {!isMobile && <VillagesHeader />}
        
        {isMobile ? (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Villages</h1>
            
            {/* Search Bar - Full Width */}
            <VillagesSearchAndActions
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddVillage={onAddVillage}
              onBulkUpload={onBulkUpload}
              isMobile={true}
            />

            {/* Filter Chips */}
            <FilterChips
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />

            <div className="text-muted-foreground text-xs">
              Showing {paginatedData.length} of {filteredData.length} villages
            </div>

            {/* Villages Card List */}
            <VillagesCardList
              villages={paginatedData}
              onVillageClick={onVillageClick}
              onEditVillage={onEditVillage}
              onDeleteVillage={onDeleteVillage}
            />
          </div>
        ) : (
          <>
            <VillagesSearchAndActions
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddVillage={onAddVillage}
              onBulkUpload={onBulkUpload}
            />

            <VillagesFilters
              blockFilter={blockFilter}
              gramPanchayatFilter={gramPanchayatFilter}
              blocks={blocks}
              gramPanchayats={gramPanchayats}
              onBlockFilterChange={setBlockFilter}
              onGramPanchayatFilterChange={setGramPanchayatFilter}
            />

            <div className="text-muted-foreground text-xs">
              Showing {paginatedData.length} of {filteredData.length} villages
            </div>

            <VillagesTable
              villages={paginatedData}
              onVillageClick={onVillageClick}
              onEditVillage={onEditVillage}
              onDeleteVillage={onDeleteVillage}
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

export default Villages;
