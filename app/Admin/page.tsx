import React from 'react'
import { AdminSideBar } from './components/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const AdminPage = () => {
  return (
    <div>
         <SidebarProvider>
            <AdminSideBar />
            <main>
              <SidebarTrigger />
             
            </main>
          </SidebarProvider>
    </div>
  )
}

export default AdminPage