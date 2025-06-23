
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';

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

interface UsersCardListProps {
  users: User[];
  onUserClick: (user: User) => void;
  onEditUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
  onCopyLoginDetails: (username: string, password: string) => void;
}

const UsersCardList = ({ users, onUserClick, onEditUser, onDeleteUser, onCopyLoginDetails }: UsersCardListProps) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  return (
    <div className="md:hidden space-y-3">
      {users.map((user) => (
        <Card key={user.id} className="cursor-pointer" onClick={() => onUserClick(user)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-base">{user.name}</h3>
                <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className="text-xs mt-1">
                  {user.role}
                </Badge>
              </div>
              <Sheet 
                open={activeSheet === user.id.toString()} 
                onOpenChange={(open) => setActiveSheet(open ? user.id.toString() : null)}
              >
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto">
                  <SheetHeader>
                    <SheetTitle>Actions for {user.name}</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-2 mt-4">
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12"
                      onClick={() => {
                        onCopyLoginDetails(user.username, user.password);
                        setActiveSheet(null);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      Copy Login Details
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12"
                      onClick={() => {
                        onEditUser(user.id);
                        setActiveSheet(null);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit User
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12 text-destructive"
                      onClick={() => {
                        onDeleteUser(user.id);
                        setActiveSheet(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete User
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              {user.username} • Created: {user.createdOn}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Assigned to: {user.assignedTo}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UsersCardList;
