"use client"
import { useTRPC } from "@/trpc/client";
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { set } from "zod";
import { CallUI } from "./call-ui";
interface Props{
    meetingId:string
    meetingName:string
    userId:string
    userName:string
    userImage:string
}
export const CallConnect=({meetingId,meetingName,userId,userName,userImage}:Props)=>{
    //const hasLeftRef = useRef(false);
    const trpc=useTRPC();
    const {mutateAsync:generateToken}=useMutation(
        trpc.meetings.generateToken.mutationOptions()
    )
    const[client,setClient]=useState<StreamVideoClient>();
    useEffect(()=>{
        const _client=new StreamVideoClient({
            apiKey:process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user:{
                id:userId,
                name:userName,
                image:userImage
            },
            tokenProvider:generateToken,
        })
        setClient(_client)
        return()=>{
            _client.disconnectUser()
            setClient(undefined)
        }
    },[userId,userName,userImage,generateToken])
    const [call,setCall]=useState<Call>(); 
    useEffect(()=>{
        if(!client) return;
        const _call=client.call("default",meetingId)
        _call.camera.disable()
        _call.microphone.disable()  
        setCall(_call)
        //Unmount:hence end the call
        return()=>{
            //if( _call.state.callingState!==CallingState.LEFT){
                //hasLeftRef.current=true
                //_call.leave()
                //_call.endCall()
                //setCall(undefined)
                
            //}
            const cleanup = async () => {
                try {
                    // Check if call is still active before trying to leave
                    if(_call.state.callingState !== CallingState.LEFT && 
                       _call.state.callingState !== CallingState.IDLE) {
                        await _call.leave()
                        await _call.endCall()
                    }
                } catch (error) {
                    console.error("Error during call cleanup:", error)
                } finally {
                    setCall(undefined)
                }
            }
            cleanup()
        }
    },
            
        
    [client,meetingId])

if(!client||!call){
    return(
    <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                <LoaderIcon className="size-6 animate-spin text-white"/>
            </div>)
}
    return(
        <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallUI meetingName={meetingName}/>
            </StreamCall>

        </StreamVideo>
    )
}