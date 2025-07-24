
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

interface FiltersRowProps {
  blockFilter: string;
  statusFilter: string;
  blocks: string[];
  onBlockFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const FiltersRow = ({ 
  blockFilter, 
  statusFilter, 
  blocks, 
  onBlockFilterChange, 
  onStatusFilterChange 
}: FiltersRowProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>
      
      <Select value={blockFilter} onValueChange={onBlockFilterChange}>
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

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="enrolled">Enrolled</SelectItem>
          <SelectItem value="dropout">Dropout</SelectItem>
          <SelectItem value="never_enrolled">Never Enrolled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FiltersRow;
