
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { apiClient, BlockGramPanchayatData } from '../lib/api';
import { useToast } from "@/hooks/use-toast";

interface AddNewUserProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddNewUser = ({ onCancel, onSuccess }: AddNewUserProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: '',
    block: '',
    panchayat: ''
  });
  const [blocksData, setBlocksData] = useState<BlockGramPanchayatData[]>([]);
  const [availableGramPanchayats, setAvailableGramPanchayats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch blocks and gram panchayats data
  useEffect(() => {
    const fetchBlocksData = async () => {
      try {
        const response = await apiClient.getBlocksGramPanchayats();
        if (response.success) {
          setBlocksData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch blocks data:', error);
      }
    };

    fetchBlocksData();
  }, []);

  // Update available gram panchayats when block changes
  useEffect(() => {
    if (formData.block) {
      const selectedBlockData = blocksData.find(block => block.block === formData.block);
      setAvailableGramPanchayats(selectedBlockData?.gramPanchayat || []);
      // Reset panchayat selection when block changes
      setFormData(prev => ({ ...prev, panchayat: '' }));
    } else {
      setAvailableGramPanchayats([]);
    }
  }, [formData.block, blocksData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userData = {
        name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
        ...(formData.role === 'balMitra' && {
          block: formData.block,
          gramPanchayat: formData.panchayat,
        }),
      };

      const response = await apiClient.createUser(userData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "User created successfully",
        });
        onSuccess();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      let errorMessage = "Failed to create user";
      
      // Check if it's an API error with specific message
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-foreground">Add New User</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter full name"
                className="bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
              placeholder="Enter mobile number"
              className="bg-white"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Role *</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="text-primary"
                />
                <span>Admin</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="balMitra"
                  checked={formData.role === 'balMitra'}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="text-primary"
                />
                <span>Bal Mitra</span>
              </label>
            </div>
          </div>

          {/* Conditional Bal Mitra Fields */}
          {formData.role === 'balMitra' && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
              <h3 className="font-medium text-foreground">Village Assignment</h3>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="block" className="font-bold">Block *</Label>
                  <Select value={formData.block} onValueChange={(value) => setFormData(prev => ({ ...prev, block: value }))}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Block" />
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
                      <SelectValue placeholder="Select Gram Panchayat" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGramPanchayats.map((gramPanchayat) => (
                        <SelectItem key={gramPanchayat} value={gramPanchayat}>
                          {gramPanchayat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4 max-w-md mx-auto pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Add User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
