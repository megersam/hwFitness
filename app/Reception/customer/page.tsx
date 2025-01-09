'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { AddCustomerDialog } from './_components/AddCustomerDialog';
import CustomerTable from './_components/CustomerTable';
 
import withAuth from '@/lib/withAuth';
const CustomersPage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);


  const handleAddCustomerClick = () => setDialogVisible(true);
  const closeDialog = () => setDialogVisible(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
  const refreshCustomer = () => setShouldRefresh((prev) => !prev);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Search Input */}
      <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        

        {/* Button for adding customers */}
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <Button
            onClick={handleAddCustomerClick}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-md"
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </Button>

        </div>
        <AddCustomerDialog 
        visible={dialogVisible}
        onCustomerAdded={refreshCustomer} 
        onClose={closeDialog} />
      </div>

      {/* Table for users data display */}
      <div className="relative overflow-x-auto py-6 ">

        <CustomerTable shouldRefresh={shouldRefresh}/>

      </div>
    </div>
  );
};

export default CustomersPage;
