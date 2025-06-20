
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText } from 'lucide-react';

interface SearchAndExportBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

const SearchAndExportBar = ({ searchTerm, onSearchChange, onExportCSV, onExportPDF }: SearchAndExportBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, Aadhar number, village, or block..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onExportCSV} variant="outline" className="gap-2 bg-white">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button onClick={onExportPDF} className="gap-2">
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

export default SearchAndExportBar;
