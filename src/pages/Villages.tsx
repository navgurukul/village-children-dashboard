import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import VillagesHeader from '../components/villages/VillagesHeader';
import VillagesSearchAndActions from '../components/villages/VillagesSearchAndActions';
import VillagesFilters from '../components/villages/VillagesFilters';
import FilterChips from '../components/FilterChips';
import VillagesTable from '../components/villages/VillagesTable';
import VillagesCardList from '../components/villages/VillagesCardList';
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient, GramPanchayat as ApiGramPanchayat, GramPanchayatResponse } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface GramPanchayatDisplayData {
  id: string;
  name: string;
  district: string;
  block?: string; // Single block property
  blocks?: string[]; // Array of blocks for backward compatibility
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  totalParas?: number;
  assignedBalMitra?: string; // Added assignedBalMitra field
}

interface VillagesProps {
  onAddVillage: () => void;
  onBulkUpload: () => void;
  onVillageClick: (villageData: any) => void;
  onEditVillage: (village: any) => void;
  onDeleteVillage: (villageId: string) => void;
}

const Villages = ({ onAddVillage, onBulkUpload, onVillageClick, onEditVillage, onDeleteVillage }: VillagesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [gramPanchayatsList, setGramPanchayatsList] = useState<ApiGramPanchayat[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Fetch blocks data from API
  const fetchBlocksData = async (district?: string) => {
    try {
      console.log('Fetching blocks data for district:', district);
      const response = await apiClient.getDistrictGramPanchayats(district);
      console.log('Blocks API response:', response);
      
      // Debug the response structure
      if (response.success && response.data) {
        logBlocksData(response.data);
      }
      
      if (response.success && response.data) {
        // Check if the response is an array (as shown in your example)
        if (Array.isArray(response.data)) {
          console.log('Processing block data from array response');
          // Extract block names from the array of objects
          const blocks: string[] = response.data.map(item => item.block);
          console.log('Extracted blocks:', blocks);
          setAvailableBlocks(blocks);
        } 
        // Handle the other response formats as before
        else if (response.data.blocks && response.data.blocks.length > 0) {
          console.log('Setting blocks from response.data.blocks');
          setAvailableBlocks(response.data.blocks);
        } else if (response.data.blockGramPanchayats) {
          console.log('Setting blocks from response.data.blockGramPanchayats');
          const blocks: string[] = response.data.blockGramPanchayats.map(item => item.block);
          setAvailableBlocks(blocks);
        } else {
          console.warn('No blocks found in response:', response);
          setAvailableBlocks([]);
        }
      } else {
        console.warn('Invalid API response:', response);
        setAvailableBlocks([]);
      }
    } catch (error) {
      console.error('Error fetching blocks data:', error);
      // Extract blocks from gram panchayat data if available
      const blocks = new Set<string>();
      gramPanchayatsList.forEach(gp => {
        if (gp.blocks && gp.blocks.length > 0) {
          gp.blocks.forEach(block => blocks.add(block));
        }
      });
      setAvailableBlocks(Array.from(blocks));
    }
  };
  
  // Additional method to inspect and debug the blocks data
  const logBlocksData = (data: any) => {
    console.log('------- BLOCKS DATA DEBUGGING -------');
    console.log('Data type:', typeof data);
    console.log('Is Array:', Array.isArray(data));
    
    if (Array.isArray(data)) {
      console.log('Array length:', data.length);
      if (data.length > 0) {
        console.log('First item sample:', data[0]);
      }
    } else if (data && typeof data === 'object') {
      console.log('Object keys:', Object.keys(data));
    }
    
    console.log('----------------------------------');
  };

  // Load gram panchayats from API
  const loadGramPanchayats = async () => {
    try {
      setLoading(true);
      console.log('Loading gram panchayats with filters:', {
        page: currentPage,
        limit: itemsPerPage,
        district: districtFilter !== 'all' ? districtFilter : undefined,
        block: blockFilter !== 'all' ? blockFilter : undefined,
        search: debouncedSearchTerm || undefined
      });
      
      const response = await apiClient.getGramPanchayats({
        page: currentPage,
        limit: itemsPerPage,
        district: districtFilter !== 'all' ? districtFilter : undefined,
        block: blockFilter !== 'all' ? blockFilter : undefined,
        search: debouncedSearchTerm || undefined
      });

      console.log('Gram panchayat API response:', response);
      
      if (response.success) {
        console.log('Setting gram panchayats list:', response.data.items);
        setGramPanchayatsList(response.data.items);
        setTotalCount(response.data.pagination.totalCount);
      } else {
        console.error('API returned error:', response);
        toast({
          title: "Error",
          description: "Failed to load gram panchayats",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading gram panchayats:', error);
      toast({
        title: "Error",
        description: "Failed to load gram panchayats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load blocks data on mount and when district changes
  useEffect(() => {
    fetchBlocksData(districtFilter !== 'all' ? districtFilter : undefined);
  }, [districtFilter]);

  // Load gram panchayats from API
  useEffect(() => {
    loadGramPanchayats();
  }, [currentPage, districtFilter, blockFilter, debouncedSearchTerm]);

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

  // Convert API gram panchayats to display format
  const gramPanchayatDisplayData: GramPanchayatDisplayData[] = useMemo(() => {
    if (!gramPanchayatsList || !Array.isArray(gramPanchayatsList)) {
      console.warn('gramPanchayatsList is not valid:', gramPanchayatsList);
      return [];
    }
    
    return gramPanchayatsList.map(gp => {
      // Log the gram panchayat for debugging
      console.log('Processing gram panchayat:', gp);
      
      return {
        id: gp.id,
        name: gp.name,
        district: gp.district,
        block: gp.block || (gp.blocks && gp.blocks.length > 0 ? gp.blocks[0] : ''), // Use single block property if available
        blocks: gp.blocks,
        totalChildren: gp.totalChildren || 0,
        enrolled: gp.enrolledChildren || 0,
        dropout: gp.dropoutChildren || 0,
        neverEnrolled: gp.neverEnrolledChildren || 0,
        totalParas: gp.totalParas || 0,
        assignedBalMitra: gp.assignedBalMitra || ''
      };
    });
  }, [gramPanchayatsList]);

  // Get districts from gram panchayat data
  const districts = useMemo(() => {
    return [...new Set(gramPanchayatDisplayData.map(gp => gp.district))];
  }, [gramPanchayatDisplayData]);

  // Use data directly from API response since filtering is done server-side
  const filteredData = useMemo(() => {
    return gramPanchayatDisplayData;
  }, [gramPanchayatDisplayData]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'district') {
      setDistrictFilter(value);
      // Reset block filter when district changes
      setBlockFilter('all');
    } else if (filterId === 'block') {
      setBlockFilter(value);
    }
    setCurrentPage(1);
  };

  const handleDeleteVillage = async (gramPanchayatId: string) => {
    const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gramPanchayatId);

    toast({
      title: "Deleting...",
      description: "Please wait while we delete the Gram Panchayat",
    });

    try {
      const response = await apiClient.deletePara(gramPanchayatId); // Still using the same delete endpoint
      if (response.success) {
        toast({
          title: "Success",
          description: "Gram Panchayat deleted successfully",
        });
        await loadGramPanchayats(); // Reload the data
      }
    } catch (error) {
      console.error('Error deleting gram panchayat:', error);
      toast({
        title: "Error",
        description: "Failed to delete gram panchayat",
        variant: "destructive",
      });
    }
  };

  const filterOptions = useMemo(() => {
    console.log('Creating filter options with available blocks:', availableBlocks);
    return [
      // District filter hidden since there's only one district (Dantewada)
      // {
      //   label: 'District',
      //   value: districtFilter,
      //   options: [
      //     { label: 'All Districts', value: 'all' },
      //     ...districts.map(district => ({ label: district, value: district }))
      //   ]
      // },
      {
        label: 'Block',
        value: blockFilter,
        options: [
          { label: 'All Blocks', value: 'all' },
          ...(availableBlocks || []).map(block => ({ label: block, value: block }))
        ]
      }
    ];
  }, [availableBlocks, blockFilter]);

  // Load blocks data on initial mount
  useEffect(() => {
    console.log('Initial effect running - fetching blocks data');
    fetchBlocksData();
  }, []);

  if (loading && gramPanchayatsList.length === 0) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading gram panchayats...</p>
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
            <h1 className="text-3xl font-bold text-foreground">Gram Panchayats</h1>
            
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
              Showing {filteredData.length} of {totalCount} gram panchayats
            </div>

            {/* Villages Card List */}
            <VillagesCardList
              villages={filteredData as any}
              onVillageClick={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onVillageClick(gramPanchayat);
              }}
              onEditVillage={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onEditVillage(gramPanchayat);
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
              districtFilter={districtFilter}
              blockFilter={blockFilter}
              districts={districts}
              blocks={availableBlocks}
              onDistrictFilterChange={setDistrictFilter}
              onBlockFilterChange={setBlockFilter}
            />

            <div className="text-muted-foreground text-xs">
              Showing {filteredData.length} of {totalCount} gram panchayats
            </div>

            <VillagesTable
              villages={filteredData as any}
              onVillageClick={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onVillageClick(gramPanchayat);
              }}
              onEditVillage={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onEditVillage(gramPanchayat);
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