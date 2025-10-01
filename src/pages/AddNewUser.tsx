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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
      const gramPanchayatNames = selectedBlockData?.gramPanchayats || [];
      setAvailableGramPanchayats(gramPanchayatNames);
      // Reset panchayat selection when block changes
      setFormData(prev => ({ ...prev, panchayat: '' }));
    } else {
      setAvailableGramPanchayats([]);
    }
  }, [formData.block, blocksData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Valid 10-digit mobile number is required';
    }
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    if (formData.role === 'balMitra') {
      if (!formData.block) {
        newErrors.block = 'Block is required';
      }
      if (!formData.panchayat) {
        newErrors.panchayat = 'Gram Panchayat is required';
      }
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
        const errorDetails = response.message ? [response.message] : [];
        const apiErrors: { [key: string]: string } = {};

        errorDetails.forEach((detail: string) => {
          if (detail.includes("block")) {
            apiErrors.block = detail;
          } else if (detail.includes("panchayat")) {
            apiErrors.panchayat = detail;
          } else if (detail.includes("email")) {
            apiErrors.email = detail;
          } else if (detail.includes("mobile")) {
            apiErrors.mobile = detail;
          }
        });

        setErrors(apiErrors);
        toast({
          title: "Error",
          description: response.message || "Please fix the errors in the form.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      let errorMessage = "Failed to create user";

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
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, fullName: value }));
                  if (errors.fullName) {
                    setErrors(prev => ({ ...prev, fullName: '' }));
                  }
                }}
                placeholder="Enter full name"
                className={`bg-white${errors.fullName ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, email: value }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="Enter email address"
                className={`bg-white${errors.email ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
                if (value.length <= 10) { // Limit to 10 digits
                  setFormData(prev => ({ ...prev, mobile: value }));
                }
                if (errors.mobile) {
                  setErrors(prev => ({ ...prev, mobile: '' }));
                }
              }}
              maxLength={10} // Ensure max length is 10 digits
              placeholder="Enter mobile number"
              className={`bg-white${errors.mobile ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, role: e.target.value }));
                    if (errors.role) {
                      setErrors(prev => ({ ...prev, role: '' }));
                    }
                  }}
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, role: e.target.value }));
                    if (errors.role) {
                      setErrors(prev => ({ ...prev, role: '' }));
                    }
                  }}
                  className="text-primary"
                />
                <span>Bal Mitra</span>
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>

          {/* Conditional Bal Mitra Fields */}
          {formData.role === 'balMitra' && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
              <h3 className="font-medium text-foreground">Village Assignment</h3>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="block" className="font-bold">Block *</Label>
                  <Select value={formData.block} onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, block: value }));
                    if (errors.block) {
                      setErrors(prev => ({ ...prev, block: '' }));
                    }
                  }}>
                    <SelectTrigger className={`bg-white${errors.block ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}>
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
                  {errors.block && <p className="text-red-500 text-sm">{errors.block}</p>}
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
                    <SelectTrigger className={`bg-white${errors.panchayat ? ' border-2 border-red-500 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2' : ''}`}>
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
                  {errors.panchayat && <p className="text-red-500 text-sm">{errors.panchayat}</p>}
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
