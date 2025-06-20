
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Plus, Upload, Search, Filter } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  const handleDeleteVillage = (villageId: string, villageName: string) => {
    onDeleteVillage(villageId);
  };

  const filteredVillages = React.useMemo(() => {
    return villagesData.filter(village => {
      const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           village.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           village.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           village.panchayat.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilters = (filters.block === 'all' || village.block === filters.block) &&
                            (filters.cluster === 'all' || village.cluster === filters.cluster) &&
                            (filters.panchayat === 'all' || village.panchayat === filters.panchayat);
      
      return matchesSearch && matchesFilters;
    });
  }, [searchTerm, filters, villagesData]);

  // Paginated data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVillages.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVillages, currentPage]);

  const totalPages = Math.ceil(filteredVillages.length / itemsPerPage);

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground">Villages</h1>

        {/* Search Bar and CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search villages, block, cluster, or panchayat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddVillage} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Village
            </Button>
            <Button onClick={onBulkUpload} variant="outline" className="gap-2 bg-white">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
          </div>

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

        {/* Results Summary */}
        <div className="text-muted-foreground">
          Showing {paginatedData.length} of {filteredVillages.length} villages
        </div>

        {/* Data Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                  {paginatedData.map((village, index) => (
                    <TableRow 
                      key={village.id} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/30" : ""}`}
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
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditVillage(village.id);
                            }}
                            className="h-8 w-8 p-0 text-primary hover:text-primary-foreground hover:bg-primary"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Village</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {village.name}? This action cannot be undone and will remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteVillage(village.id, village.name)} className="bg-destructive text-destructive-foreground">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}

        {filteredVillages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No villages found matching the current search and filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Villages;
