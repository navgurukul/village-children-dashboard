
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, FileText } from 'lucide-react';

interface SearchAndExportBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  isMobile?: boolean;
}

const SearchAndExportBar = ({ 
  searchTerm, 
  onSearchChange, 
  onExportCSV, 
  onExportPDF,
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
        <Button 
          onClick={onExportPDF} 
          className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
        >
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
        <Button 
          onClick={onExportCSV} 
          variant="outline" 
          className={`gap-2 bg-white ${isMobile ? 'flex-1' : ''}`}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default SearchAndExportBar;
