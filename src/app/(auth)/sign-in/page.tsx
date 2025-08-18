import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { Sign } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async() => {
    const session= await auth.api.getSession({
        headers: await headers()
      })
      if(!!session) { // If session exists, redirect to home
        redirect('/')
        
      }
    return(
        <SignInView/>
    )
}
export default Page;