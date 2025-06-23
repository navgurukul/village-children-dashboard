
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface VillagesSearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const VillagesSearchAndActions = ({ searchTerm, onSearchChange }: VillagesSearchAndActionsProps) => {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search villages or personnel..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-white"
      />
    </div>
  );
};

export default VillagesSearchAndActions;
