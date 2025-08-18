"use client"
import { Button } from "@/components/ui/button"
import { PlusIcon, Search, XCircleIcon } from "lucide-react"
import { NewAgentDialog } from "./new-agent-dialog"
import { useState } from "react"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { SearchFilter } from "./agents-search-filter"
import { se } from "date-fns/locale"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export const AgentsListHeader=()=>{
    const [filters,setFilters]=useAgentsFilters();
    const[isDialogOpen,setisDialogOpen]=useState(false)
    const AnyFilterModified=!!filters.search
    const onClearFilters=()=>{
        setFilters({
            search:"",
            page:1
        })
    }
    return(
        <>

        <NewAgentDialog open={isDialogOpen} onOpenChange={setisDialogOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Agents</h5>
                <Button onClick={()=>setisDialogOpen(true)}>
                    <PlusIcon/>
                    New Agent
                </Button>

            </div>
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
                <SearchFilter/>
                {AnyFilterModified&&(
                    <Button  variant="outline" size="sm" onClick={onClearFilters}>
                        <XCircleIcon />
                        Clear
                    </Button>
                )}

            
                <ScrollBar orientation="horizontal"/>

            </div>
            </ScrollArea>
            
        </div>
        </>
    )
}