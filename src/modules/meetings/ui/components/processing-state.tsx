import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";



export const ProcessingState = () => {
    return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
        <EmptyState image="/processing.svg" title="Meeting Completed" description="This meeting is completed. A summary will be available soon"/>
        
        </div>
        
    )
};