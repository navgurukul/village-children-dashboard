
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

interface VillagesFiltersProps {
  districtFilter: string;
  gramPanchayatFilter: string;
  districts: string[];
  gramPanchayats: string[];
  onDistrictFilterChange: (value: string) => void;
  onGramPanchayatFilterChange: (value: string) => void;
}

const VillagesFilters = ({ 
  districtFilter, 
  gramPanchayatFilter, 
  districts, 
  gramPanchayats, 
  onDistrictFilterChange, 
  onGramPanchayatFilterChange 
}: VillagesFiltersProps) => {
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

      <Select value={gramPanchayatFilter} onValueChange={onGramPanchayatFilterChange}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Gram Panchayats</SelectItem>
          {gramPanchayats.map(gp => (
            <SelectItem key={gp} value={gp}>{gp}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VillagesFilters;
