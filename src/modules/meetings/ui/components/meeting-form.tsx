
import { MeetingGetOne } from "../../types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTRPC } from "@/trpc/client"
import {  useForm } from "react-hook-form"
import z from "zod"
import { meeetingsSchema } from "../../schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { FormControl, FormField, FormItem, FormLabel,Form, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { use, useState } from "react"
import { CommandSelect } from "./command-select"
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog"




interface MeetingFormProps {
    onSuccess?: (id?:string) => void
    onCancel?: () => void
    intialValues?: MeetingGetOne
}



export const MeetingForm=({onSuccess,onCancel,intialValues}:MeetingFormProps)=>{
    const router=useRouter();
    const [agentSearch,setAgentSearch]=useState("");
    const[openNewAgentDialog,setOpenNewAgentDialog]=useState(false);
const[open,setOpen]=useState(false);    
    const trpc=useTRPC();
   const agents=useQuery(trpc.agents.getMany.queryOptions({
    pageSize:100,
    search:agentSearch
   }));
   
   
   const queryClient=useQueryClient();


   const createMeeting=useMutation(trpc.meetings.create.mutationOptions(
    
    {
        
        onSuccess:async(data)=>{
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
            
            onSuccess?.(data.id);
        },


        onError:(error)=>{
            toast.error(error.message);
            if(error.data?.code === 'FORBIDDEN'){
                router.push('/upgrade');
            } 
        }
        //check if error code is forbidden redirect to /upgrade
    }
   ));
const updateMeeting=useMutation(trpc.meetings.update.mutationOptions(
    {
        onSuccess:()=>{
            queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            if (intialValues?.id){
                queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({id:intialValues.id}));
            }
            onSuccess?.();
        },


        onError:(error)=>{
            toast.error(error.message);
        }
        //check if error code is forbidden redirect to /upgrade
    }
   ));
   const form=useForm<z.infer<typeof meeetingsSchema>>({
       resolver:zodResolver(meeetingsSchema),
       defaultValues:{
           name:intialValues?.name??'',
           agentId:intialValues?.agentId??''
       }
   })
   
   const isEdit= !!intialValues?.id;
   const isPending=createMeeting.isPending || updateMeeting.isPending;

   const onSubmit=(values:z.infer<typeof meeetingsSchema>)=>{
       if(isEdit){
        updateMeeting.mutate({...values,id:intialValues.id});
       }else{
        createMeeting.mutate(values);
       }
   }
   return(
    <>
    <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
    <Form {...form}>
        
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            
            <FormField name="name" control={form.control} render={({field})=>(
                   <FormItem>
                     <FormLabel>
                        Name
                    </FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="e.g.Math consultations"/>
                    </FormControl>
                    <FormMessage/>
                   </FormItem>
            )}
            />
            <FormField name="agentId" control={form.control} render={({field})=>(
                   <FormItem>
                     <FormLabel>
                        Agent
                    </FormLabel>
                    <FormControl>
                        <CommandSelect options={(agents.data?.items??[]).map((agent)=>({
                            id:agent.id,
                            value:agent.id,
                            children:(<div className="flex items-center gap-x-2">
                                <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="border size-6"/>
                                <span>{agent.name}</span>
                            </div>)
                        }))}
                        onSelect={field.onChange}
                        onSearch={setAgentSearch}
                        value={field.value}
                        placeholder="Select an agent"
                        
                        />
                    </FormControl>
                    <FormDescription>
                        Not found what you are looking for?{" "}
                        <button type="button" onClick={()=>setOpenNewAgentDialog(true)} className="text-primary underline">
                            Create new agent
                        </button>
                    </FormDescription>
                    <FormMessage/>
                   </FormItem>
            )}
            />
            
            <div className="flex justify-between gap-x-2">
                {onCancel && <Button variant="ghost" disabled={isPending} type="button" onClick={()=>onCancel()}>Cancel</Button>}
                <Button disabled={isPending} type="submit" >
                    {isEdit?'Update':'Create'}
                
                </Button>
            </div>


        </form>

    </Form>
    </>
   )
   
}   