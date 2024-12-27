'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-toastify"
import axios from "axios"
import { Loader } from "lucide-react"

interface AddEmployeeProps {
  visible: boolean;
  onClose: () => void;
}

export function AddEmployeeDialog({ visible, onClose }: AddEmployeeProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '', 
    phoneNumber: '',
    role: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState<boolean>(false); // Track loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // components/AddEmployeeDialog.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start the loading state

    try {
      const response = await axios.post("/api/auth", formData);
      toast.success(response.data.message); // Show success toast
    } catch (error: any) {
      // Check for error message from the API response
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Show error toast
      } else {
        toast.error("Something went wrong. Please try again."); // Generic error
      }
    }
    setLoading(false); // End the loading state
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      sex: '', 
      phoneNumber: '',
      role: '',
      email: '',
      password: '',
    });
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-full bg-white p-8 rounded-lg shadow-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-900">Add Employee</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 py-4 flex flex-col items-center justify-center"
        >
          {/* First Row: Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col">
              <Label htmlFor="firstName" className="font-medium text-gray-700">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="middleName" className="font-medium text-gray-700">Middle Name</Label>
              <Input
                type="text"
                name="middleName"
                id="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="lastName" className="font-medium text-gray-700">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Second Row: Sex, Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <Label htmlFor="sex" className="font-medium text-gray-700">Sex</Label>
              <Select
                name="sex"
                value={formData.sex}  // Required to bind selected value
                onValueChange={(value) => setFormData({ ...formData, sex: value })}  // Update state when a value is selected
                required
              >
                <SelectTrigger className="w-full mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select Sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label htmlFor="phoneNumber" className="font-medium text-gray-700">Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Third Row: Role, Email, Password */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col">
              <Label htmlFor="role" className="font-medium text-gray-700">Role</Label>
              <Select
                name="role"
                value={formData.role}  // Required to bind selected value
                onValueChange={(value) => setFormData({ ...formData, role: value })}  // Update state when a value is selected
                required
              >
                <SelectTrigger className="w-full mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Reception">Reception</SelectItem>
                  <SelectItem value="Trainer">Trainer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <Label htmlFor="email" className="font-medium text-gray-700">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </form>

        {/* Footer with Cancel and Submit Buttons */}
        <DialogFooter className="space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="py-2 px-6 text-sm font-medium text-gray-600 border border-gray-300 rounded-md"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading} // Disable button while loading
            className="relative"
          >
            {loading && (
              <Loader size="35px" className="animate-spin" />
            )}
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
