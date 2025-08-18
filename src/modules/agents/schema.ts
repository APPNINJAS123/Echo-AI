import {z} from "zod";
export const agentSchema=z.object({
    name: z.string().min(1, "Name is required"),
    instructions: z.string().min(1, "Instructions are required"),
})

export const agentsUpdateSchema=agentSchema.extend({
    id:z.string().min(1,{message:"Id is required"})
})