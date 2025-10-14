import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface SearchAndExportBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExportCSV: (type: 'current' | 'all') => void;
  isMobile?: boolean;
}

const SearchAndExportBar = ({ 
  searchTerm, 
  onSearchChange, 
  onExportCSV,
  isMobile = false 
}: SearchAndExportBarProps) => {
  return (
    <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between gap-4'}`}>
      <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md'}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, village, or block..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      
      <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`gap-2 bg-white ${isMobile ? 'flex-1' : ''}`}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExportCSV('current')}>
              <Download className="mr-2 h-4 w-4" />
              Export Current Page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExportCSV('all')}>
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchAndExportBar;
