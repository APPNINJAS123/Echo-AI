"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { set } from "date-fns";
import { use, useState } from "react";
import { authClient } from "@/lib/auth-client"
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from '@/trpc/client';


export const HomeView = () => {
    
    

    
  return(
    <div>
        Home View
       
    </div>
  )
}
