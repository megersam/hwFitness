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
import { useEffect, useState } from 'react'
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

interface Employee {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  sex: string;
  phoneNumber: string;
  role: string;
  email: string;
  password: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}
interface ViewEmployeeProps {
  visible: boolean;
  onClose: () => void;
  selectedEmployee: Employee | null; // Accept selected employee data
  onEmployeeEdited: (newEmployee: any) => void;
}

export function ViewEmployeeDialog({ visible, onClose, selectedEmployee, onEmployeeEdited }: ViewEmployeeProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '',
    phoneNumber: '',
    role: '',
    email: '', 
    status: '',
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        firstName: selectedEmployee.firstName,
        middleName: selectedEmployee.middleName,
        lastName: selectedEmployee.lastName,
        sex: selectedEmployee.sex,
        phoneNumber: selectedEmployee.phoneNumber,
        role: selectedEmployee.role,
        email: selectedEmployee.email,
       
        status: selectedEmployee.status ? 'Active' : 'Inactive',
      });
    }
  }, [selectedEmployee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Ensure the status is sent as a boolean (false) instead of "Inactive"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      ...formData,
      status: formData.status === "Inactive" ? false : true, // Correct the status field
    };

    try {
      const response = await axios.put(`/api/users/${selectedEmployee?._id}`, updatedData);
      toast.success("Employee updated successfully!");
      onEmployeeEdited(response.data.user);
      handleCancel();
      onClose();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      onClose();
    }

    setLoading(false);
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
      status: '',
    });
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] w-full bg-white p-8 rounded-lg shadow-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-900">Edit Employee</DialogTitle>
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
              <Label htmlFor="sex" className="font-medium text-gray-700">Status</Label>
              <Select
                name="status"
                value={formData.status}  // Required to bind selected value
                onValueChange={(value) => setFormData({ ...formData, status: value })}  // Update state when a value is selected
                required
              >
                <SelectTrigger className="w-full mt-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
            className="relative py-2 px-6 text-sm font-medium text-white bg-yellow-500 text-white hover:bg-yellow-600 border-blue-500 rounded-md"
          >
            {loading && (
              <Loader size="35px" className="animate-spin" />
            )}
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}