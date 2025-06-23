
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface VillagesHeaderProps {
  onAddVillage: () => void;
  onBulkUpload: () => void;
}

const VillagesHeader = ({ onAddVillage, onBulkUpload }: VillagesHeaderProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Villages</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-foreground">Villages</h1>
    </div>
  );
};

export default VillagesHeader;
