import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import React from 'react'

const CustomersPage = () => {
  return (
    <div>
      <div className='py-8'>
        <Input
          type="search"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[900px]"
        />
      </div>

      {/* Button for adding customers */}
      <div className="absolute  right-10">
        <Button>
          <Plus size="lg" />
          Add Customer
        </Button>
      </div>

      {/* Table for users data display. */}
    </div>
  )
}

export default CustomersPage