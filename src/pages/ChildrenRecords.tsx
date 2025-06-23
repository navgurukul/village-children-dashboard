
import React, { useState, useMemo } from 'react';
import { mockStudentData } from '../data/mockData';
import ChildrenRecordsHeader from '../components/children-records/ChildrenRecordsHeader';
import ChildrenRecordsContent from '../components/children-records/ChildrenRecordsContent';

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

  // Transform mockStudentData to match Child interface with populated school names
  const childrenData = useMemo(() => {
    const schools = [
      'Primary School Haripur',
      'Government High School',
      'Anganwadi Center 1',
      'Anganwadi Center 2',
      'St. Mary\'s School',
      'Government Primary School'
    ];
    
    return mockStudentData.map((student, index) => ({
      id: student.id,
      name: student.name,
      age: student.age,
      gender: student.gender,
      village: student.village,
      aadhaar: 'N/A', // Not available in StudentData
      schoolName: student.school || schools[index % schools.length],
      schoolStatus: student.schoolStatus,
      block: student.block,
      gramPanchayat: student.panchayat || 'N/A'
    }));
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    return childrenData.filter(child => {
      const matchesSearch = searchTerm === '' || 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.block.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBlock = blockFilter === 'all' || child.block === blockFilter;
      const matchesStatus = statusFilter === 'all' || child.schoolStatus === statusFilter;

      return matchesSearch && matchesBlock && matchesStatus;
    });
  }, [childrenData, searchTerm, blockFilter, statusFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
  };

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
  };

  const handleDeleteChild = (childId: string) => {
    console.log('Deleting child:', childId);
  };

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'block') {
      setBlockFilter(value);
    } else if (filterId === 'status') {
      setStatusFilter(value);
    }
  };

  const filterOptions = [
    {
      label: 'Block',
      value: blockFilter,
      options: [
        { label: 'All Blocks', value: 'all' },
        ...blocks.map(block => ({ label: block, value: block }))
      ]
    },
    {
      label: 'Status',
      value: statusFilter,
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Enrolled', value: 'Enrolled' },
        { label: 'Dropout', value: 'Dropout' },
        { label: 'Never Enrolled', value: 'Never Enrolled' }
      ]
    }
  ];

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <ChildrenRecordsHeader />
        
        <ChildrenRecordsContent
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          blockFilter={blockFilter}
          statusFilter={statusFilter}
          blocks={blocks}
          onBlockFilterChange={setBlockFilter}
          onStatusFilterChange={setStatusFilter}
          paginatedData={paginatedData}
          filteredData={filteredData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onChildClick={onChildClick}
          onEditChild={onEditChild}
          onDeleteChild={handleDeleteChild}
          handleExportCSV={handleExportCSV}
          handleExportPDF={handleExportPDF}
          handleFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default ChildrenRecords;
