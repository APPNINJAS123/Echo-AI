interface Props{
    children:React.ReactNode
}
export default function CallLayout({children}:Props){
    return(
        <div className="h-screen bg-black ">
            {children}
        </div>
    )
}