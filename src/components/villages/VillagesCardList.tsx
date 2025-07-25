
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

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
      {villages.map((village, index) => (
        <div key={village.id}>
          <div className="flex items-start justify-between py-3" onClick={() => onVillageClick(village.id)}>
            <div className="flex-1 cursor-pointer">
              <h3 className="font-medium text-base mb-2">{village.name}</h3>
              
              <div className="text-sm text-muted-foreground mb-2">
                Total: {village.totalChildren} • Enrolled: {village.enrolled} • Dropout: {village.dropout}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <div>Bal Mitra: {village.assignedBalMitra}</div>
                <div>Gram Panchayat: {village.gramPanchayat}</div>
              </div>
            </div>
            
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
          {index < villages.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};

export default VillagesCardList;
