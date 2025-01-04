'use client';

import React from 'react';
import { AdminSideBar } from './_components/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SmallCard } from './_components/smallCard';
import { AdminChart } from './_components/adminChart'; 
import withAuth from '@/lib/withAuth'
import { RecentSales } from './_components/recentCustomer';
import { PaymentStatus } from './_components/payment';

const AdminPage = () => {



  return (
    <div className="bg-[#1E1E20] text-white min-h-screen p-4">
      <SmallCard />
      {/* Responsive Layout */}
      <div className="flex flex-col md:flex-row h-auto gap-4">
        {/* Recent Customers Section */}
        <div className="w-full md:w-1/2 bg-[#2A2A2C] p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold">Inactive Subscribers</h1>
          <div className="py-1">
            <RecentSales />
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full md:w-1/2 bg-[#2A2A2C] p-4 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold">Payment Request</h1>
          <div className="py-1">
            <PaymentStatus />
          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminPage;