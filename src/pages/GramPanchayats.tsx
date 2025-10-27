import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import GramPanchayatHeader from '../components/gramPanchayats/GramPanchayatsHeader';
import GramPanchayatSearchAndActions from '../components/gramPanchayats/GramPanchayatsSearchAndActions';
import GramPanchayatFilters from '../components/gramPanchayats/GramPanchayatsFilters';
import FilterChips from '../components/FilterChips';
import GramPanchayatTable from '../components/gramPanchayats/GramPanchayatsTable';
import GramPanchayatCardList from '../components/gramPanchayats/GramPanchayatsCardList';
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient, GramPanchayat as ApiGramPanchayat, GramPanchayatResponse } from '../lib/api';
import mixpanel from '../lib/mixpanel';
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

interface GramPanchayatsProps {
  onAddGramPanchayat: () => void;
  onBulkUpload: () => void;
  onGramPanchayatClick: (gramPanchayatData: any) => void;
  onEditGramPanchayat: (gramPanchayat: any) => void;
  onDeleteGramPanchayat: (gramPanchayatId: string) => void;
}

const GramPanchayats = ({ onAddGramPanchayat, onBulkUpload, onGramPanchayatClick, onEditGramPanchayat, onDeleteGramPanchayat }: GramPanchayatsProps) => {
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
      const response = await apiClient.getDistrictGramPanchayats(district);

      if (response.success && response.data) {
        // Check if the response is an array
        if (Array.isArray(response.data)) {
          // Extract block names from the array of objects
          const blocks: string[] = response.data.map(item => item.block);
          setAvailableBlocks(blocks);
        } 
        // Handle the other response formats as before
        else if (response.data.blocks && response.data.blocks.length > 0) {
          setAvailableBlocks(response.data.blocks);
        } else if (response.data.blockGramPanchayats) {
          const blocks: string[] = response.data.blockGramPanchayats.map(item => item.block);
          setAvailableBlocks(blocks);
        } else {
          setAvailableBlocks([]);
        }
      } else {
        setAvailableBlocks([]);
      }
    } catch (error) {
      // On error, fallback to extracting blocks from already-loaded gram panchayat data
      const blocks = new Set<string>();
      gramPanchayatsList.forEach(gp => {
        if (gp.blocks && gp.blocks.length > 0) {
          gp.blocks.forEach(block => blocks.add(block));
        }
      });
      setAvailableBlocks(Array.from(blocks));
    }
  };

  // Load gram panchayats from API
  const loadGramPanchayats = async () => {
    try {
      setLoading(true);

      const response = await apiClient.getGramPanchayats({
        page: currentPage,
        limit: itemsPerPage,
        district: districtFilter !== 'all' ? districtFilter : undefined,
        block: blockFilter !== 'all' ? blockFilter : undefined,
        search: debouncedSearchTerm || undefined
      });
      
      if (response.success) {
        setGramPanchayatsList(response.data.items);
        setTotalCount(response.data.pagination.totalCount);
      } else {
        toast({
          title: "Error",
          description: "Failed to load gram panchayats",
          variant: "destructive",
        });
      }
    } catch (error) {
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
      return [];
    }
    
    return gramPanchayatsList.map(gp => {
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

  const handleDeleteGramPanchayat = async (gramPanchayatId: string) => {
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
    return [
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

  // CSV helpers
  const csvEscape = (v: any) => {
    if (v === null || v === undefined) return '""';
    const s = String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };

  const exportGramPanchayatsCSV = (rows: GramPanchayatDisplayData[], filename = 'gram_panchayats.csv') => {
    const headers = [
      'ID',
      'Gram Panchayat Name',
      'District',
      'Block',
      'Total Children',
      'Enrolled Children',
      'Dropout Children',
      'Never Enrolled Children',
      'Assigned Bal Mitra'
    ];

    const csv = [
      headers.join(','),
      ...rows.map(r =>
        [
          csvEscape(r.id),
          csvEscape(r.name),
          csvEscape(r.district),
          csvEscape(r.block || ''),
          csvEscape(r.totalChildren ?? 0),
          csvEscape(r.enrolled ?? 0),
          csvEscape(r.dropout ?? 0),
          csvEscape(r.neverEnrolled ?? 0),
          csvEscape(r.assignedBalMitra ?? 'Not Assigned')
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Unified export handler passed to child component
  const handleExportCSV = async (type: 'current' | 'all') => {
    if (type === 'current') {
      const fileName = `gram_panchayats_page_${new Date().toISOString().split('T')[0]}.csv`;
      exportGramPanchayatsCSV(filteredData, fileName);
      
      // Mixpanel track with enhanced user information
      mixpanel.track('Export CSV', {
        user_id: localStorage.getItem('user_id') || 'unknown',
        user_name: localStorage.getItem('user_name') || 'unknown',
        user_role: localStorage.getItem('user_role') || 'unknown',
        export_page: 'Gram Panchayats',
        filters_applied: {
          district: districtFilter,
          block: blockFilter,
          search: searchTerm
        },
        export_time: new Date().toISOString()
      });
      return;
    }

    // export all
    toast({ title: 'Exporting', description: 'Preparing full export. This may take a while.' });
    try {
      const all: any[] = [];
      const limit = 500;
      let page = 1;
      while (true) {
        const resp = await apiClient.getGramPanchayats({
          page,
          limit,
          district: districtFilter !== 'all' ? districtFilter : undefined,
          block: blockFilter !== 'all' ? blockFilter : undefined,
          search: debouncedSearchTerm || undefined
        });
        if (!resp || !resp.success) throw new Error('Failed to fetch');
        const items = resp.data.items || [];
        all.push(...items.map((gp: any) => ({
          id: gp.id,
          name: gp.name,
          district: gp.district,
          block: gp.block || (gp.blocks && gp.blocks.length ? gp.blocks[0] : ''),
          totalChildren: gp.totalChildren || 0,
          enrolled: gp.enrolledChildren || 0,
          dropout: gp.dropoutChildren || 0,
          neverEnrolled: gp.neverEnrolledChildren || 0,
          assignedBalMitra: gp.assignedBalMitra || ''
        })));
        if (items.length < limit) break;
        page += 1;
      }

      const fileName = `gram_panchayats_all_${new Date().toISOString().split('T')[0]}.csv`;
      exportGramPanchayatsCSV(all, fileName);
      toast({ title: 'Export ready', description: 'All Gram Panchayats exported.' });
      
      // Mixpanel track with enhanced user information
      mixpanel.track('Export CSV', {
        user_id: localStorage.getItem('user_id') || 'unknown',
        user_name: localStorage.getItem('user_name') || 'unknown',
        user_role: localStorage.getItem('user_role') || 'unknown',
        export_page: 'Gram Panchayats (All)',
        filters_applied: {
          district: districtFilter,
          block: blockFilter,
          search: searchTerm
        },
        export_time: new Date().toISOString()
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Export failed', description: 'Could not export all Gram Panchayats', variant: 'destructive' });
    }
  };

  // Load blocks data on initial mount
  useEffect(() => {
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
        {!isMobile && <GramPanchayatHeader />}
        
        {isMobile ? (
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Gram Panchayats</h1>
            
            {/* Search Bar - Full Width */}
            <GramPanchayatSearchAndActions
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               onAddGramPanchayat={onAddGramPanchayat}
               onBulkUpload={onBulkUpload}
               onExportCSV={handleExportCSV}
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

            {/* Gram Panchayats Card List (mobile) */}
            <GramPanchayatCardList
              gramPanchayats={filteredData as any}
              onGramPanchayatClick={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onGramPanchayatClick(gramPanchayat);
              }}
              onEditGramPanchayat={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onEditGramPanchayat(gramPanchayat);
              }}
              onDeleteGramPanchayat={handleDeleteGramPanchayat}
            />
          </div>
        ) : (
          <>
            <GramPanchayatSearchAndActions
               searchTerm={searchTerm}
               onSearchChange={setSearchTerm}
               onAddGramPanchayat={onAddGramPanchayat}
               onBulkUpload={onBulkUpload}
               onExportCSV={handleExportCSV}
             />

            <GramPanchayatFilters
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

            <GramPanchayatTable
              gramPanchayats={filteredData as any}
              onGramPanchayatClick={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onGramPanchayatClick(gramPanchayat);
              }}
              onEditGramPanchayat={(gpId) => {
                const gramPanchayat = gramPanchayatsList.find(gp => gp.id === gpId);
                if (gramPanchayat) onEditGramPanchayat(gramPanchayat);
              }}
              onDeleteGramPanchayat={handleDeleteGramPanchayat}
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

export default GramPanchayats;