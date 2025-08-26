import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import VillagesHeader from '../components/villages/VillagesHeader';
import VillagesSearchAndActions from '../components/villages/VillagesSearchAndActions';
import VillagesFilters from '../components/villages/VillagesFilters';
import FilterChips from '../components/FilterChips';
import VillagesTable from '../components/villages/VillagesTable';
import VillagesCardList from '../components/villages/VillagesCardList';
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient, Village as ApiVillage, GramPanchayatResponse } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface VillageDisplayData {
  id: string;
  name: string;
  district: string;
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
  onVillageClick: (villageData: any) => void;
  onEditVillage: (village: any) => void;
  onDeleteVillage: (villageId: string) => void;
}

const Villages = ({ onAddVillage, onBulkUpload, onVillageClick, onEditVillage, onDeleteVillage }: VillagesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [gramPanchayatFilter, setGramPanchayatFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [villages, setVillages] = useState<ApiVillage[]>([]);
  const [gramPanchayatData, setGramPanchayatData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Fetch gram panchayat data from API
  const fetchGramPanchayatData = async (district?: string) => {
    try {
      console.log('Fetching gramPanchayat data for district:', district);
      const response = await apiClient.getDistrictGramPanchayats(district);
      console.log('GramPanchayat API response:', response);
      
      if (response.success && response.data && response.data.gramPanchayats) {
        setGramPanchayatData(response.data.gramPanchayats);
      } else {
        console.warn('Unexpected gramPanchayat API response structure:', response);
        setGramPanchayatData([]);
      }
    } catch (error) {
      console.error('Error fetching gramPanchayat data:', error);
      setGramPanchayatData([]);
    }
  };

  // Load gram panchayat data on mount and when district changes
  useEffect(() => {
    fetchGramPanchayatData(districtFilter !== 'all' ? districtFilter : undefined);
  }, [districtFilter]);

  // Load villages from API
  useEffect(() => {
    loadVillages();
  }, [currentPage, districtFilter, gramPanchayatFilter]);

  const loadVillages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVillages({
        page: currentPage,
        limit: itemsPerPage,
        district: districtFilter !== 'all' ? districtFilter : undefined, // Use filter instead of hardcoded value
        gramPanchayat: gramPanchayatFilter !== 'all' ? gramPanchayatFilter : undefined
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
      district: village.district,
      gramPanchayat: village.gramPanchayat,
      totalChildren: (village as any)['Total Children'] || 0,
      enrolled: (village as any)['Enrolled'] || 0,
      dropout: (village as any)['Dropout'] || 0,
      neverEnrolled: (village as any)['Never Enrolled'] || 0,
      assignedBalMitra: (village as any).balMitraName || 'Not Assigned'
    }));
  }, [villages]);

  // Get districts from village data (as they won't be in the API response)
  const districts = useMemo(() => {
    return [...new Set(villageDisplayData.map(village => village.district))];
  }, [villageDisplayData]);

  // Get gram panchayats from API data
  const gramPanchayats = useMemo(() => {
    // Use API data if available
    if (Array.isArray(gramPanchayatData) && gramPanchayatData.length > 0) {
      return gramPanchayatData;
    }
    
    // Fallback to village data if API data is not available
    if (districtFilter === 'all') {
      return [...new Set(villageDisplayData.map(village => village.gramPanchayat))];
    } else {
      return [...new Set(villageDisplayData
        .filter(village => village.district === districtFilter)
        .map(village => village.gramPanchayat))];
    }
  }, [gramPanchayatData, districtFilter, villageDisplayData]);

  // Filter data
  const filteredData = useMemo(() => {
    return villageDisplayData.filter(village => {
      const matchesSearch = searchTerm === '' || 
        village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.gramPanchayat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        village.assignedBalMitra.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict = districtFilter === 'all' || village.district === districtFilter;
      const matchesGramPanchayat = gramPanchayatFilter === 'all' || village.gramPanchayat === gramPanchayatFilter;

      return matchesSearch && matchesDistrict && matchesGramPanchayat;
    });
  }, [villageDisplayData, searchTerm, districtFilter, gramPanchayatFilter]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'district') {
      setDistrictFilter(value);
      // Reset gram panchayat when district changes
      setGramPanchayatFilter('all');
    } else if (filterId === 'gram panchayat') {
      setGramPanchayatFilter(value);
    }
    setCurrentPage(1);
  };

  const handleDeleteVillage = async (villageId: string) => {
    const village = villages.find(v => v.id === villageId);

    toast({
      title: "Deleting...",
      description: "Please wait while we delete the village",
    });

    try {
      const response = await apiClient.deleteVillage(villageId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Village deleted successfully",
        });
        await loadVillages(); // Reload the data
      }
    } catch (error) {
      console.error('Error deleting village:', error);
      toast({
        title: "Error",
        description: "Failed to delete village",
        variant: "destructive",
      });
    }
  };

  const filterOptions = [
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
              onVillageClick={(villageId) => {
                const village = villages.find(v => v.id === villageId);
                if (village) onVillageClick(village);
              }}
              onEditVillage={(villageId) => {
                const village = villages.find(v => v.id === villageId);
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
              districtFilter={districtFilter}
              gramPanchayatFilter={gramPanchayatFilter}
              districts={districts}
              gramPanchayats={gramPanchayats}
              onDistrictFilterChange={setDistrictFilter}
              onGramPanchayatFilterChange={setGramPanchayatFilter}
            />

            <div className="text-muted-foreground text-xs">
              Showing {filteredData.length} of {totalCount} villages
            </div>

            <VillagesTable
              villages={filteredData}
              onVillageClick={(villageId) => {
                const village = villages.find(v => v.id === villageId);
                if (village) onVillageClick(village);
              }}
              onEditVillage={(villageId) => {
                const village = villages.find(v => v.id === villageId);
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