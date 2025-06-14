
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudentData, type StudentData, type FilterOptions } from '../data/mockData';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { Download, Filter } from 'lucide-react';

const Students = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    block: 'all',
    cluster: 'all',
    village: 'all',
    panchayat: 'all',
    gender: 'all',
    schoolStatus: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    return {
      blocks: [...new Set(mockStudentData.map(student => student.block))],
      clusters: [...new Set(mockStudentData.map(student => student.cluster))],
      villages: [...new Set(mockStudentData.map(student => student.village))],
      panchayats: [...new Set(mockStudentData.map(student => student.panchayat))],
      genders: ['Male', 'Female'],
      schoolStatuses: ['Enrolled', 'Dropout', 'Never Enrolled']
    };
  }, []);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return mockStudentData.filter(student => {
      return (
        (filters.block === 'all' || student.block === filters.block) &&
        (filters.cluster === 'all' || student.cluster === filters.cluster) &&
        (filters.village === 'all' || student.village === filters.village) &&
        (filters.panchayat === 'all' || student.panchayat === filters.panchayat) &&
        (filters.gender === 'all' || student.gender === filters.gender) &&
        (filters.schoolStatus === 'all' || student.schoolStatus === filters.schoolStatus)
      );
    });
  }, [filters]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleExportCSV = () => {
    exportToCSV(filteredData, 'students-data.csv');
  };

  const handleExportPDF = () => {
    exportToPDF(filteredData);
  };

  return (
    <div className="min-h-screen bg-[#90f6d7] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-[#263849] border-[#41506b]">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Student Records</CardTitle>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="bg-[#35bcbf] border-[#41506b]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Block</label>
                <Select value={filters.block} onValueChange={(value) => handleFilterChange('block', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    {filterOptions.blocks.map(block => (
                      <SelectItem key={block} value={block}>{block}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Cluster</label>
                <Select value={filters.cluster} onValueChange={(value) => handleFilterChange('cluster', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Cluster" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clusters</SelectItem>
                    {filterOptions.clusters.map(cluster => (
                      <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Village</label>
                <Select value={filters.village} onValueChange={(value) => handleFilterChange('village', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Village" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Villages</SelectItem>
                    {filterOptions.villages.map(village => (
                      <SelectItem key={village} value={village}>{village}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Panchayat</label>
                <Select value={filters.panchayat} onValueChange={(value) => handleFilterChange('panchayat', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Panchayat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Panchayats</SelectItem>
                    {filterOptions.panchayats.map(panchayat => (
                      <SelectItem key={panchayat} value={panchayat}>{panchayat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Gender</label>
                <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    {filterOptions.genders.map(gender => (
                      <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">School Status</label>
                <Select value={filters.schoolStatus} onValueChange={(value) => handleFilterChange('schoolStatus', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {filterOptions.schoolStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Buttons and Stats */}
        <div className="flex justify-between items-center">
          <div className="text-[#263849] font-medium">
            Showing {paginatedData.length} of {filteredData.length} students
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} className="bg-[#41506b] hover:bg-[#263849] text-white">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleExportPDF} className="bg-[#41506b] hover:bg-[#263849] text-white">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card className="bg-white border-[#41506b]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#41506b]">
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Age</TableHead>
                    <TableHead className="text-white">Gender</TableHead>
                    <TableHead className="text-white">Block</TableHead>
                    <TableHead className="text-white">Cluster</TableHead>
                    <TableHead className="text-white">Village</TableHead>
                    <TableHead className="text-white">Panchayat</TableHead>
                    <TableHead className="text-white">School Status</TableHead>
                    <TableHead className="text-white">Class</TableHead>
                    <TableHead className="text-white">School</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((student, index) => (
                    <TableRow key={student.id} className={index % 2 === 0 ? "bg-[#90f6d7]/20" : "bg-white"}>
                      <TableCell className="font-medium text-[#263849]">{student.id}</TableCell>
                      <TableCell className="text-[#263849]">{student.name}</TableCell>
                      <TableCell className="text-[#263849]">{student.age}</TableCell>
                      <TableCell className="text-[#263849]">{student.gender}</TableCell>
                      <TableCell className="text-[#263849]">{student.block}</TableCell>
                      <TableCell className="text-[#263849]">{student.cluster}</TableCell>
                      <TableCell className="text-[#263849]">{student.village}</TableCell>
                      <TableCell className="text-[#263849]">{student.panchayat}</TableCell>
                      <TableCell className="text-[#263849]">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.schoolStatus === 'Enrolled' ? 'bg-green-100 text-green-800' :
                          student.schoolStatus === 'Dropout' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {student.schoolStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#263849]">{student.class || '-'}</TableCell>
                      <TableCell className="text-[#263849]">{student.school || '-'}</TableCell>
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
              className="bg-[#41506b] hover:bg-[#263849] text-white"
            >
              Previous
            </Button>
            <span className="text-[#263849] font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-[#41506b] hover:bg-[#263849] text-white"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
