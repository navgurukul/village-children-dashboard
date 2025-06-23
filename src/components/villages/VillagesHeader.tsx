
import React from 'react';

interface VillagesHeaderProps {
  onAddVillage: () => void;
  onBulkUpload: () => void;
}

const VillagesHeader = ({ onAddVillage, onBulkUpload }: VillagesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-foreground">Villages</h1>
    </div>
  );
};

export default VillagesHeader;
