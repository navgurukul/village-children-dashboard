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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    const newErrors: { [key: string]: string } = {};
    // Validate fields
    if (!formData.villageName.trim()) {
      newErrors.villageName = 'Village name is required';
    }
    if (!formData.block) {
      newErrors.block = 'Block is required';
    }
    if (!formData.panchayat) {
      newErrors.panchayat = 'Gram Panchayat is required';
    }
    if (formData.population && (!/^[0-9]+$/.test(formData.population) || parseInt(formData.population) < 0)) {
      newErrors.population = 'Population must be a positive number';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await apiClient.createVillage({
        name: formData.villageName,
        district: formData.district,
        state: formData.state,
        block: formData.block,
        gramPanchayat: formData.panchayat,
        population: parseInt(formData.population) || 0
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Village created successfully",
        });
        onSuccess();
      } else {
        const errorMessage = response.message || "Please fix the errors in the form.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
    } catch (error: any) {
  console.error('Error creating village:', error);
  let errorMsg = "Failed to create village";
  // Backend error details show karo agar mil jaye
  if (error?.response?.data?.error?.details?.[0]) {
    errorMsg = error.response.data.error.details[0];
  }
  toast({
    title: "Error",
    description: errorMsg,
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
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, villageName: value }));
                if (errors.villageName) {
                  setErrors(prev => ({ ...prev, villageName: '' }));
                }
              }}
              placeholder="Enter village name"
              className={`bg-white${errors.villageName && !formData.villageName.trim() ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}
              autoComplete="off"
            />
            {/* Show error only if not editing and error exists */}
            {errors.villageName && !formData.villageName.trim() && document.activeElement?.id !== 'villageName' && (
              <p className="text-red-500 text-xs mt-1">{errors.villageName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="block" className="font-bold">Block *</Label>
            <Select 
              value={formData.block} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, block: value, panchayat: '' }));
                if (errors.block) {
                  setErrors(prev => ({ ...prev, block: '' }));
                }
              }}
              disabled={loadingBlocks}
            >
              <SelectTrigger className={`bg-white${errors.block && !formData.block ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}>
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
            {/* Show error only if not editing and error exists */}
            {errors.block && !formData.block && document.activeElement?.id !== 'block' && (
              <p className="text-red-500 text-xs mt-1">{errors.block}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="panchayat" className="font-bold">Gram Panchayat *</Label>
            <Select 
              value={formData.panchayat} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, panchayat: value }));
                if (errors.panchayat) {
                  setErrors(prev => ({ ...prev, panchayat: '' }));
                }
              }}
              disabled={!formData.block}
            >
              <SelectTrigger className={`bg-white${errors.panchayat && !formData.panchayat ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}>
                <SelectValue placeholder={!formData.block ? "Select Block first" : "Select Gram Panchayat"} />
              </SelectTrigger>
              <SelectContent>
                {formData.block && 
                  blocksData
                    .find(blockData => blockData.block === formData.block)
                    ?.gramPanchayats?.map((panchayatName) => (
                      <SelectItem key={panchayatName} value={panchayatName}>
                        {panchayatName}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
            {/* Show error only if not editing and error exists */}
            {errors.panchayat && !formData.panchayat && document.activeElement?.id !== 'panchayat' && (
              <p className="text-red-500 text-xs mt-1">{errors.panchayat}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="population">Population</Label>
            <Input
              id="population"
              type="number"
              value={formData.population}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({ ...prev, population: value }));
                if (errors.population) {
                  setErrors(prev => ({ ...prev, population: '' }));
                }
              }}
              placeholder="Enter population"
              className={`bg-white${errors.population && (!formData.population || !/^[0-9]+$/.test(formData.population) || parseInt(formData.population) < 0) ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}
            />
            {/* Show error only if not editing and error exists */}
            {errors.population && (!formData.population || !/^[0-9]+$/.test(formData.population) || parseInt(formData.population) < 0) && document.activeElement?.id !== 'population' && (
              <p className="text-red-500 text-xs mt-1">{errors.population}</p>
            )}
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
