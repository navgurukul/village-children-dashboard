
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface Village {
  id: string;
  name: string;
  block: string;
  gramPanchayat: string;
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  assignedBalMitra: string;
}

interface VillagesCardListProps {
  villages: Village[];
  onVillageClick: (villageId: string) => void;
  onEditVillage: (villageId: string) => void;
  onDeleteVillage: (villageId: string) => void;
}

const VillagesCardList = ({ villages, onVillageClick, onEditVillage, onDeleteVillage }: VillagesCardListProps) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  return (
    <div className="md:hidden space-y-3">
      {villages.map((village) => (
        <Card key={village.id} className="cursor-pointer" onClick={() => onVillageClick(village.id)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-base">{village.name}</h3>
              <Sheet 
                open={activeSheet === village.id} 
                onOpenChange={(open) => setActiveSheet(open ? village.id : null)}
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
                    <SheetTitle>Actions for {village.name}</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-2 mt-4">
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12"
                      onClick={() => {
                        onEditVillage(village.id);
                        setActiveSheet(null);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Village
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12 text-destructive"
                      onClick={() => {
                        onDeleteVillage(village.id);
                        setActiveSheet(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Village
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              Total: {village.totalChildren} • Enrolled: {village.enrolled} • Dropout: {village.dropout}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <div>Bal Mitra: {village.assignedBalMitra}</div>
              <div>Gram Panchayat: {village.gramPanchayat}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VillagesCardList;
