
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, Upload, Search, ArrowUpDown } from 'lucide-react';

interface VillagesProps {
  onAddVillage: () => void;
  onBulkUpload: () => void;
  onVillageClick: (villageId: string) => void;
  onEditVillage: (villageId: string) => void;
  onDeleteVillage: (villageId: string) => void;
}

const Villages = ({ onAddVillage, onBulkUpload, onVillageClick, onEditVillage, onDeleteVillage }: VillagesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    block: 'all',
    cluster: 'all',
    panchayat: 'all'
  });
  const [sortConfig, setSortConfig] = useState<{
    field: 'enrolled' | 'dropout' | null;
    direction: 'asc' | 'desc';
  }>({ field: null, direction: 'asc' });

  // Mock data
  const villagesData = [
    {
      id: '1',
      name: 'Haripur',
      block: 'Rajgangpur',
      cluster: 'Cluster 1',
      panchayat: 'Panchayat 1',
      totalChildren: 245,
      enrolled: 189,
      dropout: 42,
      assignedBalMitra: 'Ravi Kumar',
      lastSurveyDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Rampur',
      block: 'Block 1',
      cluster: 'Cluster 2',
      panchayat: 'Panchayat 2',
      totalChildren: 198,
      enrolled: 156,
      dropout: 28,
      assignedBalMitra: 'Sunita Devi',
      lastSurveyDate: '2024-01-12'
    },
    {
      id: '3',
      name: 'Lakshmipur',
      block: 'Rajgangpur',
      cluster: 'Cluster 1',
      panchayat: 'Panchayat 1',
      totalChildren: 167,
      enrolled: 134,
      dropout: 23,
      assignedBalMitra: 'Amit Singh',
      lastSurveyDate: '2024-01-10'
    },
    {
      id: '4',
      name: 'Govindpur',
      block: 'Block 2',
      cluster: 'Cluster 3',
      panchayat: 'Panchayat 3',
      totalChildren: 203,
      enrolled: 178,
      dropout: 19,
      assignedBalMitra: 'Priya Sharma',
      lastSurveyDate: '2024-01-08'
    },
    {
      id: '5',
      name: 'Shantipur',
      block: 'Block 1',
      cluster: 'Cluster 2',
      panchayat: 'Panchayat 2',
      totalChildren: 156,
      enrolled: 142,
      dropout: 11,
      assignedBalMitra: 'Rajesh Patel',
      lastSurveyDate: '2024-01-14'
    }
  ];

  const handleSort = (field: 'enrolled' | 'dropout') => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDeleteVillage = (villageId: string, villageName: string) => {
    if (window.confirm(`Are you sure you want to delete ${villageName}? This action cannot be undone.`)) {
      onDeleteVillage(villageId);
    }
  };

  const filteredAndSortedVillages = React.useMemo(() => {
    let filtered = villagesData.filter(village => {
      const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           village.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           village.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           village.panchayat.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = (filters.block === 'all' || village.block === filters.block) &&
                            (filters.cluster === 'all' || village.cluster === filters.cluster) &&
                            (filters.panchayat === 'all' || village.panchayat === filters.panchayat);
      
      return matchesSearch && matchesFilters;
    });

    if (sortConfig.field) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.field!];
        const bValue = b[sortConfig.field!];
        
        if (sortConfig.direction === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    return filtered;
  }, [searchTerm, filters, sortConfig, villagesData]);

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground">Villages</h1>

        {/* Search Bar and CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search villages, block, cluster, or panchayat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onBulkUpload} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button onClick={onAddVillage} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Village
            </Button>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-bold">Block</label>
            <Select value={filters.block} onValueChange={(value) => setFilters(prev => ({ ...prev, block: value, cluster: 'all', panchayat: 'all' }))}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="All Blocks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="Block 1">Block 1</SelectItem>
                <SelectItem value="Block 2">Block 2</SelectItem>
                <SelectItem value="Rajgangpur">Rajgangpur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Cluster</label>
            <Select value={filters.cluster} onValueChange={(value) => setFilters(prev => ({ ...prev, cluster: value, panchayat: 'all' }))}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="All Clusters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clusters</SelectItem>
                <SelectItem value="Cluster 1">Cluster 1</SelectItem>
                <SelectItem value="Cluster 2">Cluster 2</SelectItem>
                <SelectItem value="Cluster 3">Cluster 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Panchayat</label>
            <Select value={filters.panchayat} onValueChange={(value) => setFilters(prev => ({ ...prev, panchayat: value }))}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="All Panchayats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Panchayats</SelectItem>
                <SelectItem value="Panchayat 1">Panchayat 1</SelectItem>
                <SelectItem value="Panchayat 2">Panchayat 2</SelectItem>
                <SelectItem value="Panchayat 3">Panchayat 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Sort by Enrolled</label>
            <Button
              variant="outline"
              onClick={() => handleSort('enrolled')}
              className="gap-2 bg-white"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortConfig.field === 'enrolled' ? (sortConfig.direction === 'asc' ? 'Low to High' : 'High to Low') : 'Sort'}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold">Sort by Dropout</label>
            <Button
              variant="outline"
              onClick={() => handleSort('dropout')}
              className="gap-2 bg-white"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortConfig.field === 'dropout' ? (sortConfig.direction === 'asc' ? 'Low to High' : 'High to Low') : 'Sort'}
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="border rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Village Name</TableHead>
                <TableHead className="font-bold">Block</TableHead>
                <TableHead className="font-bold">Cluster</TableHead>
                <TableHead className="font-bold">Panchayat</TableHead>
                <TableHead className="font-bold">Total Children</TableHead>
                <TableHead className="font-bold">Enrolled Children</TableHead>
                <TableHead className="font-bold">Dropout Children</TableHead>
                <TableHead className="font-bold">Assigned Bal Mitra</TableHead>
                <TableHead className="font-bold">Last Survey Date</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedVillages.map((village) => (
                <TableRow 
                  key={village.id} 
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => onVillageClick(village.id)}
                >
                  <TableCell className="font-medium">{village.name}</TableCell>
                  <TableCell>{village.block}</TableCell>
                  <TableCell>{village.cluster}</TableCell>
                  <TableCell>{village.panchayat}</TableCell>
                  <TableCell>{village.totalChildren}</TableCell>
                  <TableCell>{village.enrolled}</TableCell>
                  <TableCell>{village.dropout}</TableCell>
                  <TableCell>{village.assignedBalMitra}</TableCell>
                  <TableCell>{new Date(village.lastSurveyDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditVillage(village.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVillage(village.id, village.name);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedVillages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No villages found matching the current search and filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Villages;
