import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient, type BlockGramPanchayatData } from '../lib/api';

interface AddNewGramPanchayatProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// Rename VillageData to GramPanchayatVillageData
interface GramPanchayatVillageData {
  name: string;
  paras: { name: string }[];
}

const AddNewGramPanchayat = ({ onCancel, onSuccess }: AddNewGramPanchayatProps) => {
  const [formData, setFormData] = useState({
    gramPanchayatName: '',
    block: '',
    villages: [] as GramPanchayatVillageData[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [blocksData, setBlocksData] = useState<BlockGramPanchayatData[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(true);

  useEffect(() => {
    const fetchBlocksData = async () => {
      try {
        setLoadingBlocks(true);
        const response = await apiClient.getBlocksGramPanchayats();
        if (response.success) {
          setBlocksData(response.data);
        }
      } catch (error) {
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

  // Add/Remove Villages (now Gram Panchayat Villages)
  const addVillage = () => {
    setFormData(prev => ({ ...prev, villages: [...prev.villages, { name: '', paras: [] }] }));
  };
  const removeVillage = (idx: number) => {
    setFormData(prev => ({ ...prev, villages: prev.villages.filter((_, i) => i !== idx) }));
  };
  // Add/Remove Paras
  const addPara = (villageIdx: number) => {
    setFormData(prev => {
      const villages = [...prev.villages];
      villages[villageIdx].paras.push({ name: '' });
      return { ...prev, villages };
    });
  };
  const removePara = (villageIdx: number, paraIdx: number) => {
    setFormData(prev => {
      const villages = [...prev.villages];
      villages[villageIdx].paras = villages[villageIdx].paras.filter((_, i) => i !== paraIdx);
      return { ...prev, villages };
    });
  };

  // Handle field changes
  const handleVillageChange = (idx: number, value: string) => {
    setFormData(prev => {
      const villages = [...prev.villages];
      villages[idx].name = value;
      return { ...prev, villages };
    });
  };
  const handleParaChange = (villageIdx: number, paraIdx: number, value: string) => {
    setFormData(prev => {
      const villages = [...prev.villages];
      villages[villageIdx].paras[paraIdx].name = value;
      return { ...prev, villages };
    });
  };

  // Validation and submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.gramPanchayatName.trim()) newErrors.gramPanchayatName = 'Gram Panchayat name is required';
    if (!formData.block) newErrors.block = 'Block is required';
    formData.villages.forEach((v, i) => {
      if (!v.name.trim()) newErrors[`villageName_${i}`] = 'Village name is required';
      v.paras.forEach((p, j) => {
        if (!p.name.trim()) newErrors[`paraName_${i}_${j}`] = 'Para name is required';
      });
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({ title: "Validation Error", description: "Please fix the errors in the form.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const payload = {
      name: formData.gramPanchayatName,
      block: formData.block,
      villages: formData.villages.map(v => ({
        name: v.name,
        paras: v.paras.map(p => ({ name: p.name }))
      }))
    };
    try {
      const response = await apiClient.createGramPanchayat(payload);
      if (response.success) {
        toast({ title: "Success", description: "Gram Panchayat created successfully" });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create Gram Panchayat.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create Gram Panchayat.",
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
          <Button onClick={onCancel} variant="link" className="gap-2 p-0 h-auto">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Add New Gram Panchayat</h1>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gramPanchayatName">Gram Panchayat Name *</Label>
            <Input
              id="gramPanchayatName"
              type="text"
              value={formData.gramPanchayatName}
              onChange={e => setFormData(prev => ({ ...prev, gramPanchayatName: e.target.value }))}
              placeholder="Enter Gram Panchayat name"
              className={`bg-white${errors.gramPanchayatName ? ' border-2 border-red-500' : ''}`}
              autoComplete="off"
            />
            {errors.gramPanchayatName && <p className="text-red-500 text-xs mt-1">{errors.gramPanchayatName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="block">Block *</Label>
            <Select
              value={formData.block}
              onValueChange={value => setFormData(prev => ({ ...prev, block: value }))}
              disabled={loadingBlocks}
            >
              <SelectTrigger className={`bg-white${errors.block ? ' border-2 border-red-500' : ''}`} id="block">
                <SelectValue placeholder={loadingBlocks ? "Loading blocks..." : "Select Block"} />
              </SelectTrigger>
              <SelectContent>
                {blocksData.map(blockObj => (
                  <SelectItem key={blockObj.block} value={blockObj.block}>{blockObj.block}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.block && <p className="text-red-500 text-xs mt-1">{errors.block}</p>}
          </div>
          {/* Villages Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Villages</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVillage} className="gap-2">
                <Plus className="h-4 w-4" /> Add Village
              </Button>
            </div>
            {formData.villages.map((village, vIdx) => (
              <div key={vIdx} className="border rounded-lg p-4 mt-2 bg-muted/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="flex-1">Village Name</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeVillage(vIdx)} title="Remove Village">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  type="text"
                  value={village.name}
                  onChange={e => handleVillageChange(vIdx, e.target.value)}
                  placeholder="Village name"
                  className={`bg-white${errors[`villageName_${vIdx}`] ? ' border-2 border-red-500' : ''}`}
                />
                {errors[`villageName_${vIdx}`] && <p className="text-red-500 text-xs mt-1">{errors[`villageName_${vIdx}`]}</p>}
                {/* Paras Section */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <Label>Paras</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addPara(vIdx)} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Para
                    </Button>
                  </div>
                  {village.paras.map((para, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 mt-1">
                      <Input
                        type="text"
                        value={para.name}
                        onChange={e => handleParaChange(vIdx, pIdx, e.target.value)}
                        placeholder="Enter para name"
                        className={`bg-white${errors[`paraName_${vIdx}_${pIdx}`] ? ' border-2 border-red-500' : ''}`}
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removePara(vIdx, pIdx)} title="Remove Para">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Actions */}
          <div className="flex justify-center gap-4 max-w-md mx-auto pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Gram Panchayat'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewGramPanchayat;
