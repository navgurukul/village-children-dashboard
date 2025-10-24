
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { apiClient, User } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface EditUserProps {
  userData: User | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditUser = ({ userData, onCancel, onSuccess }: EditUserProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: '',
    block: '',
    panchayat: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Pre-populate form with user data when component mounts
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.name || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        role: userData.role || '',
        block: userData.block || '',
        panchayat: userData.panchayat || ''
      });
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;

    try {
      setLoading(true);
      const response = await apiClient.updateUser(userData.id, {
        name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "User updated successfully",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  if (!userData) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground">No user selected</p>
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
          <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
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
              required
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Role *</Label>
            <div className="flex gap-4 opacity-60 cursor-not-allowed">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="text-primary"
                  disabled
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
                  disabled
                />
                <span>Bal Mitra</span>
              </label>
            </div>
          </div>

          {/* Conditional Bal Mitra Fields */}
          {formData.role === 'balMitra' && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20 opacity-60">
              <h3 className="font-medium text-foreground">Village Assignment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="block">Block</Label>
                  <Select value={formData.block} onValueChange={(value) => setFormData(prev => ({ ...prev, block: value }))} disabled>
                    <SelectTrigger className="cursor-not-allowed">
                      <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jharia">Jharia</SelectItem>
                      <SelectItem value="Rajgangpur">Rajgangpur</SelectItem>
                      <SelectItem value="block1">Block 1</SelectItem>
                      <SelectItem value="block2">Block 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panchayat">Panchayat</Label>
                  <Select value={formData.panchayat} onValueChange={(value) => setFormData(prev => ({ ...prev, panchayat: value }))} disabled>
                    <SelectTrigger className="cursor-not-allowed">
                      <SelectValue placeholder="Select Panchayat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sijua">Sijua</SelectItem>
                      <SelectItem value="panchayat1">Panchayat 1</SelectItem>
                      <SelectItem value="panchayat2">Panchayat 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update User Details'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
