import { useState } from "react";
import UserContext from "./userContext";

export default function UserState(props){

    const [profile,setProfile]=useState()
    const [showMessageBox, setShowMessageBox] = useState(false)


    return(
        <>
            <UserContext.Provider value={{
                profile,
                setProfile,
                showMessageBox,
                setShowMessageBox
                }}>
                {props.children}
            </UserContext.Provider>
        </>
    )
}