import { useState } from "react";
import UserContext from "./userContext";

export default function UserState(props){

    const [isLogin, setIsLogin] = useState({
        loginState:localStorage.getItem("loginState")==="true"?true:false,
      });
    const [profile,setProfile]=useState()
    const [showMessageBox, setShowMessageBox] = useState(false)
    const [userInviteList, setUserInviteList] = useState([])
    const [userRequestList, setUserRequestList] = useState([])

    return(
        <>
            <UserContext.Provider value={{
                isLogin,
                setIsLogin,
                profile,
                setProfile,
                showMessageBox,
                setShowMessageBox,
                userInviteList,
                setUserInviteList,
                userRequestList,
                setUserRequestList
                }}>
                {props.children}
            </UserContext.Provider>
        </>
    )
}