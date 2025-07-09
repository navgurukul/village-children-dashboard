
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface AddNewVillageProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddNewVillage = ({ onCancel, onSuccess }: AddNewVillageProps) => {
  const [formData, setFormData] = useState({
    villageName: '',
    district: 'Dhanbad',
    state: 'Jharkhand',
    block: '',
    cluster: '',
    panchayat: '',
    population: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    // Check if required fields are filled
    if (!formData.villageName || !formData.block || !formData.cluster || !formData.panchayat) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log('Calling API with payload:', {
        name: formData.villageName,
        district: formData.district,
        state: formData.state,
        block: formData.block,
        cluster: formData.cluster,
        panchayat: formData.panchayat,
        population: parseInt(formData.population) || 0
      });
      
      const response = await apiClient.createVillage({
        name: formData.villageName,
        district: formData.district,
        state: formData.state,
        block: formData.block,
        cluster: formData.cluster,
        panchayat: formData.panchayat,
        population: parseInt(formData.population) || 0
      });

      console.log('API Response:', response);

      if (response.success) {
        toast({
          title: "Success",
          description: "Village created successfully",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating village:', error);
      toast({
        title: "Error",
        description: "Failed to create village",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Add New Village</h1>
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
            <Label htmlFor="block" className="font-bold">Block *</Label>
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
            <Label htmlFor="cluster" className="font-bold">Cluster *</Label>
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
            <Label htmlFor="panchayat" className="font-bold">Panchayat *</Label>
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
              {loading ? 'Adding...' : 'Add Village'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewVillage;
