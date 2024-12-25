'use client'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React, { useState } from 'react'
import { AddPriceDialog } from './_components/addPrice';
import PriceTable from './_components/priceTable';

const PriceingPage = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
    
      const handleAddPriceClick = () => setDialogVisible(true);
      const closeDialog = () => setDialogVisible(false);


        // Function to refresh prices in the table
  const refreshPrices = () => setShouldRefresh((prev) => !prev); // Toggle to trigger re-fetch in PriceTable

  return (
    <div className="px-4 sm:px-6 lg:px-8">
    {/* Search Input */}
    <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      {/* <Input
        type="search"
        placeholder="Search..."
        className="w-full sm:w-[80px] md:w-[140px] lg:w-[600px]"
      /> */}
      
      {/* Button for adding customers */}
      <div className="mt-4 sm:mt-0 sm:ml-4">
        <Button 
         onClick={handleAddPriceClick}
        className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Price</span>
        </Button>
      </div>
      <AddPriceDialog
       visible={dialogVisible}
       onPriceAdded={refreshPrices}
        onClose={closeDialog}/>
    </div>

    {/* Table for users data display */}
    <div className="relative overflow-x-auto py-6">
      
        <PriceTable shouldRefresh={shouldRefresh} />
      
    </div>
  </div>
  )
}

export default PriceingPage