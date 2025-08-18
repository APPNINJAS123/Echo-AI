"use client";

import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardTrial } from "./dashboard-trial";

const firstSection=[
    {
        icon:VideoIcon,
        label:"Meetings",
        href:"/meetings",
    },
    {
        icon:BotIcon,
        label:"Agents",
        href:"/agents",
    },
    
]
const secondSection=[
    {
        icon:StarIcon,
        label:"Upgrade",
        href:"/upgrade",
    },
    
    
]
export const DashboardSidebar = () => {
    const pathname=usePathname()
    return(
        <Sidebar >
            <SidebarHeader className="text-sidebar-accent-foreground">
                <Link href='/' className='flex items-center gap-2 px-2 pt-2'>
                <Image src='/logo.svg' height={36} width={36} alt="MeetOS"/>
                <p className="text-2xl font-semibold">MeetOS</p>
                
                </Link>

            </SidebarHeader >
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]"/>

            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((items)=>(
                                <SidebarMenuItem key={items.href} >
                                    <SidebarMenuButton asChild className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50", pathname ===items.href && "bg-linear-to-r/oklch border-[#5D6B68]/10")} isActive={pathname === items.href}>
                                        <Link href={items.href}>
                                        <items.icon className="size-5"/>
                                        <span className="text-sm font-medium tracking-tight">
                                            {items.label}
                                        </span>
                                        
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B68]"/>

            </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((items)=>(
                                <SidebarMenuItem key={items.href} >
                                    <SidebarMenuButton asChild className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50", pathname ===items.href && "bg-linear-to-r/oklch border-[#5D6B68]/10")} isActive={pathname === items.href}>
                                        <Link href={items.href}>
                                        <items.icon className="size-5"/>
                                        <span className="text-sm font-medium tracking-tight">
                                            {items.label}
                                        </span>
                                        
                                        </Link>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white ">
                <DashboardTrial/>
                <DashboardUserButton/>

            </SidebarFooter>
        </Sidebar>
    )
}