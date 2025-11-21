import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Upload, Download } from 'lucide-react';
import CSVExportModal from '@/components/ui/CSVExportModal';
import { ExportFilters } from '@/utils/exportDeduplication';

interface GramPanchayatSearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddGramPanchayat: () => void;
  onBulkUpload: () => void;
  onExportCSV: (type: 'current' | 'all') => void;
  currentPageCount?: number;
  totalCount?: number;
  isMobile?: boolean;
  currentFilters?: ExportFilters; 
}

const GramPanchayatSearchAndActions = ({ 
  searchTerm, 
  onSearchChange, 
  onAddGramPanchayat, 
  onBulkUpload,
  onExportCSV,
  currentPageCount,
  totalCount,
  isMobile = false,
  currentFilters = {}
}: GramPanchayatSearchAndActionsProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExportCurrentPage = () => {
    onExportCSV('current');
  };

  const handleExportAllData = async () => {
    await onExportCSV('all');
  };

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
        <Button
          variant="outline"
          className={`gap-2 bg-white ${isMobile ? 'flex-1' : ''}`}
          onClick={() => setIsExportModalOpen(true)}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <CSVExportModal
        open={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportCurrentPage={handleExportCurrentPage}
        onExportAllData={handleExportAllData}
        currentPageCount={currentPageCount}
        totalCount={totalCount}
        jobType="gram-panchayat-export"
        currentFilters={currentFilters}
      />
    </div>
  );
};

export default GramPanchayatSearchAndActions;