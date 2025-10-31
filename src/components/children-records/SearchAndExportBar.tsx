import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from 'lucide-react';
import CSVExportModal from '@/components/ui/CSVExportModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      
      <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
        <Button
          variant="outline"
          className={`gap-2 bg-white ${isMobile ? 'flex-1' : ''}`}
          onClick={() => setIsModalOpen(true)}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <CSVExportModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExportCurrentPage={handleExportCurrentPage}
        onExportAllData={handleExportAllData}
      />
    </div>
  );
};

export default SearchAndExportBar;
