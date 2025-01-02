import { Button } from '@/components/ui/button'
import React from 'react'
import SubscriptionTable from './_components/subscriptionTabl'

function SubscriptioAdminPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
    {/* Search Input */}
    <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      

      
    </div>

    {/* Table for users data display */}
    <div className="relative overflow-x-auto py-6 ">

      <SubscriptionTable shouldRefresh={false}  />

    </div>
  </div>
  )
}

export default SubscriptioAdminPage