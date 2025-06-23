
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from 'lucide-react';

interface VillagesHeaderProps {
  onAddVillage: () => void;
  onBulkUpload: () => void;
}

const VillagesHeader = ({ onAddVillage, onBulkUpload }: VillagesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-foreground">Villages</h1>
      <div className="flex gap-2">
        <Button className="gap-2" onClick={onAddVillage}>
          <Plus className="h-4 w-4" />
          Add New Village
        </Button>
        <Button variant="outline" className="gap-2 bg-white" onClick={onBulkUpload}>
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </div>
    </div>
  );
};

export default VillagesHeader;
