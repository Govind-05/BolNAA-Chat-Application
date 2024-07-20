import React,{useContext} from 'react'
import Welcome from './Welcome';
import MessageBox from './MessageBox';
import UserContext from '../context/userContext';


export default function Chatbox(props) {

  const {showMessageBox} = useContext(UserContext);

  return (
    <>

      {showMessageBox ?
        (
          <MessageBox />
        )
        :
        (
          <Welcome />
        )
      }
    </>
  )
}
