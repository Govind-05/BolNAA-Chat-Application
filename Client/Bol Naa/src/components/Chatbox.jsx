import React from 'react'
import Welcome from './Welcome';
import MessageBox from './MessageBox';

export default function Chatbox(props) {

  const {userSelected}=props;


  return (
    <>

      {!userSelected.selected?
      <Welcome />
      :
      <MessageBox userName={userSelected.userName}/>
      }
    </>
  )
}
