import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Filter, Search, Plus, Upload, Edit, Trash2 } from 'lucide-react';

const Villages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilters, setLocationFilters] = useState({
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
      block: 'Block A',
      cluster: 'Cluster 1',
      panchayat: 'Panchayat 1',
      totalChildren: 245,
      enrolled: 189,
      dropout: 42,
      neverEnrolled: 14,
      assignedBalMitra: 'Ravi Kumar'
    },
    {
      id: '2',
      name: 'Rampur',
      block: 'Block A',
      cluster: 'Cluster 1',
      panchayat: 'Panchayat 2',
      totalChildren: 180,
      enrolled: 156,
      dropout: 18,
      neverEnrolled: 6,
      assignedBalMitra: 'Priya Singh'
    },
    {
      id: '3',
      name: 'Govindpur',
      block: 'Block B',
      cluster: 'Cluster 2',
      panchayat: 'Panchayat 3',
      totalChildren: 320,
      enrolled: 245,
      dropout: 55,
      neverEnrolled: 20,
      assignedBalMitra: 'Amit Sharma'
    }
  ];

  const filteredVillages = villagesData.filter(village => {
    const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         village.assignedBalMitra.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = locationFilters.block === 'all' || village.block === locationFilters.block;
    const matchesCluster = locationFilters.cluster === 'all' || village.cluster === locationFilters.cluster;
    const matchesPanchayat = locationFilters.panchayat === 'all' || village.panchayat === locationFilters.panchayat;
    
    return matchesSearch && matchesBlock && matchesCluster && matchesPanchayat;
  });

  const totalPages = Math.ceil(filteredVillages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVillages = filteredVillages.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteVillage = (villageId: string) => {
    console.log('Deleting village:', villageId);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Villages</h1>
          <div className="flex gap-2">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Village
            </Button>
            <Button variant="outline" className="gap-2 bg-white">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
            </div>
            
            <Select value={locationFilters.block} onValueChange={(value) => setLocationFilters(prev => ({ ...prev, block: value }))}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="Block A">Block A</SelectItem>
                <SelectItem value="Block B">Block B</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilters.cluster} onValueChange={(value) => setLocationFilters(prev => ({ ...prev, cluster: value }))}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clusters</SelectItem>
                <SelectItem value="Cluster 1">Cluster 1</SelectItem>
                <SelectItem value="Cluster 2">Cluster 2</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilters.panchayat} onValueChange={(value) => setLocationFilters(prev => ({ ...prev, panchayat: value }))}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Panchayats</SelectItem>
                <SelectItem value="Panchayat 1">Panchayat 1</SelectItem>
                <SelectItem value="Panchayat 2">Panchayat 2</SelectItem>
                <SelectItem value="Panchayat 3">Panchayat 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search villages or personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Villages Table */}
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
                    <TableHead className="font-bold">Assigned Personnel</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentVillages.map((village, index) => (
                    <TableRow 
                      key={village.id} 
                      className={`${index % 2 === 0 ? "bg-muted/30" : ""}`}
                    >
                      <TableCell className="font-medium">{village.name}</TableCell>
                      <TableCell>{village.block}</TableCell>
                      <TableCell>{village.cluster}</TableCell>
                      <TableCell>{village.panchayat}</TableCell>
                      <TableCell>{village.totalChildren}</TableCell>
                      <TableCell>
                        <Badge className="bg-success text-white">
                          {village.enrolled}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-destructive text-white">
                          {village.dropout}
                        </Badge>
                      </TableCell>
                      <TableCell>{village.assignedBalMitra}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 text-foreground" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the village "{village.name}" and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteVillage(village.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
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

        {/* Results Summary */}
        <div className="text-muted-foreground">
          Showing {currentVillages.length} of {filteredVillages.length} villages
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Villages;
