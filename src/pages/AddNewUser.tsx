import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useToast } from "@/hooks/use-toast";

interface AddNewUserProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const AddNewUser = ({ onCancel, onSuccess }: AddNewUserProps) => {
  // Form now only creates Admin users
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    // Email is optional; validate only if user provided one
    if (formData.email && formData.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Valid 10-digit mobile number is required';
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
        role: 'admin',
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
          if (detail.includes("email")) {
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
          <h1 className="text-3xl font-bold text-foreground">Add New Admin</h1>
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
              <Label htmlFor="email">Email (optional)</Label>
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

          {/* Actions */}
          <div className="flex justify-center gap-4 max-w-md mx-auto pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Add Admin'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
