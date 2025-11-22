import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  gender: string;
  block: string;
  para: string; 
  village: string; 
  schoolStatus: string;
  school?: string;
  aadhaarNumber: string;
  gramPanchayat?: string; 
}

interface ChildrenTableProps {
  data: Student[];
  onChildClick: (childId: string) => void;
  onEditChild?: (childId: string) => void;
  onDeleteChild: (childId: string) => void;
}

const ChildrenTable = ({ data, onChildClick, onEditChild, onDeleteChild }: ChildrenTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <Badge className="status-enrolled">Enrolled</Badge>;
      case 'dropout':
        return <Badge className="status-dropout">Dropout</Badge>;
      case 'never_enrolled':
        return <Badge className="status-never">Never Enrolled</Badge>;
      case 'unknown':
        return <Badge variant="outline" className="text-gray-600 border-gray-300">Unknown</Badge>;
      // Handle legacy cases (for backwards compatibility)
      case 'Enrolled':
        return <Badge className="status-enrolled">Enrolled</Badge>;
      case 'Dropout':
        return <Badge className="status-dropout">Dropout</Badge>;
      case 'Never Enrolled':
        return <Badge className="status-never">Never Enrolled</Badge>;
      case 'N/A':
        return <Badge variant="outline" className="text-gray-400 border-gray-300">N/A</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleEditChild = (childId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEditChild) {
      onEditChild(childId);
    }
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Aadhar No.</TableHead>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Gender</TableHead>
                <TableHead className="font-bold">Block</TableHead>
                <TableHead className="font-bold">Gram Panchayat</TableHead>
                <TableHead className="font-bold">Village</TableHead>
                <TableHead className="font-bold">Para</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">School</TableHead>
                {/* <TableHead className="font-bold">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((student, index) => (
                <TableRow 
                  key={student.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/30" : ""}`}
                  onClick={() => onChildClick(student.id)}
                >
                  <TableCell className="font-medium">{student.aadhaarNumber || '-'}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.block}</TableCell>
                  <TableCell>{student.gramPanchayat || '-'}</TableCell>
                  <TableCell>{student.village || '-'}</TableCell>
                  <TableCell>{student.para || '-'}</TableCell>
                  <TableCell>{getStatusBadge(student.schoolStatus)}</TableCell>
                  <TableCell>{student.school || '-'}</TableCell>
                  {/* <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleEditChild(student.id, e)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChild(student.id);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildrenTable;
