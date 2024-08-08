import { useState } from "react";
import SidebarContext from "./SidebarContext";

export default function SidebarState(props){

    const [sidebarNavigation, setSidebarNavigation] = useState("chats")

    return (
        <>
            <SidebarContext.Provider value={{
                sidebarNavigation,
                setSidebarNavigation
            }}>
                {props.children}
            </SidebarContext.Provider>
        </>
    )
}