import { useState } from "react";
import SocketContext from "./SocketContext";
import { io } from "socket.io-client";
import { useEffect } from "react";

export default function SocketProvider(props) {

    const [socket, setSocket] = useState()

    useEffect(() => {

        const newSocket = io("http://localhost:5000", {
            query:{id:props.id} 
        })

        setSocket(newSocket);
        return ()=>newSocket.close();
    }, [props.id])

    return (
        <>
            <SocketContext.Provider value={{socket,id:props.id}} >
                {props.children}
            </SocketContext.Provider>
        </>
    )
}