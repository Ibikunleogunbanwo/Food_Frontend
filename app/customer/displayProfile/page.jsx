"use client";
import React, { useEffect, useState } from 'react';
import { Camera, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from "@/app/context/Formcontext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import withAuth from '@/hooks/withAuth';

const DisplayProfilePage = ({ user, isAuthenticated }) => {
  const { formData, setFormData } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Load user profile from localStorage on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      setFormData(JSON.parse(storedUser));
    } else if (isAuthenticated && user) {
      setFormData(user);
    }
  }, [isAuthenticated, user, setFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : ''}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();
      console.log('Updated profile:', data);

      // Store updated user profile in localStorage
      localStorage.setItem('userProfile', JSON.stringify(data.user));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profile_image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <Button
        onClick={() => router.push('/restaurant')}
        className="flex items-center gap-2 mb-6 text-white transition-all duration-300 transform bg-orange-500 hover:bg-orange-600 hover:scale-105"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Restaurant
      </Button>

      {isAuthenticated ? (
        <Card className="w-full transition-all duration-300 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl">
          <CardHeader className="border-b border-orange-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-orange-800">Profile Information</CardTitle>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className={`transition-all duration-300 transform hover:scale-105 ${
                  isEditing 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                    : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                }`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Section */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="flex items-center justify-center w-32 h-32 overflow-hidden transition-all duration-300 border-4 border-orange-200 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 group-hover:shadow-lg">
                    {formData.profile_image ? (
                      <img 
                        src={formData.profile_image} 
                        alt="Profile" 
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative animate-pulse">
                        <Camera className="w-12 h-12 text-orange-400 animate-bounce" />
                        <div className="absolute inset-0 bg-orange-300 rounded-full opacity-20 blur-md"></div>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 text-white transition-all duration-300 transform bg-orange-500 rounded-full cursor-pointer hover:bg-orange-600 hover:scale-110 hover:rotate-12">
                      <Camera className="w-4 h-4" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {['firstname', 'lastname', 'email', 'phone'].map((field) => (
                  <div key={field} className="space-y-2 group">
                    <Label htmlFor={field} className="font-semibold text-black">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      value={formData[field] || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="font-semibold text-black bg-white border-orange-200 disabled:bg-orange-50 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                ))}
              </div>

              {/* Address Information */}
              <div className="p-6 space-y-4 bg-white rounded-lg shadow-md">
                <h3 className="pb-2 text-lg font-semibold text-orange-800 border-b border-orange-200">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {['apartment_number', 'street_address', 'city', 'province', 'postalcode', 'country'].map((field) => (
                    <div key={field} className="space-y-2 group">
                      <Label htmlFor={field} className="font-semibold text-black">
                        {field.replace('_', ' ').toUpperCase()}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={formData[field] || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="font-semibold text-black bg-white border-orange-200 disabled:bg-orange-50 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="p-8 text-center text-orange-800 rounded-lg shadow-md bg-orange-50">
          You must be logged in to view your profile.
        </div>
      )}
    </div>
  );
};

export default DisplayProfilePage;
