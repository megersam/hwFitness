import React from 'react'
import SeachBar from './_components/serchBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import PlansTable from './_components/plansTable'

const PlansPage = () => {
  return (
    <div>
    <div className="px-4 sm:px-6 lg:px-8">
      
  
        {/* Button for adding Plans */}
        <div className="ml-4">
          <Button className="flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Plans</span>
          </Button>
        </div>
        <PlansTable/>
      </div>
   
  </div>
  
  )
}

export default PlansPage