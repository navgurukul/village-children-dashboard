
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

interface VillagesFiltersProps {
  blockFilter: string;
  gramPanchayatFilter: string;
  blocks: string[];
  gramPanchayats: string[];
  onBlockFilterChange: (value: string) => void;
  onGramPanchayatFilterChange: (value: string) => void;
}

const VillagesFilters = ({ 
  blockFilter, 
  gramPanchayatFilter, 
  blocks, 
  gramPanchayats, 
  onBlockFilterChange, 
  onGramPanchayatFilterChange 
}: VillagesFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>
      
      <Select value={blockFilter} onValueChange={onBlockFilterChange}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          {blocks.map(block => (
            <SelectItem key={block} value={block}>{block}</SelectItem>
          ))}
        </SelectContent>
      </Select>

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
