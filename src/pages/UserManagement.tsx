import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2, Copy, Plus, Upload, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FilterChips from '../components/FilterChips';
import UsersCardList from '../components/users/UsersCardList';
import { useIsMobile } from "@/hooks/use-mobile";

interface User {
  id: number;
  name: string;
  role: string;
  assignedTo: string;
  username: string;
  password: string;
  createdOn: string;
  villages: string[];
}

interface UserManagementProps {
  onAddUser: () => void;
  onBulkUpload: () => void;
  onBalMitraClick: (balMitraId: number) => void;
  onEditUser: (userId: number) => void;
}

const UserManagement = ({ onAddUser, onBulkUpload, onBalMitraClick, onEditUser }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();

  // Mock users data
  const usersData: User[] = [
    {
      id: 1,
      name: 'Admin User',
      role: 'Admin',
      assignedTo: 'All Blocks',
      username: 'admin@portal',
      password: 'admin123',
      createdOn: '2024-01-15',
      villages: []
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Bal Mitra',
      assignedTo: 'Block A - Gram Panchayat 1',
      username: 'priya.sharma',
      password: 'ps@2024',
      createdOn: '2024-02-10',
      villages: ['Haripur', 'Rampur', 'Lakshmipur']
    },
    {
      id: 3,
      name: 'Ravi Kumar',
      role: 'Bal Mitra',
      assignedTo: 'Block B - Gram Panchayat 2',
      username: 'ravi.kumar',
      password: 'rk@2024',
      createdOn: '2024-02-15',
      villages: ['Govindpur', 'Shantipur']
    }
  ];

  // Filter data
  const filteredData = useMemo(() => {
    return usersData.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDeleteUser = (userId: number) => {
    console.log('Delete user:', userId);
  };

  const handleCopyLoginDetails = (username: string, password: string) => {
    const loginDetails = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard.writeText(loginDetails).then(() => {
      console.log('Login details copied to clipboard');
    });
  };

  const handleUserClick = (user: User) => {
    if (user.role === 'Bal Mitra') {
      onBalMitraClick(user.id);
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'role') {
      setRoleFilter(value);
    }
  };

  const filterOptions = [
    {
      label: 'Role',
      value: roleFilter,
      options: [
        { label: 'All Roles', value: 'all' },
        { label: 'Admin', value: 'Admin' },
        { label: 'Bal Mitra', value: 'Bal Mitra' }
      ]
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>

        {isMobile ? (
          <div className="space-y-4">
            {/* Search Bar - Full Width */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>

            {/* CTAs - Full Width Row */}
            <div className="flex gap-2 w-full">
              <Button onClick={onAddUser} className="gap-2 flex-1">
                <Plus className="h-4 w-4" />
                Add New User
              </Button>
              <Button onClick={onBulkUpload} variant="outline" className="gap-2 bg-white flex-1">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </div>

            {/* Filter Chips */}
            <FilterChips
              filters={filterOptions}
              onFilterChange={handleFilterChange}
            />

            <div className="text-muted-foreground text-xs">
              Showing {paginatedData.length} of {filteredData.length} users
            </div>

            {/* Users Card List */}
            <UsersCardList
              users={paginatedData}
              onUserClick={handleUserClick}
              onEditUser={onEditUser}
              onDeleteUser={handleDeleteUser}
              onCopyLoginDetails={handleCopyLoginDetails}
            />
          </div>
        ) : (
          <>
            {/* Desktop Search and Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={onAddUser} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New User
                </Button>
                <Button onClick={onBulkUpload} variant="outline" className="gap-2 bg-white">
                  <Upload className="h-4 w-4" />
                  Bulk Upload Users
                </Button>
              </div>
            </div>

            {/* Desktop Filters */}
            <div className="flex gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Bal Mitra">Bal Mitra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-muted-foreground text-xs">
              Showing {paginatedData.length} of {filteredData.length} users
            </div>

            {/* Desktop Table */}
            <div className="border rounded-lg bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Role</TableHead>
                    <TableHead className="font-bold">Username</TableHead>
                    <TableHead className="font-bold">Password</TableHead>
                    <TableHead className="font-bold">Assigned To</TableHead>
                    <TableHead className="font-bold">Created On</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((user, index) => (
                    <TableRow 
                      key={user.id} 
                      className={`${index % 2 === 0 ? "bg-muted/30" : ""} ${user.role === 'Bal Mitra' ? 'cursor-pointer hover:bg-accent' : ''}`}
                      onClick={() => user.role === 'Bal Mitra' ? handleUserClick(user) : undefined}
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.username}</TableCell>
                      <TableCell className="font-mono text-sm">{user.password}</TableCell>
                      <TableCell>{user.assignedTo}</TableCell>
                      <TableCell>{formatDate(user.createdOn)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLoginDetails(user.username, user.password);
                            }}
                            title="Copy Login Details"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditUser(user.id);
                            }}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                            title="Delete"
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
          </>
        )}

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
            <span className="text-muted-foreground text-xs">
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

export default UserManagement;
