import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import VillagesHeader from '../components/villages/VillagesHeader';
import VillagesSearchAndActions from '../components/villages/VillagesSearchAndActions';
import VillagesFilters from '../components/villages/VillagesFilters';
import FilterChips from '../components/FilterChips';
import VillagesTable from '../components/villages/VillagesTable';
import VillagesCardList from '../components/villages/VillagesCardList';
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient, Village as ApiVillage } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface VillageDisplayData {
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
  onEditVillage: (village: any) => void;
  onDeleteVillage: (villageId: string) => void;
}

const Villages = ({ onAddVillage, onBulkUpload, onVillageClick, onEditVillage, onDeleteVillage }: VillagesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [gramPanchayatFilter, setGramPanchayatFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [villages, setVillages] = useState<ApiVillage[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Load villages from API
  useEffect(() => {
    loadVillages();
  }, [currentPage, blockFilter, gramPanchayatFilter]);

  const loadVillages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVillages({
        page: currentPage,
        limit: itemsPerPage,
        district: 'Dhanbad', // Default district
        panchayat: gramPanchayatFilter !== 'all' ? gramPanchayatFilter : undefined
      });

      if (response.success) {
        setVillages(response.data.items);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (error) {
      console.error('Error loading villages:', error);
      toast({
        title: "Error",
        description: "Failed to load villages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Convert API villages to display format
  const villageDisplayData: VillageDisplayData[] = useMemo(() => {
    return villages.map(village => ({
      id: village.id,
      name: village.name,
      block: village.block,
      gramPanchayat: village.panchayat,
      totalChildren: Math.floor(village.population * 0.15), // Rough estimate
      enrolled: Math.floor(village.population * 0.12),
      dropout: Math.floor(village.population * 0.02),
      neverEnrolled: Math.floor(village.population * 0.01),
      assignedBalMitra: 'Bal Mitra Name' // This would come from actual assignment data
    }));
  }, [villages]);

  // Get unique blocks and gram panchayats for filters
  const blocks = useMemo(() => {
    return [...new Set(villageDisplayData.map(village => village.block))];
  }, [villageDisplayData]);

  const gramPanchayats = useMemo(() => {
    return [...new Set(villageDisplayData.map(village => village.gramPanchayat))];
  }, [villageDisplayData]);

  // Filter data
  const filteredData = useMemo(() => {
    return villageDisplayData.filter(village => {
      const matchesSearch = searchTerm === '' || 
        village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.gramPanchayat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.assignedBalMitra.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBlock = blockFilter === 'all' || village.block === blockFilter;
      const matchesGramPanchayat = gramPanchayatFilter === 'all' || village.gramPanchayat === gramPanchayatFilter;

      return matchesSearch && matchesBlock && matchesGramPanchayat;
    });
  }, [villageDisplayData, searchTerm, blockFilter, gramPanchayatFilter]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'block') {
      setBlockFilter(value);
    } else if (filterId === 'gram panchayat') {
      setGramPanchayatFilter(value);
    }
    setCurrentPage(1);
  };

  const handleDeleteVillage = async (villageId: string) => {
    try {
      const response = await apiClient.deleteVillage(villageId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Village deleted successfully",
        });
        loadVillages();
      }
    } catch (error) {
      console.error('Error deleting village:', error);
      toast({
        title: "Error",
        description: "Failed to delete village",
        variant: "destructive",
      });
    }
    onDeleteVillage(villageId);
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

  if (loading && villages.length === 0) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading villages...</p>
          </div>
        </div>
      </div>
    );
  }

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
              Showing {filteredData.length} of {totalCount} villages
            </div>

            {/* Villages Card List */}
            <VillagesCardList
              villages={filteredData}
              onVillageClick={onVillageClick}
              onEditVillage={(villageId) => {
                const village = filteredData.find(v => v.id === villageId);
                if (village) onEditVillage(village);
              }}
              onDeleteVillage={handleDeleteVillage}
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
              Showing {filteredData.length} of {totalCount} villages
            </div>

            <VillagesTable
              villages={filteredData}
              onVillageClick={onVillageClick}
              onEditVillage={(villageId) => {
                const village = filteredData.find(v => v.id === villageId);
                if (village) onEditVillage(village);
              }}
              onDeleteVillage={handleDeleteVillage}
            />
          </>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button 
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || loading}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages || loading}
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