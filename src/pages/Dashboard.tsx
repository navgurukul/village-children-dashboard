
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Filter, Users, GraduationCap, UserX, MapPin } from 'lucide-react';
import { mockStudentData, type StudentData, type FilterOptions } from '@/data/mockData';
import { downloadCSV, downloadPDF } from '@/utils/exportUtils';

const Dashboard = () => {
  const [data, setData] = useState<StudentData[]>(mockStudentData);
  const [filteredData, setFilteredData] = useState<StudentData[]>(mockStudentData);
  const [filters, setFilters] = useState<FilterOptions>({
    block: '',
    cluster: '',
    village: '',
    panchayat: '',
    gender: '',
    schoolStatus: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters, data]);

  const applyFilters = () => {
    let filtered = data;

    if (filters.block) {
      filtered = filtered.filter(student => student.block === filters.block);
    }
    if (filters.cluster) {
      filtered = filtered.filter(student => student.cluster === filters.cluster);
    }
    if (filters.village) {
      filtered = filtered.filter(student => student.village === filters.village);
    }
    if (filters.panchayat) {
      filtered = filtered.filter(student => student.panchayat === filters.panchayat);
    }
    if (filters.gender) {
      filtered = filtered.filter(student => student.gender === filters.gender);
    }
    if (filters.schoolStatus) {
      filtered = filtered.filter(student => student.schoolStatus === filters.schoolStatus);
    }

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setFilters({
      block: '',
      cluster: '',
      village: '',
      panchayat: '',
      gender: '',
      schoolStatus: ''
    });
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field: keyof StudentData) => {
    return [...new Set(data.map(student => student[field]))].sort();
  };

  // Calculate statistics
  const totalStudents = filteredData.length;
  const maleCount = filteredData.filter(s => s.gender === 'Male').length;
  const femaleCount = filteredData.filter(s => s.gender === 'Female').length;
  const enrolledCount = filteredData.filter(s => s.schoolStatus === 'Enrolled').length;
  const dropoutCount = filteredData.filter(s => s.schoolStatus === 'Dropout').length;
  const neverEnrolledCount = filteredData.filter(s => s.schoolStatus === 'Never Enrolled').length;

  // Data for charts
  const genderData = [
    { name: 'Male', value: maleCount, color: '#3b82f6' },
    { name: 'Female', value: femaleCount, color: '#ec4899' }
  ];

  const schoolStatusData = [
    { name: 'Enrolled', value: enrolledCount, color: '#10b981' },
    { name: 'Dropout', value: dropoutCount, color: '#f59e0b' },
    { name: 'Never Enrolled', value: neverEnrolledCount, color: '#ef4444' }
  ];

  const blockWiseData = getUniqueValues('block').map(block => {
    const blockStudents = filteredData.filter(s => s.block === block);
    return {
      block,
      total: blockStudents.length,
      male: blockStudents.filter(s => s.gender === 'Male').length,
      female: blockStudents.filter(s => s.gender === 'Female').length,
      enrolled: blockStudents.filter(s => s.schoolStatus === 'Enrolled').length,
      dropout: blockStudents.filter(s => s.schoolStatus === 'Dropout').length
    };
  });

  const handleExportCSV = () => {
    downloadCSV(filteredData, 'student-data');
  };

  const handleExportPDF = () => {
    const stats = {
      totalStudents,
      maleCount,
      femaleCount,
      enrolledCount,
      dropoutCount,
      neverEnrolledCount
    };
    downloadPDF(filteredData, stats, 'student-report');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Data Dashboard</h1>
          <p className="text-gray-600">Track student enrollment and demographics across blocks, clusters, villages, and panchayats</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="block">Block</Label>
                <Select value={filters.block} onValueChange={(value) => setFilters({...filters, block: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Blocks</SelectItem>
                    {getUniqueValues('block').map(block => (
                      <SelectItem key={block} value={block}>{block}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cluster">Cluster</Label>
                <Select value={filters.cluster} onValueChange={(value) => setFilters({...filters, cluster: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Cluster" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Clusters</SelectItem>
                    {getUniqueValues('cluster').map(cluster => (
                      <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="village">Village</Label>
                <Select value={filters.village} onValueChange={(value) => setFilters({...filters, village: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Village" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Villages</SelectItem>
                    {getUniqueValues('village').map(village => (
                      <SelectItem key={village} value={village}>{village}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="panchayat">Panchayat</Label>
                <Select value={filters.panchayat} onValueChange={(value) => setFilters({...filters, panchayat: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Panchayat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Panchayats</SelectItem>
                    {getUniqueValues('panchayat').map(panchayat => (
                      <SelectItem key={panchayat} value={panchayat}>{panchayat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="schoolStatus">School Status</Label>
                <Select value={filters.schoolStatus} onValueChange={(value) => setFilters({...filters, schoolStatus: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Enrolled">Enrolled</SelectItem>
                    <SelectItem value="Dropout">Dropout</SelectItem>
                    <SelectItem value="Never Enrolled">Never Enrolled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              <Button onClick={handleExportCSV} className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enrolled</p>
                  <p className="text-3xl font-bold text-green-600">{enrolledCount}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Dropouts</p>
                  <p className="text-3xl font-bold text-orange-600">{dropoutCount}</p>
                </div>
                <UserX className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Never Enrolled</p>
                  <p className="text-3xl font-bold text-red-600">{neverEnrolledCount}</p>
                </div>
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* School Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>School Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={schoolStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {schoolStatusData.map((entry, index) => (
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
        <Card>
          <CardHeader>
            <CardTitle>Block-wise Student Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={blockWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="block" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" fill="#3b82f6" name="Male" />
                <Bar dataKey="female" fill="#ec4899" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrollment Status by Block */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Status by Block</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={blockWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="block" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrolled" fill="#10b981" name="Enrolled" />
                <Bar dataKey="dropout" fill="#f59e0b" name="Dropout" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
