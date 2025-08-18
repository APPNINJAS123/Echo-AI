"use client"


import { ErrorState } from "@/components/error-state";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns,  } from "../components/columns";
import { EmptyState } from "@/components/ui/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/loading-state";





export const AgentsView = () => {
    const router=useRouter();
    const [filters,setFilters]=useAgentsFilters();
    const trpc= useTRPC();
    const{data}=useSuspenseQuery(trpc.agents.getMany.queryOptions({...filters}));
    
    return(

        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            
            <DataTable data={data.items} columns={columns} onRowClick={(row)=>router.push(`/agents/${row.id}`)}/>
                
            <DataPagination page={filters.page} totalPages={data.totalPages}  onPageChange={(page)=>setFilters({page})}/>
            {data.items.length===0&&
            (<EmptyState title="Create your first agents" description="Create your agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."/>)}
            
            
        </div>
    )
}

export const AgentsViewLoading=()=>{
    return(
        <LoadingState title="Loading Agents" description="Please wait while we fetch the agents data."/>   
    )
}
export const AgentsViewError=()=>{
    return(
         <ErrorState title="Error Loading elements" description="Please try again later."/>
    )
}