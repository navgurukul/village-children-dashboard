
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
  options: { label: string; value: string }[];
}

interface FilterChipsProps {
  filters: FilterOption[];
  onFilterChange: (filterId: string, value: string) => void;
}

const FilterChips = ({ filters, onFilterChange }: FilterChipsProps) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const getDisplayValue = (filter: FilterOption) => {
    if (filter.value === 'all') return `All ${filter.label}s`;
    const option = filter.options.find(opt => opt.value === filter.value);
    return option?.label || filter.label;
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Sheet 
            key={filter.label} 
            open={activeSheet === filter.label} 
            onOpenChange={(open) => setActiveSheet(open ? filter.label : null)}
          >
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-shrink-0 gap-1 bg-white"
              >
                {getDisplayValue(filter)}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <SheetHeader>
                <SheetTitle>Select {filter.label}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 mt-4">
                {filter.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={filter.value === option.value ? "default" : "ghost"}
                    className="justify-start h-12"
                    onClick={() => {
                      onFilterChange(filter.label.toLowerCase(), option.value);
                      setActiveSheet(null);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
