import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface GramPanchayat {
  id: string;
  name: string;
  district: string;
  blocks?: string[];
  totalChildren: number;
  enrolled: number;
  dropout: number;
  neverEnrolled: number;
  totalParas?: number;
  // For backward compatibility
  gramPanchayat?: string;
  gramPanchayats?: string[];
  assignedBalMitra?: string;
}

interface GramPanchayatCardListProps {
  gramPanchayats: GramPanchayat[];
  onGramPanchayatClick: (gramPanchayatId: string) => void;
  onEditGramPanchayat: (gramPanchayatId: string) => void;
  onDeleteGramPanchayat: (gramPanchayatId: string) => void;
}

const GramPanchayatCardList = ({ gramPanchayats, onGramPanchayatClick, onEditGramPanchayat, onDeleteGramPanchayat }: GramPanchayatCardListProps) => {
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);

  return (
    <div className="md:hidden space-y-3">
      {gramPanchayats.map((gp, index) => (
        <div key={gp.id}>
          <div className="flex items-start justify-between py-3" onClick={() => onGramPanchayatClick(gp.id)}>
            <div className="flex-1 cursor-pointer">
              <h3 className="font-medium text-base mb-2">{gp.name}</h3>
              
              <div className="text-sm text-muted-foreground mb-2">
                Total: {gp.totalChildren} • Enrolled: {gp.enrolled} • Dropout: {gp.dropout}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <div>Block: {gp.blocks && gp.blocks.length ? gp.blocks.join(', ') : 'Not Assigned'}</div>
                <div>Total Paras: {gp.totalParas || 0}</div>
                <div>Assigned Bal Mitra: {gp.assignedBalMitra || 'Not Assigned'}</div>
              </div>
            </div>
            
            <Sheet 
              open={activeSheetId === gp.id} 
              onOpenChange={(open) => setActiveSheetId(open ? gp.id : null)}
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
                  <SheetTitle>Actions for {gp.name}</SheetTitle>
                </SheetHeader>
                <div className="grid gap-2 mt-4">
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 h-12"
                    onClick={() => {
                      onEditGramPanchayat(gp.id);
                      setActiveSheetId(null);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Gram Panchayat
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 h-12 text-destructive"
                    onClick={() => {
                      onDeleteGramPanchayat(gp.id);
                      setActiveSheetId(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Gram Panchayat
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {index < gramPanchayats.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};

export default GramPanchayatCardList;
