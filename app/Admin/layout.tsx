// app/Admin/layout.tsx
import React from "react";
import { AdminSideBar } from "./_components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <AdminSideBar />
                <SidebarTrigger/>
                <main className="flex-1 p-4">{children}
                    
                </main>
            </SidebarProvider>
        </div>
    );
}
