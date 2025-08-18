import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props{
    meetingId:string
    
}

export const ActiveState = ({meetingId}:Props) => {
    return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
        <EmptyState image="/upcoming.svg" title="Meeting is active" description="Meeting will end once all participants have left"/>
        <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-2 w-full">

             
             
             <Button asChild className="w-full lg:w-auto" >
                <Link href={`/call/${meetingId}`}>
                <VideoIcon/>
                Join Meeting
                </Link>
                 
             </Button>
             
        </div>
        </div>
        
    )
};