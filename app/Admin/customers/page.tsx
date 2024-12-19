import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import React from 'react';
import { CustomersTable } from '../_components/customersTable';

const CustomersPage = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Search Input */}
      <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full sm:w-[80px] md:w-[140px] lg:w-[600px]"
        />
        
        {/* Button for adding customers */}
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Table for users data display */}
      <div className="relative overflow-x-auto py-6">
        <CustomersTable />
      </div>
    </div>
  );
};

export default CustomersPage;
