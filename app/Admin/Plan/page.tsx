import React from 'react'
import SeachBar from './_components/serchBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import PlansTable from './_components/plansTable'
import { Input } from '@/components/ui/input'

const PlansPage = () => {
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
         
        className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Plan</span>
        </Button>
      </div>
      {/* <AddCustomerDialog visible={dialogVisible} onClose={closeDialog}/> */}
    </div>

    {/* Table for users data display */}
    <div className="relative overflow-x-auto py-6">
      
        <PlansTable/>
      
    </div>
  </div>

  )
}

export default PlansPage