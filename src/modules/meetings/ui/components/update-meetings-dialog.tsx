import { ResponsiveDialog } from "@/components/responsive-dialog"
import { MeetingForm } from "./meeting-form"
import { useRouter } from "next/navigation"
import { MeetingGetOne } from "../../types"

interface UpdateMeetingsDialogProps{
    open:boolean
    onOpenChange:(open:boolean)=>void
    initialValues:MeetingGetOne
}
export const UpdateMeetingDialog=({open,onOpenChange,initialValues}:UpdateMeetingsDialogProps)=>{
    
    return(
        <ResponsiveDialog title="Edit Meetings" description="" open={open} onOpenChange={onOpenChange}>
            <MeetingForm
            onSuccess={()=>{onOpenChange(false)
                
                
            }}
            onCancel={()=>onOpenChange(false)}
            intialValues={initialValues}
            />
            
            
        </ResponsiveDialog>
    )
}