
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Upload } from 'lucide-react';

interface VillagesSearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddVillage: () => void;
  onBulkUpload: () => void;
  isMobile?: boolean;
}

const VillagesSearchAndActions = ({ 
  searchTerm, 
  onSearchChange, 
  onAddVillage, 
  onBulkUpload,
  isMobile = false 
}: VillagesSearchAndActionsProps) => {
  return (
    <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between gap-4'}`}>
      <div className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md'}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search villages..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
      
      <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
        <Button 
          onClick={onAddVillage} 
          className={`gap-2 ${isMobile ? 'flex-1' : ''}`}
        >
          <Plus className="h-4 w-4" />
          Add New Village
        </Button>
        <Button 
          onClick={onBulkUpload} 
          variant="outline" 
          className={`gap-2 bg-white ${isMobile ? 'flex-1' : ''}`}
        >
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </div>
    </div>
  );
};

export default VillagesSearchAndActions;
