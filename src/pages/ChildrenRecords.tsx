
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Download, FileText, Edit, Trash2, Filter } from 'lucide-react';
import { mockStudentData } from '../data/mockData';

interface ChildrenRecordsProps {
  onChildClick: (childId: string) => void;
  onEditChild?: (childId: string) => void;
}

const ChildrenRecords = ({ onChildClick, onEditChild }: ChildrenRecordsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Get unique blocks for filter
  const blocks = useMemo(() => {
    return [...new Set(mockStudentData.map(student => student.block))];
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return mockStudentData.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.block.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBlock = blockFilter === 'all' || student.block === blockFilter;
      const matchesStatus = statusFilter === 'all' || student.schoolStatus === statusFilter;

      return matchesSearch && matchesBlock && matchesStatus;
    });
  }, [searchTerm, blockFilter, statusFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return <Badge className="status-enrolled">{status}</Badge>;
      case 'Dropout':
        // Mock dropout period calculation
        const dropoutPeriod = Math.floor(Math.random() * 18) + 1;
        const displayText = dropoutPeriod > 12 ? 'Dropout > 1 year' : `Dropout for ${dropoutPeriod} months`;
        return <Badge className="status-dropout">{displayText}</Badge>;
      case 'Never Enrolled':
        return <Badge className="status-never">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleEditChild = (childId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEditChild) {
      onEditChild(childId);
    }
  };

  const handleDeleteChild = (childId: string) => {
    console.log('Deleting child:', childId);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground">Children Records</h1>

        {/* Search and Export CTAs Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, Aadhar number, village, or block..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline" className="gap-2 bg-white">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={handleExportPDF} className="gap-2">
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
          </div>
          
          <Select value={blockFilter} onValueChange={setBlockFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="All Blocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blocks</SelectItem>
              {blocks.map(block => (
                <SelectItem key={block} value={block}>{block}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Enrolled">Enrolled</SelectItem>
              <SelectItem value="Dropout">Dropout</SelectItem>
              <SelectItem value="Never Enrolled">Never Enrolled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="text-muted-foreground text-sm">
          Showing {paginatedData.length} of {filteredData.length} children
        </div>

        {/* Data Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Aadhar No.</TableHead>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Age</TableHead>
                    <TableHead className="font-bold">Gender</TableHead>
                    <TableHead className="font-bold">Block</TableHead>
                    <TableHead className="font-bold">Village</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold">School</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((student, index) => (
                    <TableRow 
                      key={student.id} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/30" : ""}`}
                      onClick={() => onChildClick(student.id)}
                    >
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.age}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.block}</TableCell>
                      <TableCell>{student.village}</TableCell>
                      <TableCell>{getStatusBadge(student.schoolStatus)}</TableCell>
                      <TableCell>{student.school || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleEditChild(student.id, e)}
                            className="h-8 w-8 p-0"
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
                                <AlertDialogTitle>Delete Child Record</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the record for {student.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteChild(student.id)} className="bg-destructive text-destructive-foreground">
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
            <span className="text-muted-foreground text-sm">
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
      </div>
    </div>
  );
};

export default ChildrenRecords;
