
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';

interface EditVillageProps {
  villageId: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditVillage = ({ villageId, onCancel, onSuccess }: EditVillageProps) => {
  const [formData, setFormData] = useState({
    villageName: 'Haripur',
    block: 'rajgangpur',
    cluster: 'cluster1',
    panchayat: 'panchayat1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating village:', formData);
    onSuccess();
  };

  if (!villageId) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground">No village selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button 
            onClick={onCancel} 
            variant="link" 
            className="gap-2 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Edit Village</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="villageName">Village Name *</Label>
            <Input
              id="villageName"
              type="text"
              value={formData.villageName}
              onChange={(e) => setFormData(prev => ({ ...prev, villageName: e.target.value }))}
              placeholder="Enter village name"
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="block">Block *</Label>
            <Select value={formData.block} onValueChange={(value) => setFormData(prev => ({ ...prev, block: value, cluster: '', panchayat: '' }))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block1">Block 1</SelectItem>
                <SelectItem value="block2">Block 2</SelectItem>
                <SelectItem value="rajgangpur">Rajgangpur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cluster">Cluster *</Label>
            <Select 
              value={formData.cluster} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, cluster: value, panchayat: '' }))}
              disabled={!formData.block}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cluster1">Cluster 1</SelectItem>
                <SelectItem value="cluster2">Cluster 2</SelectItem>
                <SelectItem value="cluster3">Cluster 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="panchayat">Panchayat *</Label>
            <Select 
              value={formData.panchayat} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, panchayat: value }))}
              disabled={!formData.cluster}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Panchayat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="panchayat1">Panchayat 1</SelectItem>
                <SelectItem value="panchayat2">Panchayat 2</SelectItem>
                <SelectItem value="panchayat3">Panchayat 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 max-w-md mx-auto pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Update Village
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVillage;
