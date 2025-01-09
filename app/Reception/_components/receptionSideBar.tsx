'use client';
import {
    Calendar,
    ChevronUp,
    Currency,
    DollarSign,
    Home,
    Inbox,
    PersonStanding,
    Settings,
    Subtitles,
    User2,
    UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/Reception",
        icon: Home,
    },
    {
        title: "Customers",
        url: "/Reception/customers",
        icon: PersonStanding,
    },
    
    {
        title: "Subscription",
        url: "/Reception/SubscriptionAdmin",
        icon: Calendar,
    },
];

export function ReceptionSideBar() {
    const pathname = usePathname(); // Get the current route
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user="));
        const userData = cookie
            ? JSON.parse(decodeURIComponent(cookie.split("=")[1]))
            : null;
        console.log("User Data from Cookie:", userData);
        setUser(userData);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "GET" });
            document.cookie = "user=; Max-Age=0; path=/";
            window.location.href = "/Login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Sidebar className="h-screen bg-[#1E1E20]">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg font-semibold text-white mb-8">
                        <h1>HW Fitness</h1>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="flex flex-col gap-6">
                            {items.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title} className="w-full">
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                legacyBehavior
                                                shallow={true}
                                                prefetch={false}
                                            >
                                                <a
                                                    className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md transition ${isActive
                                                            ? "bg-yellow-500 text-white" // Active styles
                                                            : "hover:bg-yellow-500 hover:text-black text-white" // Hover styles
                                                        }`}
                                                >
                                                    <item.icon className="w-6 h-6" />
                                                    <span>{item.title}</span>
                                                </a>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="mt-auto mb-4 px-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="flex items-center gap-3 text-base font-medium text-white rounded-md transition hover:bg-yellow-500 hover:text-black">
                                    <User2 className="w-6 h-6" />{" "}
                                    {user?.firstName} {user?.middleName} {user?.lastName}
                                    <ChevronUp className="ml-auto w-5 h-5" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-full bg-[#1E1E20] text-white hover:bg-yellow-500"
                            >
                                <DropdownMenuItem className="hover:bg-yellow-500 hover:text-black transition">
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="hover:bg-yellow-500 hover:text-black transition"
                                >
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
