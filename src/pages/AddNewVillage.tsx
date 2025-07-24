
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { apiClient, type BlockGramPanchayatData } from '../lib/api';
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
    panchayat: '',
    population: ''
  });
  const [loading, setLoading] = useState(false);
  const [blocksData, setBlocksData] = useState<BlockGramPanchayatData[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlocksData = async () => {
      try {
        setLoadingBlocks(true);
        const response = await apiClient.getBlocksGramPanchayats();
        if (response.success) {
          console.log('Blocks data received:', response.data);
          setBlocksData(response.data);
        }
      } catch (error) {
        console.error('Error fetching blocks data:', error);
        toast({
          title: "Error",
          description: "Failed to load blocks data",
          variant: "destructive",
        });
      } finally {
        setLoadingBlocks(false);
      }
    };

    fetchBlocksData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    // Check if required fields are filled
    if (!formData.villageName || !formData.block || !formData.panchayat) {
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
        panchayat: formData.panchayat,
        population: parseInt(formData.population) || 0
      });
      
      const response = await apiClient.createVillage({
        name: formData.villageName,
        district: formData.district,
        state: formData.state,
        block: formData.block,
        gramPanchayat: formData.panchayat,
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
            <Select 
              value={formData.block} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, block: value, panchayat: '' }))}
              disabled={loadingBlocks}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={loadingBlocks ? "Loading blocks..." : "Select Block"} />
              </SelectTrigger>
              <SelectContent>
                {blocksData.map((blockData) => (
                  <SelectItem key={blockData.block} value={blockData.block}>
                    {blockData.block}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="panchayat" className="font-bold">Gram Panchayat *</Label>
            <Select 
              value={formData.panchayat} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, panchayat: value }))}
              disabled={!formData.block}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={!formData.block ? "Select Block first" : "Select Gram Panchayat"} />
              </SelectTrigger>
              <SelectContent>
                {formData.block && 
                  blocksData
                    .find(blockData => blockData.block === formData.block)
                    ?.gramPanchayat?.filter(panchayat => typeof panchayat === 'string')
                    .map((panchayat) => (
                      <SelectItem key={panchayat} value={panchayat}>
                        {panchayat}
                      </SelectItem>
                    ))
                }
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
