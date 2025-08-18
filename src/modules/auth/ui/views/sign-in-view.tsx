"use client";
import { Card, CardContent } from "@/components/ui/card";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { de, se } from "date-fns/locale";
import { Form, FormControl, FormField, FormItem,FormLabel, FormMessage } from "@/components/ui/form";
import { OctagonAlertIcon } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {FaGithub, FaGoogle} from "react-icons/fa";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { is } from "drizzle-orm";
import { on } from "events";

const formSchema=z.object({
    email:z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),

})


export const SignInView = () => {
    const router= useRouter();
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setPending(false);
        setError(null);
        authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: '/'
        },{
        onSuccess: () => {
                setPending(true);
                router.push('/');
                
            },
        
        onError: ({error}) => {
            setPending(false)//Might give err for true
            setError(error.message);
        }}
            
    );}
    const onSocial = (provider:"github"|"google") => {
        setPending(true);
        setError(null);
        authClient.signIn.social({
            provider: provider,
            callbackURL:'/'

        },{
        onSuccess: () => {
                setPending(false);
                
            },
        
        onError: ({error}) => {
            setPending(false);
            setError(error.message);
        }}
            
    );}
    const form=useForm<z.infer<typeof formSchema>>({
        
            resolver:zodResolver(formSchema),
        
        
            defaultValues:{
                email:"",
                password:""
            }   
        
})

    return (
      <div className="flex flex-col gap-6">
        <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2 p-0">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                   <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center" >
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="text-muted-foreground text-balance">Login to your account</p>
                    </div>
                    <div className="grid gap-3">
                        <FormField control={form.control} name="email" render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="xyz@example.com"  {...field}/>
                                    
                                </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="grid gap-3">
                        <FormField control={form.control} name="password" render={({field})=>(
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*********"  {...field}/>
                                    
                                </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    {!!error && (
                        <Alert className='bg-destructive/10 border-none'>
                            <OctagonAlertIcon className="h-4 w-4 !text-destructive"/>
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>
                    )} 
                    <Button type="submit" className="w-full" disabled={pending}>
                    Sign In
                   </Button>
                   <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                   <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or Continue with
                   </span> 
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                    <Button disabled={pending}variant="outline" type="button" className="w-full" onClick={()=>{
                        onSocial("google");
                    }}>
                        <FaGoogle/>
                    </Button>
                    <Button disabled={pending} variant="outline" type="button" className="w-full" onClick={()=>{
                        onSocial("github");
                    }}>
                        <FaGithub/>
                    </Button>
                   </div>
                   <div className="text-center text-sm">
                    Dont have an account?{" "}
                    <Link href='/sign-up' className="underline underline-offset-4"> Sign-up</Link>
                   </div>

                   </div>
               </form>

                </Form>
               
               <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                <img src="/logo.svg" alt="Image" className="h-[92px] w-[92px]"/>
                <p className="text-2xl font-semibold text-white">
                    Echo AI
                </p>
                 
               </div>
            </CardContent>
        
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>
        </div>
        </div>
    )
}