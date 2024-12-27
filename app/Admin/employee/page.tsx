'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import EmployeeCard from './_components/employeeCard';
import { AddEmployeeDialog } from './_components/addEmployee';
import EmployeeCardSkeleton from './_components/EmployeeCardSkeleton';

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
  imageUrl?: string; // Optional image URL
}

const EmployeePage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/users'); // Update this to your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        const data = await response.json();
        setEmployees(data.users || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployeeClick = () => setDialogVisible(true);
  const closeDialog = () => setDialogVisible(false);

  // Function to add a new employee to the list without re-fetching
  const handleNewEmployee = (newEmployee: Employee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      employee.firstName.toLowerCase().includes(searchLower) ||
      employee.lastName.toLowerCase().includes(searchLower) ||
      employee.phoneNumber.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <EmployeeCardSkeleton />
        <EmployeeCardSkeleton />
        <EmployeeCardSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Employee..."
          className="w-full sm:w-[80px] md:w-[140px] lg:w-[600px]"
        />

        <div className="mt-4 sm:mt-0 sm:ml-4">
          <Button onClick={handleAddEmployeeClick} className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Employee</span>
          </Button>
        </div>
        <AddEmployeeDialog visible={dialogVisible} onClose={closeDialog} />
      </div>
      <div className="relative overflow-x-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee._id} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
