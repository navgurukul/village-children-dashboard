import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Copy, Plus, Upload, Search } from 'lucide-react';
import FilterChips from '../components/FilterChips';
import UsersCardList from '../components/users/UsersCardList';
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient, User } from '../lib/api';
import { useToast } from "@/hooks/use-toast";


interface UserManagementProps {
  onAddUser: () => void;
  onBulkUpload: () => void;
  onBalMitraClick: (balMitraData: User) => void;
  onEditUser: (user: User) => void;
}

const UserManagement = ({ onAddUser, onBulkUpload, onBalMitraClick, onEditUser }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const itemsPerPage = 20;
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getUsers({
        role: roleFilter === 'all' ? undefined : roleFilter,
        page: currentPage,
        limit: itemsPerPage,
      });
      
      if (response.success) {
        // Filter out deleted users
        const activeUsers = response.data.items.filter(user => !user.isDeleted);
        setUsers(activeUsers);
        setTotalCount(activeUsers.length);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [users, searchTerm]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await apiClient.deleteUser(userToDelete);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCopyLoginDetails = (username: string, mobile: string) => {
    const loginDetails = `Username: ${username}\nPassword: ${mobile}`;
    navigator.clipboard.writeText(loginDetails).then(() => {
      toast({
        title: "Copied!",
        description: "Login details copied to clipboard",
      });
    });
  };

  const handleUserClick = (user: User) => {
    if (user.role === 'balMitra') {
      onBalMitraClick(user);
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'role') {
      setRoleFilter(value);
      setCurrentPage(1);
    }
  };

  const filterOptions = [
    {
      label: 'Role',
      value: roleFilter,
      options: [
        { label: 'All Roles', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'Bal Mitra', value: 'balMitra' }
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
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="balMitra">Bal Mitra</SelectItem>
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
                      className={`${index % 2 === 0 ? "bg-muted/30" : ""} ${user.role === 'balMitra' ? 'cursor-pointer hover:bg-accent' : ''}`}
                      onClick={() => user.role === 'balMitra' ? handleUserClick(user) : undefined}
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Admin' : 'Bal Mitra'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.username}</TableCell>
                      <TableCell className="font-mono text-sm">{user.mobile}</TableCell>
                      <TableCell>{user.block ? `${user.block} - ${user.panchayat}` : 'All Blocks'}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLoginDetails(user.username, user.mobile);
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
                              onEditUser(user);
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
