"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import Head from "next/head";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meetings-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming.state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

interface Props{
    meetingId:string
}
export const MeetingIdView=({meetingId}:Props)=>{
    const[updateMeetingDialogOpen,setUpdateMeetingDialogOpen]=useState(false);
    const router=useRouter();
    const trpc=useTRPC();
    const{data}=useSuspenseQuery(trpc.meetings.getOne.queryOptions({id:meetingId}));
    const queryClient=useQueryClient();
    const [RemoveConfirmation,confirmRemove]=useConfirm(
        "Are you sure?",
        "This action will remove this meeting"
    )
    const removeMeeting=useMutation(trpc.meetings.remove.mutationOptions({
        onSuccess:async()=>{
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
            router.push('/meetings')
        }
        
    }))
    const handleRemoveMeeting=async()=>{
        const ok=await confirmRemove();
        if(!ok) return;
        await removeMeeting.mutateAsync({id:meetingId})
    }
    const  isActive=data.status==="active";
    const isUpcoming=data.status==="upcoming";
    const isCancelled=data.status==="cancelled";
    const  isCompleted=data.status==="completed";
    const isProcessing=data.status==="processing";

    return(
        <>
        <RemoveConfirmation />
        <UpdateMeetingDialog open={updateMeetingDialogOpen} onOpenChange={setUpdateMeetingDialogOpen} initialValues={data} />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <MeetingIdViewHeader
            meetingId={data.id}
            meetingName={data.name}
            onEdit={()=>setUpdateMeetingDialogOpen(true)}
            onRemove={handleRemoveMeeting} 
            />
            {isCancelled&&<CancelledState/>}
            {isProcessing&&<ProcessingState/>}
            {isCompleted&&<CompletedState data={data}/>}
            {isUpcoming&&<UpcomingState meetingId={meetingId} />}
            {isActive&&<ActiveState meetingId={meetingId}/>}
            
        </div>
        </>
    )
}
export const MeetingIdViewLoading=()=>{
    return(
        <LoadingState title="Loading Meetings" description="Please wait while we fetch the agents data."/>
    )
}
export const MeetingIdViewError=()=>{
    return(
         <ErrorState title="Error Loading Meetings" description="Please try again later."/>
    )
}