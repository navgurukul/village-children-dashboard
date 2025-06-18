
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Plus, Upload, Edit, Trash2, Copy } from 'lucide-react';

interface UserManagementProps {
  onAddUser: () => void;
  onBulkUpload: () => void;
  onBalMitraClick: (balMitraId: number) => void;
  onEditUser?: (userId: number) => void;
}

const UserManagement = ({ onAddUser, onBulkUpload, onBalMitraClick, onEditUser }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data - sorted to show Admins first
  const users = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Admin',
      assignedTo: 'All Districts',
      username: 'rajesh.admin',
      password: 'admin123!',
      createdOn: '2024-01-15',
      villages: []
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Bal Mitra',
      assignedTo: '5 Villages',
      username: 'priya.bm',
      password: 'bm123!',
      createdOn: '2024-02-10',
      villages: ['Haripur', 'Rampur', 'Lakshmipur', 'Govindpur', 'Shantipur']
    },
    {
      id: 3,
      name: 'Amit Singh',
      role: 'Bal Mitra',
      assignedTo: '3 Villages',
      username: 'amit.bm',
      password: 'bm456!',
      createdOn: '2024-02-20',
      villages: ['Village A', 'Village B', 'Village C']
    }
  ].sort((a, b) => a.role === 'Admin' ? -1 : b.role === 'Admin' ? 1 : 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  };

  const handleDeleteUser = (userId: number) => {
    console.log('Deleting user:', userId);
  };

  const handleEditUser = (userId: number) => {
    if (onEditUser) {
      onEditUser(userId);
    }
  };

  const handleUserClick = (user: any) => {
    if (user.role === 'Bal Mitra') {
      onBalMitraClick(user.id);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>

        {/* Control Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onAddUser} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New User
            </Button>
            <Button onClick={onBulkUpload} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload Users
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Role</TableHead>
                    <TableHead className="font-bold">Assigned To</TableHead>
                    <TableHead className="font-bold">Username</TableHead>
                    <TableHead className="font-bold">Password</TableHead>
                    <TableHead className="font-bold">Created On</TableHead>
                    <TableHead className="font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow 
                      key={user.id} 
                      className={`${index % 2 === 0 ? "bg-muted/30" : ""} ${user.role === 'Bal Mitra' ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                      onClick={() => handleUserClick(user)}
                    >
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="relative group">
                          <span className="text-primary">
                            {user.assignedTo}
                          </span>
                          {user.villages.length > 0 && (
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-popover border border-border rounded-lg p-3 shadow-lg z-10 min-w-[200px]">
                              <p className="text-sm font-medium mb-2">Assigned Villages:</p>
                              <ul className="text-sm space-y-1">
                                {user.villages.map((village, idx) => (
                                  <li key={idx} className="text-muted-foreground">• {village}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{user.username}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(user.username);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">••••••••</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(user.password);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{user.createdOn}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user.id);
                            }}
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
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive text-destructive-foreground">
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
      </div>
    </div>
  );
};

export default UserManagement;
