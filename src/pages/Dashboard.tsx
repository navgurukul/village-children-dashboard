import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockStudentData, type FilterOptions } from '../data/mockData';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { Download, Users, GraduationCap, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    block: 'all',
    cluster: 'all',
    village: 'all',
    panchayat: 'all',
    gender: 'all',
    schoolStatus: 'all'
  });

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

  const stats = useMemo(() => {
    const total = filteredData.length;
    const male = filteredData.filter(s => s.gender === 'Male').length;
    const female = filteredData.filter(s => s.gender === 'Female').length;
    const enrolled = filteredData.filter(s => s.schoolStatus === 'Enrolled').length;
    const dropout = filteredData.filter(s => s.schoolStatus === 'Dropout').length;
    const neverEnrolled = filteredData.filter(s => s.schoolStatus === 'Never Enrolled').length;

    return {
      total,
      male,
      female,
      enrolled,
      dropout,
      neverEnrolled
    };
  }, [filteredData]);

  const genderChartData = [
    { name: 'Male', value: stats.male, color: '#35bcbf' },
    { name: 'Female', value: stats.female, color: '#41506b' }
  ];

  const schoolStatusChartData = [
    { name: 'Enrolled', value: stats.enrolled, color: '#90f6d7' },
    { name: 'Dropout', value: stats.dropout, color: '#35bcbf' },
    { name: 'Never Enrolled', value: stats.neverEnrolled, color: '#263849' }
  ];

  const blockWiseData = useMemo(() => {
    const blockStats = filterOptions.blocks.map(block => {
      const blockStudents = filteredData.filter(s => s.block === block);
      return {
        block,
        male: blockStudents.filter(s => s.gender === 'Male').length,
        female: blockStudents.filter(s => s.gender === 'Female').length,
        enrolled: blockStudents.filter(s => s.schoolStatus === 'Enrolled').length,
        dropout: blockStudents.filter(s => s.schoolStatus === 'Dropout').length,
        neverEnrolled: blockStudents.filter(s => s.schoolStatus === 'Never Enrolled').length
      };
    });
    return blockStats;
  }, [filteredData, filterOptions.blocks]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(filteredData, 'dashboard-data.csv');
  };

  const handleExportPDF = () => {
    exportToPDF(filteredData);
  };

  return (
    <div className="min-h-screen bg-[#90f6d7] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <Card className="bg-[#35bcbf] border-[#41506b]">
          <CardHeader>
            <CardTitle className="text-white">Filters</CardTitle>
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-[#41506b]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[#35bcbf]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#263849]">Total Students</p>
                  <p className="text-2xl font-bold text-[#263849]">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#41506b]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-[#35bcbf]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#263849]">Enrolled</p>
                  <p className="text-2xl font-bold text-[#263849]">{stats.enrolled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#41506b]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-[#35bcbf]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#263849]">Dropout</p>
                  <p className="text-2xl font-bold text-[#263849]">{stats.dropout}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#41506b]">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[#35bcbf]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#263849]">Never Enrolled</p>
                  <p className="text-2xl font-bold text-[#263849]">{stats.neverEnrolled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end gap-2">
          <Button onClick={handleExportCSV} className="bg-[#41506b] hover:bg-[#263849] text-white">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleExportPDF} className="bg-[#41506b] hover:bg-[#263849] text-white">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-[#41506b]">
            <CardHeader>
              <CardTitle className="text-[#263849]">Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {genderChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#41506b]">
            <CardHeader>
              <CardTitle className="text-[#263849]">School Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={schoolStatusChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {schoolStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Block-wise Analysis */}
        <Card className="bg-white border-[#41506b]">
          <CardHeader>
            <CardTitle className="text-[#263849]">Block-wise Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={blockWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="block" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="male" fill="#35bcbf" name="Male" />
                <Bar dataKey="female" fill="#41506b" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#41506b]">
          <CardHeader>
            <CardTitle className="text-[#263849]">Block-wise School Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={blockWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="block" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="#90f6d7" name="Enrolled" />
                <Bar dataKey="dropout" fill="#35bcbf" name="Dropout" />
                <Bar dataKey="neverEnrolled" fill="#263849" name="Never Enrolled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
