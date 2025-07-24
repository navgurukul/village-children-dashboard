
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

interface LocationFilters {
  block: string;
  gramPanchayat: string;
  village: string;
}

interface LocationFiltersProps {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
  blocksData: any[];
}

const LocationFilters = ({ filters, onFiltersChange, blocksData }: LocationFiltersProps) => {
  const updateFilter = (key: keyof LocationFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset dependent filters when parent changes
    if (key === 'block') {
      newFilters.gramPanchayat = 'all';
      newFilters.village = 'all';
    } else if (key === 'gramPanchayat') {
      newFilters.village = 'all';
    }
    
    onFiltersChange(newFilters);
  };

  // Get blocks from API data
  const blocks = blocksData.map(block => block.block);
  
  // Get gram panchayats for selected block
  const selectedBlockData = blocksData.find(block => block.block === filters.block);
  const gramPanchayats = selectedBlockData ? selectedBlockData.gramPanchayat.map((gp: any) => gp.name) : [];
  
  // Get villages for selected gram panchayat
  const selectedGramPanchayat = selectedBlockData?.gramPanchayat.find((gp: any) => gp.name === filters.gramPanchayat);
  const villages = selectedGramPanchayat?.villages || [];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>
      
      <Select value={filters.block} onValueChange={(value) => updateFilter('block', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="All Blocks" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          {blocks.map(block => (
            <SelectItem key={block} value={block}>{block}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.gramPanchayat} 
        onValueChange={(value) => updateFilter('gramPanchayat', value)}
        disabled={filters.block === 'all'}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="All Gram Panchayats" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Gram Panchayats</SelectItem>
          {gramPanchayats.map(gp => (
            <SelectItem key={gp} value={gp}>{gp}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={filters.village} 
        onValueChange={(value) => updateFilter('village', value)}
        disabled={filters.gramPanchayat === 'all'}
      >
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="All Villages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Villages</SelectItem>
          {villages.map(village => (
            <SelectItem key={village} value={village}>{village}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilters;
