import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Upload, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface GramPanchayatSearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddGramPanchayat: () => void;
  onBulkUpload: () => void;
  onExportCSV: (type: 'current' | 'all') => void; // will be called with 'current' or 'all'
  isMobile?: boolean;
}

const GramPanchayatSearchAndActions = ({ 
  searchTerm, 
  onSearchChange, 
  onAddGramPanchayat, 
  onBulkUpload,
  onExportCSV, // will be called with 'current' | 'all'
  isMobile = false 
}: GramPanchayatSearchAndActionsProps) => {
  return (
    <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between gap-4'}`}>
      <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md'}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Gram Panchayats..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      
      <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
        <Button 
          onClick={onAddGramPanchayat} 
          className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
        >
          <Plus className="h-4 w-4" />
          Add New Gram Panchayat
        </Button>
        <Button 
          onClick={onBulkUpload} 
          variant="outline" 
          className={`gap-2 bg-white ${isMobile ? 'flex-1' : ''}`}
        >
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
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

export default GramPanchayatSearchAndActions;