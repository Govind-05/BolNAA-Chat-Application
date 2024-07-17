import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';
import SocketProvider from "../context/SocketProvider";
import SideInfoBar from './SideInfoBar';



export default function Home(props) {

  const { isLogin } = props;
  // const { setIsLogin } = props.setIsLogin;
  const [userSelected, setUserSelected] = useState({
    selected: false,
    userName: ""
  });
  
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin.loginState) {
      navigate("/");
    } 
    
  }, [])


  return (
    <>
      <SocketProvider id={isLogin.userName}>
        <div className='flex h-screen w-screen'>
          <Sidebar setUserSelected={setUserSelected} />
          <SideInfoBar />
          <Chatbox userSelected={userSelected} />
        </div>
      </SocketProvider>

    </>
  )
}
