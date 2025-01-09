// app/Admin/layout.tsx
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReceptionSideBar } from "./_components/receptionSideBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <ReceptionSideBar />
                <SidebarTrigger
                    size="sm"
                    className="bg-yellow-500 text-white hover:bg-yellow-500"
                />
                <main className="flex-1 p-4">{children}

                </main>
            </SidebarProvider>
        </div>
    );
}
