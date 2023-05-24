import { useState } from "react";
import UserContext from "./userContext";

export default function UserState(props){

    const [profile,setProfile]=useState("Govind")

    return(
        <>
            <UserContext.Provider value={{profile,setProfile}}>
                {props.children}
            </UserContext.Provider>
        </>
    )
}