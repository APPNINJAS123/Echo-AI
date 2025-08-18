import {z} from "zod";
export const meeetingsSchema=z.object({
    name: z.string().min(1, "Name is required"),
    agentId: z.string().min(1, "Agent is  required"),
})

export const meetingsUpdateSchema=meeetingsSchema.extend({
    id:z.string().min(1,{message:"Id is required"})
})      