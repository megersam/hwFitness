import { Calendar, ChevronUp, Currency, Home, Inbox, PersonStanding, PersonStandingIcon, Search, Settings, Subtitles, User2, UserRoundCheck } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Customers",
        url: "#",
        icon: PersonStanding,
    },
    {
        title: "Employee",
        url: "#",
        icon: UserRoundCheck,
    },
    {
        title: "Plans",
        url: "#",
        icon: Subtitles,
    },
    {
        title: "Price",
        url: "#",
        icon: Currency,
    },
    {
        title: "Setting",
        url: "#",
        icon: Settings,
    },
]

export function AdminSideBar() {
    return (
        
        <Sidebar className="h-screen">
    <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-semibold mb-8">
                <h1>HW Fitness</h1>
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="flex flex-col gap-6">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="w-full">
                            <SidebarMenuButton asChild>
                                <a
                                    href={item.url}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md hover:bg-gray-600 transition"
                                >
                                    <item.icon className="w-6 h-6" />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    </SidebarContent>
    
    <SidebarFooter className="mt-auto mb-4 px-4">
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="flex items-center gap-3 text-base font-medium">
                            <User2 className="w-6 h-6" /> Username
                            <ChevronUp className="ml-auto w-5 h-5" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="w-full">
                        <DropdownMenuItem>
                            <span>Account</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarFooter>
</Sidebar>

    )
}
