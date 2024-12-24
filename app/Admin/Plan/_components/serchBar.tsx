import { Input } from '@/components/ui/input'
import React from 'react'

const SeachBar = () => {
  return (
    <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <Input
      type="search"
      placeholder="Search Plan..."
      className="w-full sm:w-[80px] md:w-[140px] lg:w-[600px]"
    />
    </div>
  )
}

export default SeachBar