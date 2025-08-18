"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react"
import { DashboardCommand } from "./dashboard-command"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

export const DashboardNavbar = () => {
    const { theme, setTheme } = useTheme()
    const {state, toggleSidebar,isMobile}=useSidebar()
    const[commandOpen,setCommandOpen]=useState(false)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if(e.key==="k" && (e.ctrlKey||e.metaKey)) {
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);
        return() => document.removeEventListener("keydown", down);
    },[])
    return(
        <>
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen}/>
        <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
            <Button className="size-9" variant='outline' onClick={toggleSidebar}>
                {(state==="collapsed"|| isMobile)?<PanelLeftIcon className="size-4"/>:<PanelLeftCloseIcon className="size-4"/>}
            </Button>
            <Button className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground" variant="outline" size="sm" onClick={()=> setCommandOpen((open) => !open)}>
                <SearchIcon/>Search
                <kbd className="ml-auto pointer-events-non inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">&#8984;</span>K
                </kbd>
            </Button>
            <Button 
  className="size-9" 
  variant="outline" 
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
>
  {theme === "dark" ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
</Button>
        </nav> 
        </> 
    )
} 