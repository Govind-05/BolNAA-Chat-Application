import { useState } from "react";
import SocketContext from "./SocketContext";
import { io } from "socket.io-client";
import { useEffect } from "react";


export default function SocketProvider(props) {

    const DOMAIN=import.meta.env.VITE_APP_PROXY_DOMAIN;

    const [socket, setSocket] = useState(null);

    useEffect(() => {

        const newSocket = io(`${DOMAIN}`, {
            query:{id:props.id} 
        })

        setSocket(newSocket);
        return () => {
            if (newSocket) newSocket.close();
        };
    }, [props.id])

    return (
        <>
            <SocketContext.Provider value={{socket,id:props.id}} >
                {props.children}
            </SocketContext.Provider>
        </>
    )
}