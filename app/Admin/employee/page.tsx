import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import React from 'react'
import EmployeeCard from './_components/employeeCard'
import { employees } from './_components/employee';

const EmployeePage = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Search Input */}
      <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Search Employee..."
          className="w-full sm:w-[80px] md:w-[140px] lg:w-[600px]"
        />


        {/* Button for adding customers */}
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <Button

            className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>
      <div className='relative overflow-x-auto py-6'>
        {/* <EmployeeCard/> */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6'>
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </div>

  )
}

export default EmployeePage