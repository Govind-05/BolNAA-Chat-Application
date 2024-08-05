import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';
import SocketProvider from "../context/SocketProvider";
import SideInfoBar from './SideInfoBar';
import SidebarState from '../context/SidebarState';
import UserContext from "../context/userContext";
import axios from 'axios';


export default function Home() {

  const { isLogin, profile, setProfile, setUserContactsList } = useContext(UserContext)
  // const { setIsLogin } = props.setIsLogin;
  const [userSelected, setUserSelected] = useState({
    selected: false,
    userName: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin.loginState) {
      navigate("/login");
      return
    }
    if (isLogin.loginState && (profile === null || profile === undefined)) {
      (async () => {
        try {

          const response = await axios.get(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/getUserProfile`, {
            headers: {
              authorization: localStorage.getItem("authToken")
            }
          })

          setProfile(response.data.profile)

        } catch (error) {
          console.log(error);
          if (error.response.data.message === "Unauthorized" || error.response.data.error) {
            navigate('/login')
          }
        }

      })();
    }
    (
      async () => {
        const chatResponse = await axios.get(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/chats/getChatsInfo`, {
          headers: {
            authorization: localStorage.getItem("authToken")
          }
        })

        if (!chatResponse.data.error) {
          setUserContactsList(chatResponse.data.contacts)
        }
      }
    )();

  }, [])



  return (
    <>
      {profile &&
          <SocketProvider id={profile.userName}>
            <div className='flex h-screen w-screen'>

              <SidebarState>
                <Sidebar setUserSelected={setUserSelected} />
                <SideInfoBar />
              </SidebarState>

              <Chatbox />
            </div>
          </SocketProvider>

      }
    </>
  )
}
