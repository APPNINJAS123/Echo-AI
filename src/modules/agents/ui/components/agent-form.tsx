
import { AgentGetOne } from "../../types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTRPC } from "@/trpc/client"
import {  useForm } from "react-hook-form"
import z from "zod"
import { agentSchema } from "../../schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { FormControl, FormField, FormItem, FormLabel,Form, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import router from "next/router"

interface AgentFormProps {
    onSuccess?: () => void
    onCancel?: () => void
    intialValues?: AgentGetOne
}

export const AgentForm=({onSuccess,onCancel,intialValues}:AgentFormProps)=>{
   const trpc=useTRPC();
   const router=useRouter()
   
   const queryClient=useQueryClient();


   const createAgent=useMutation(trpc.agents.create.mutationOptions(
    {
        onSuccess:async()=>{
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
            
            
            onSuccess?.();
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
const updateAgent=useMutation(trpc.agents.update.mutationOptions(
    {
        onSuccess:()=>{
            queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            if (intialValues?.id){
                queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({id:intialValues.id}));
            }
            onSuccess?.();
        },


        onError:(error)=>{
            toast.error(error.message);
        }
        //check if error code is forbidden redirect to /upgrade
    }
   ));
   const form=useForm<z.infer<typeof agentSchema>>({
       resolver:zodResolver(agentSchema),
       defaultValues:{
           name:intialValues?.name??'',
           instructions:intialValues?.instructions??''
       }
   })
   
   const isEdit= !!intialValues?.id;
   const isPending=createAgent.isPending || updateAgent.isPending;

   const onSubmit=(values:z.infer<typeof agentSchema>)=>{
       if(isEdit){
        updateAgent.mutate({...values,id:intialValues.id});
       }else{
        createAgent.mutate(values);
       }
   }
   return(
    <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <GeneratedAvatar seed={form.watch('name')} variant="botttsNeutral" className="border size-16"/>
            <FormField name="name" control={form.control} render={({field})=>(
                   <FormItem>
                     <FormLabel>
                        Name
                    </FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="e.g.Coding tutor"/>
                    </FormControl>
                    <FormMessage/>
                   </FormItem>
            )}
            />
            <FormField name="instructions" control={form.control} render={({field})=>(
                   <FormItem>
                     <FormLabel>
                        Instructions
                    </FormLabel>
                    <FormControl>
                        <Textarea {...field} placeholder="You are an amazing assistant that can solve issues and help with tasks."/>
                    </FormControl>
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
   )
   
}   