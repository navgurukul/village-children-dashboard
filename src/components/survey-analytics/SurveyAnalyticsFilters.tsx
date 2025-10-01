import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarIcon, Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface SurveyAnalyticsFiltersProps {
  filters: {
    dateRange: { from?: Date; to?: Date };
    block: string;
    gramPanchayat: string;
  };
  onFiltersChange: (filters: any) => void;
  blocksData: any[];
}

const SurveyAnalyticsFilters = ({ filters, onFiltersChange, blocksData }: SurveyAnalyticsFiltersProps) => {
  const blocks = blocksData.map(block => block.block);
  const selectedBlockData = blocksData.find(block => block.block === filters.block);
  const gramPanchayats = selectedBlockData ? selectedBlockData.gramPanchayat.map((gp: any) => gp.name) : [];

  const handleBlockChange = (value: string) => {
    onFiltersChange({
      ...filters,
      block: value,
      gramPanchayat: 'all' // Reset gram panchayat when block changes
    });
  };

  const handleGramPanchayatChange = (value: string) => {
    onFiltersChange({
      ...filters,
      gramPanchayat: value
    });
  };

  const handleDateRangeChange = (type: 'from' | 'to', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: date
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>
      
      {/* Date Range From */}
      <div className="flex-none">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal bg-white",
                !filters.dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                <div className="flex items-center justify-between w-full">
                  <span>{format(filters.dateRange.from, "PP")}</span>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="ml-2 p-0.5 rounded hover:bg-muted focus:bg-muted"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDateRangeChange('from', undefined);
                    }}
                  >
                    <X className="h-4 w-4 opacity-70 hover:opacity-100" />
                  </button>
                </div>
              ) : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filters.dateRange.from}
              onSelect={(date) => handleDateRangeChange('from', date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Date Range To */}
      <div className="flex-none">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal bg-white",
                !filters.dateRange.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.to ? (
                <div className="flex items-center justify-between w-full">
                  <span>{format(filters.dateRange.to, "PP")}</span>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="ml-2 p-0.5 rounded hover:bg-muted focus:bg-muted"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDateRangeChange('to', undefined);
                    }}
                  >
                    <X className="h-4 w-4 opacity-70 hover:opacity-100" />
                  </button>
                </div>
              ) : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filters.dateRange.to}
              onSelect={(date) => handleDateRangeChange('to', date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Block Filter */}
      <div className="flex-none">
        <Select value={filters.block} onValueChange={handleBlockChange}>
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Block" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Blocks</SelectItem>
            {blocks.map(block => (
              <SelectItem key={block} value={block}>{block}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gram Panchayat Filter */}
      <div className="flex-none">
        <Select value={filters.gramPanchayat} onValueChange={handleGramPanchayatChange} disabled={filters.block === 'all'}>
          <SelectTrigger className="w-[150px] bg-white" disabled={filters.block === 'all'}>
            <SelectValue placeholder="Gram Panchayat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gram Panchayats</SelectItem>
            {gramPanchayats.map(gp => (
              <SelectItem key={gp} value={gp}>{gp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SurveyAnalyticsFilters;