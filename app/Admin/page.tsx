'use client';

import React from 'react'; 
import { AdminSideBar } from './_components/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const AdminPage = () => {
 


  return (
    <div className="flex h-screen">
      {/* <SidebarProvider>
        <AdminSideBar />
        <main className="flex-1 p-4">
          <SidebarTrigger />
           
        </main>
      </SidebarProvider> */}
    </div>
  );
};

export default AdminPage;
