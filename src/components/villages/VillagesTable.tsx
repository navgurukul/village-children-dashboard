
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';

interface Village {
  id: string;
  name: string;
  district: string;
  gramPanchayat: string;
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  assignedBalMitra: string;
}

interface VillagesTableProps {
  villages: Village[];
  onVillageClick: (villageId: string) => void;
  onEditVillage: (villageId: string) => void;
  onDeleteVillage: (villageId: string) => void;
}

const VillagesTable = ({ villages, onVillageClick, onEditVillage, onDeleteVillage }: VillagesTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [villageToDelete, setVillageToDelete] = useState<string | null>(null);

  const handleDeleteClick = (villageId: string) => {
    setVillageToDelete(villageId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVillage = () => {
    if (villageToDelete) {
      onDeleteVillage(villageToDelete);
    }
    setDeleteDialogOpen(false);
    setVillageToDelete(null);
  };

  return (
    <>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Village Name</TableHead>
                  <TableHead className="font-bold">District</TableHead>
                  <TableHead className="font-bold">Gram Panchayat</TableHead>
                  <TableHead className="font-bold">Total Children</TableHead>
                  <TableHead className="font-bold">Enrolled Children</TableHead>
                  <TableHead className="font-bold">Dropout Children</TableHead>
                  <TableHead className="font-bold">Never Enrolled</TableHead>
                  <TableHead className="font-bold">Assigned Bal Mitra</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {villages.map((village, index) => (
                  <TableRow 
                    key={village.id} 
                    className={`${index % 2 === 0 ? "bg-muted/30" : ""} cursor-pointer hover:bg-muted/50`}
                    onClick={() => onVillageClick(village.id)}
                  >
                    <TableCell className="font-medium">{village.name}</TableCell>
                    <TableCell>{village.district}</TableCell>
                    <TableCell>{village.gramPanchayat}</TableCell>
                    <TableCell>{village.totalChildren}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-success/20">
                        {village.enrolled}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        {village.dropout}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        {village.neverEnrolled}
                      </Badge>
                    </TableCell>
                    <TableCell>{village.assignedBalMitra}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => onEditVillage(village.id)}>
                          <Edit className="h-4 w-4 text-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(village.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Village</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this village? This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteVillage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Village
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VillagesTable;
