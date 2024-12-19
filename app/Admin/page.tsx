'use client';

import React from 'react';
import { AdminSideBar } from './_components/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SmallCard } from './_components/smallCard';
import { AdminChart } from './_components/adminChart';
import { RecentSales } from './_components/recentCustomer';

const AdminPage = () => {



  return (
    <div>
      <SmallCard />
      {/* Responsive Layout */}
      <div className="flex flex-col md:flex-row h-auto gap-4">
        {/* Recent Customers Section */}
        <div className="w-full md:w-1/2 bg-white">
          <h1 className="text-lg">Recent Customers</h1>
          <div className="py-1">
            <RecentSales />
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full md:w-1/2 bg-white">
          <h1 className="text-lg">In Chart</h1>
          <div className="py-1">
            <AdminChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
