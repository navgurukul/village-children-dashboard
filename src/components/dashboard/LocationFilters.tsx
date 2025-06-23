
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationFilters {
  block: string;
  panchayat: string;
  village: string;
}

interface LocationFiltersProps {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
}

const LocationFilters = ({ filters, onFiltersChange }: LocationFiltersProps) => {
  const isMobile = useIsMobile();

  const handleFilterChange = (key: keyof LocationFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  if (isMobile) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-fit">
          <Filter className="h-4 w-4" />
          <span className="font-medium text-sm whitespace-nowrap">Filters</span>
        </div>
        
        <div className="flex gap-2 min-w-fit">
          <Select value={filters.block} onValueChange={(value) => handleFilterChange('block', value)}>
            <SelectTrigger className="w-[120px] bg-white text-sm">
              <SelectValue placeholder="Block" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              <SelectItem value="Block A">Block A</SelectItem>
              <SelectItem value="Block B">Block B</SelectItem>
              <SelectItem value="Block C">Block C</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.panchayat} onValueChange={(value) => handleFilterChange('panchayat', value)}>
            <SelectTrigger className="w-[130px] bg-white text-sm">
              <SelectValue placeholder="Panchayat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Panchayats</SelectItem>
              <SelectItem value="Panchayat 1">Panchayat 1</SelectItem>
              <SelectItem value="Panchayat 2">Panchayat 2</SelectItem>
              <SelectItem value="Panchayat 3">Panchayat 3</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.village} onValueChange={(value) => handleFilterChange('village', value)}>
            <SelectTrigger className="w-[120px] bg-white text-sm">
              <SelectValue placeholder="Village" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Villages</SelectItem>
              <SelectItem value="Haripur">Haripur</SelectItem>
              <SelectItem value="Rampur">Rampur</SelectItem>
              <SelectItem value="Govindpur">Govindpur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>
      
      <Select value={filters.block} onValueChange={(value) => handleFilterChange('block', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blocks</SelectItem>
          <SelectItem value="Block A">Block A</SelectItem>
          <SelectItem value="Block B">Block B</SelectItem>
          <SelectItem value="Block C">Block C</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.panchayat} onValueChange={(value) => handleFilterChange('panchayat', value)}>
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

      <Select value={filters.village} onValueChange={(value) => handleFilterChange('village', value)}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Villages</SelectItem>
          <SelectItem value="Haripur">Haripur</SelectItem>
          <SelectItem value="Rampur">Rampur</SelectItem>
          <SelectItem value="Govindpur">Govindpur</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationFilters;
