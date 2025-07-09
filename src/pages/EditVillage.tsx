import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { apiClient, Village } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface EditVillageProps {
  villageId: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditVillage = ({ villageId, onCancel, onSuccess }: EditVillageProps) => {
  const [formData, setFormData] = useState({
    villageName: '',
    district: '',
    state: '',
    block: '',
    cluster: '',
    panchayat: '',
    population: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  // Load village data when component mounts
  useEffect(() => {
    if (villageId) {
      loadVillageData();
    }
  }, [villageId]);

  const loadVillageData = async () => {
    try {
      setLoadingData(true);
      // Since we don't have a get single village endpoint, we'll use mock data
      // In a real app, you'd have an endpoint like GET /villages/:id
      setFormData({
        villageName: 'Haripur',
        district: 'Dhanbad',
        state: 'Jharkhand',
        block: 'Jharia',
        cluster: 'Sijua-1',
        panchayat: 'Sijua',
        population: '2500'
      });
    } catch (error) {
      console.error('Error loading village data:', error);
      toast({
        title: "Error",
        description: "Failed to load village data",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageId) return;

    try {
      setLoading(true);
      const response = await apiClient.updateVillage(villageId, {
        name: formData.villageName,
        district: formData.district,
        state: formData.state,
        block: formData.block,
        cluster: formData.cluster,
        panchayat: formData.panchayat,
        population: parseInt(formData.population) || 0
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Village updated successfully",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating village:', error);
      toast({
        title: "Error",
        description: "Failed to update village",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  if (loadingData) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground">Loading village data...</p>
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
                <SelectItem value="Jharia">Jharia</SelectItem>
                <SelectItem value="Rajgangpur">Rajgangpur</SelectItem>
                <SelectItem value="Block 3">Block 3</SelectItem>
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
                <SelectItem value="Sijua-1">Sijua-1</SelectItem>
                <SelectItem value="Cluster 2">Cluster 2</SelectItem>
                <SelectItem value="Cluster 3">Cluster 3</SelectItem>
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
                <SelectItem value="Sijua">Sijua</SelectItem>
                <SelectItem value="Panchayat 2">Panchayat 2</SelectItem>
                <SelectItem value="Panchayat 3">Panchayat 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="population">Population</Label>
            <Input
              id="population"
              type="number"
              value={formData.population}
              onChange={(e) => setFormData(prev => ({ ...prev, population: e.target.value }))}
              placeholder="Enter population"
              className="bg-white"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 max-w-md mx-auto pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Village'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVillage;