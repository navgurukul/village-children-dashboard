
import React, { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import VillagesHeader from '../components/villages/VillagesHeader';
import VillagesSearchAndActions from '../components/villages/VillagesSearchAndActions';
import VillagesFilters from '../components/villages/VillagesFilters';
import VillagesTable from '../components/villages/VillagesTable';
import { useIsMobile } from '@/hooks/use-mobile';

interface VillagesProps {
  onAddVillage: () => void;
  onBulkUpload: () => void;
  onVillageClick: (villageId: string) => void;
  onEditVillage: (villageId: string) => void;
  onDeleteVillage: (villageId: string) => void;
}

const Villages = ({ onAddVillage, onBulkUpload, onVillageClick, onEditVillage, onDeleteVillage }: VillagesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilters, setLocationFilters] = useState({
    block: 'all',
    panchayat: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();

  // Mock data - removed cluster
  const villagesData = [
    {
      id: '1',
      name: 'Haripur',
      block: 'Block A',
      panchayat: 'Panchayat 1',
      totalChildren: 245,
      enrolled: 189,
      dropout: 42,
      neverEnrolled: 14,
      assignedBalMitra: 'Ravi Kumar'
    },
    {
      id: '2',
      name: 'Rampur',
      block: 'Block A',
      panchayat: 'Panchayat 2',
      totalChildren: 180,
      enrolled: 156,
      dropout: 18,
      neverEnrolled: 6,
      assignedBalMitra: 'Priya Singh'
    },
    {
      id: '3',
      name: 'Govindpur',
      block: 'Block B',
      panchayat: 'Panchayat 3',
      totalChildren: 320,
      enrolled: 245,
      dropout: 55,
      neverEnrolled: 20,
      assignedBalMitra: 'Amit Sharma'
    }
  ];

  const filteredVillages = villagesData.filter(village => {
    const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         village.assignedBalMitra.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = locationFilters.block === 'all' || village.block === locationFilters.block;
    const matchesPanchayat = locationFilters.panchayat === 'all' || village.panchayat === locationFilters.panchayat;
    
    return matchesSearch && matchesBlock && matchesPanchayat;
  });

  const totalPages = Math.ceil(filteredVillages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVillages = filteredVillages.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLocationFilterChange = (key: keyof typeof locationFilters, value: string) => {
    setLocationFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`p-4 md:p-6 bg-background min-h-screen ${isMobile ? 'pt-4' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <VillagesHeader onAddVillage={onAddVillage} onBulkUpload={onBulkUpload} />

        <VillagesSearchAndActions 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddVillage={onAddVillage}
          onBulkUpload={onBulkUpload}
        />

        <VillagesFilters 
          locationFilters={locationFilters}
          onLocationFilterChange={handleLocationFilterChange}
        />

        <div className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-xs'}`}>
          Showing {currentVillages.length} of {filteredVillages.length} villages
        </div>

        <VillagesTable
          villages={currentVillages}
          onVillageClick={onVillageClick}
          onEditVillage={onEditVillage}
          onDeleteVillage={onDeleteVillage}
        />

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Villages;
