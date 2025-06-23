
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  aadhaar: string;
  schoolName: string;
  schoolStatus: string;
  block: string;
  gramPanchayat: string;
}

interface ChildrenCardListProps {
  data: Child[];
  onChildClick: (childId: string) => void;
  onEditChild?: (childId: string) => void;
  onDeleteChild: (childId: string) => void;
}

const ChildrenCardList = ({ data, onChildClick, onEditChild, onDeleteChild }: ChildrenCardListProps) => {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enrolled': return 'status-enrolled';
      case 'Dropout': return 'status-dropout';
      case 'Never Enrolled': return 'status-never';
      default: return 'status-pending';
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {data.map((child) => (
        <Card key={child.id} className="cursor-pointer" onClick={() => onChildClick(child.id)}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-base">{child.name}</h3>
                <Badge className={`${getStatusColor(child.schoolStatus)} text-xs mt-1`}>
                  {child.schoolStatus}
                </Badge>
              </div>
              <Sheet 
                open={activeSheet === child.id} 
                onOpenChange={(open) => setActiveSheet(open ? child.id : null)}
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
                    <SheetTitle>Actions for {child.name}</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-2 mt-4">
                    {onEditChild && (
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 h-12"
                        onClick={() => {
                          onEditChild(child.id);
                          setActiveSheet(null);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Child
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start gap-2 h-12 text-destructive"
                      onClick={() => {
                        onDeleteChild(child.id);
                        setActiveSheet(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Child
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">
              Age: {child.age} • {child.gender} • {child.village}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <div>Aadhaar: {child.aadhaar}</div>
              <div>School: {child.schoolName}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChildrenCardList;
