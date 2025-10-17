import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

interface GramPanchayatFiltersProps {
  districtFilter: string;
  blockFilter: string;
  districts: string[];
  blocks: string[];
  onDistrictFilterChange: (value: string) => void;
  onBlockFilterChange: (value: string) => void;
}

const GramPanchayatFilters = ({ 
  districtFilter, 
  blockFilter, 
  districts, 
  blocks, 
  onDistrictFilterChange, 
  onBlockFilterChange 
}: GramPanchayatFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>
      
      {/* District filter hidden since there's only one district (Dantewada) */}
      {/* <Select value={districtFilter} onValueChange={onDistrictFilterChange}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Districts</SelectItem>
          {districts.map(district => (
            <SelectItem key={district} value={district}>{district}</SelectItem>
          ))}
        </SelectContent>
      </Select> */}

      <Select value={blockFilter} onValueChange={onBlockFilterChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          {blocks && blocks.map(block => (
            <SelectItem key={block} value={block}>{block}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GramPanchayatFilters;
