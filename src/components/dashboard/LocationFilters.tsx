
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
}

const LocationFilters = ({ filters, onFiltersChange }: LocationFiltersProps) => {
  const updateFilter = (key: keyof LocationFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

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
          <SelectItem value="block1">Block 1</SelectItem>
          <SelectItem value="rajgangpur">Rajgangpur</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.gramPanchayat} onValueChange={(value) => updateFilter('gramPanchayat', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="All Gram Panchayats" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Gram Panchayats</SelectItem>
          <SelectItem value="panchayat1">Gram Panchayat 1</SelectItem>
          <SelectItem value="panchayat2">Gram Panchayat 2</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.village} onValueChange={(value) => updateFilter('village', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="All Villages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Villages</SelectItem>
          <SelectItem value="village1">Village 1</SelectItem>
          <SelectItem value="village2">Village 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilters;
