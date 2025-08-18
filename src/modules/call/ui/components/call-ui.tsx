import { StreamTheme, useCall } from "@stream-io/video-react-sdk"
import { useState } from "react"
import { CallLobby } from "./call-lobby"
import { CallActive } from "./call-active"
import { CallEnded } from "./call-ended"

interface Props{
    
    meetingName:string
}
export const CallUI=({meetingName}:Props)=>{
    //const [hasLeft, setHasLeft] = useState(false);
    const call=useCall()
    const [show,setShow]=useState<"lobby"|"call"|"ended">("lobby")
    const handleJoin=async()=>{
        if(!call ) return;
        //setHasLeft(true)
        await call.join()
        setShow("call")
    }
    const handleLeave=async()=>{
        if(!call) return;
        //call.leave()
        //setShow("ended")
        try {
            // Only leave if we haven't already left
            if(call.state.callingState !== "left") {
                await call.leave()
            }
        } catch (error) {
            console.error("Error leaving call:", error)
        }
        setShow("ended")
    }
    
    return(
    <StreamTheme className="h-screen">
        {show==="lobby"&&<CallLobby onJoin={handleJoin}/>},
        {show==="call"&&<CallActive onLeave={handleLeave} meetingName={meetingName}/>},
        {show==="ended"&&<CallEnded/>}

    </StreamTheme>
)
}
