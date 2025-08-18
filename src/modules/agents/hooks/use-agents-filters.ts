import { DEFAULT_PAGE } from "@/constants"
import {parseAsInteger,parseAsString,useQueryStates} from "nuqs"
import { use } from "react"

export const useAgentsFilters=()=>{
    return useQueryStates({
        search:parseAsString.withDefault("").withOptions({clearOnDefault:true}),
        page:parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault:true}),
        
        
})
}