
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

interface LocationFilters {
  block: string;
  cluster: string;
  panchayat: string;
}

interface VillagesFiltersProps {
  locationFilters: LocationFilters;
  onLocationFilterChange: (key: keyof LocationFilters, value: string) => void;
}

const VillagesFilters = ({ locationFilters, onLocationFilterChange }: VillagesFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>
      
      <Select value={locationFilters.block} onValueChange={(value) => onLocationFilterChange('block', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          <SelectItem value="Block A">Block A</SelectItem>
          <SelectItem value="Block B">Block B</SelectItem>
        </SelectContent>
      </Select>

      <Select value={locationFilters.cluster} onValueChange={(value) => onLocationFilterChange('cluster', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Clusters</SelectItem>
          <SelectItem value="Cluster 1">Cluster 1</SelectItem>
          <SelectItem value="Cluster 2">Cluster 2</SelectItem>
        </SelectContent>
      </Select>

      <Select value={locationFilters.panchayat} onValueChange={(value) => onLocationFilterChange('panchayat', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Panchayats</SelectItem>
          <SelectItem value="Panchayat 1">Panchayat 1</SelectItem>
          <SelectItem value="Panchayat 2">Panchayat 2</SelectItem>
          <SelectItem value="Panchayat 3">Panchayat 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VillagesFilters;
