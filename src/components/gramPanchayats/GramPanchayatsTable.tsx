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

interface GramPanchayat {
  id: string;
  name: string;
  district: string;
  block?: string;
  blocks?: string[];
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  totalParas?: number;
  gramPanchayat?: string;
  gramPanchayats?: string[];
  assignedBalMitra?: string;
}

interface GramPanchayatTableProps {
  gramPanchayats: GramPanchayat[];
  onGramPanchayatClick: (gramPanchayatId: string) => void;
  onEditGramPanchayat: (gramPanchayatId: string) => void;
  onDeleteGramPanchayat: (gramPanchayatId: string) => void;
}

const GramPanchayatTable = ({ gramPanchayats, onGramPanchayatClick, onEditGramPanchayat, onDeleteGramPanchayat }: GramPanchayatTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gramPanchayatToDelete, setGramPanchayatToDelete] = useState<string | null>(null);

  const handleDeleteClick = (gramPanchayatId: string) => {
    setGramPanchayatToDelete(gramPanchayatId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGramPanchayat = () => {
    if (gramPanchayatToDelete) {
      onDeleteGramPanchayat(gramPanchayatToDelete);
    }
    setDeleteDialogOpen(false);
    setGramPanchayatToDelete(null);
  };

  return (
    <>
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Gram Panchayat Name</TableHead>
                  <TableHead className="font-bold">District</TableHead>
                  <TableHead className="font-bold">Block</TableHead>
                  <TableHead className="font-bold">Total Children</TableHead>
                  <TableHead className="font-bold">Enrolled Children</TableHead>
                  <TableHead className="font-bold">Dropout Children</TableHead>
                  <TableHead className="font-bold">Never Enrolled</TableHead>
                  <TableHead className="font-bold">Assigned Bal Mitra</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gramPanchayats.map((gp, index) => (
                  <TableRow 
                    key={gp.id} 
                    className={`${index % 2 === 0 ? "bg-muted/30" : ""} cursor-pointer hover:bg-muted/50`}
                    onClick={() => onGramPanchayatClick(gp.id)}
                  >
                    <TableCell className="font-medium">{gp.name}</TableCell>
                    <TableCell>{gp.district}</TableCell>
                    <TableCell>{gp.block || (gp.blocks && gp.blocks.length > 0 ? gp.blocks[0] : '')}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {gp.totalChildren}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-success/20">
                        {gp.enrolled}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        {gp.dropout}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        {gp.neverEnrolled}
                      </Badge>
                    </TableCell>
                    <TableCell>{gp.assignedBalMitra || gp.name || 'Not Assigned'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => onEditGramPanchayat(gp.id)}>
                          <Edit className="h-4 w-4 text-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(gp.id)}>
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
            <AlertDialogTitle>Delete Gram Panchayat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Gram Panchayat? This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteGramPanchayat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Gram Panchayat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GramPanchayatTable;
