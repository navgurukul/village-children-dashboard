
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

interface EditUserProps {
  userId: number | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditUser = ({ userId, onCancel, onSuccess }: EditUserProps) => {
  const [formData, setFormData] = useState({
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    mobile: '9876543210',
    role: 'balMitra',
    block: 'Jharia',
    cluster: 'Sijua-1',
    panchayat: 'Sijua',
    villages: ['Haripur', 'Rampur', 'Lakshmipur']
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setLoading(true);
      const response = await apiClient.updateUser(userId.toString(), {
        name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
        block: formData.block,
        cluster: formData.cluster,
        panchayat: formData.panchayat
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

  const handleVillageSelection = (village: string) => {
    setFormData(prev => ({
      ...prev,
      villages: prev.villages.includes(village)
        ? prev.villages.filter(v => v !== village)
        : [...prev.villages, village]
    }));
  };

  const mockVillages = ['Haripur', 'Rampur', 'Lakshmipur', 'Govindpur', 'Shantipur', 'Village A', 'Village B'];

  if (!userId) {
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
          {formData.role === 'Bal Mitra' && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
              <h3 className="font-medium text-foreground">Village Assignment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="block">Block *</Label>
                  <Select value={formData.block} onValueChange={(value) => setFormData(prev => ({ ...prev, block: value }))}>
                    <SelectTrigger>
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
                  <Select value={formData.cluster} onValueChange={(value) => setFormData(prev => ({ ...prev, cluster: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cluster1">Cluster 1</SelectItem>
                      <SelectItem value="cluster2">Cluster 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panchayat">Panchayat *</Label>
                  <Select value={formData.panchayat} onValueChange={(value) => setFormData(prev => ({ ...prev, panchayat: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Panchayat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="panchayat1">Panchayat 1</SelectItem>
                      <SelectItem value="panchayat2">Panchayat 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Villages (Multi-select) *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                  {mockVillages.map((village) => (
                    <label key={village} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.villages.includes(village)}
                        onChange={() => handleVillageSelection(village)}
                        className="text-primary"
                      />
                      <span>{village}</span>
                    </label>
                  ))}
                </div>
                {formData.villages.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {formData.villages.join(', ')}
                  </p>
                )}
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
