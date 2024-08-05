import React,{useContext} from 'react'
import UserContext from '../context/userContext';


function ChatContainer() {
    const items = Array.from({ length: 50 }, (_, index) => index);

    const {setShowMessageBox,setMessageBoxValue,userContactsList} = useContext(UserContext);

    return (
        <>
            <ul>
                {userContactsList.map((contact,index) => (

                <li key={index} className="flex m-2 p-4 hover:bg-gray-800 rounded-lg hover:cursor-pointer" onClick={()=>{setShowMessageBox(true);setMessageBoxValue({receiverUserName:contact.userName,receiverFullName:contact.yourName,receiverDP:contact.imageUrl})}}>
                    
                    {(contact.imageUrl && contact.imageUrl!=="") ? (
                        <img src={`${contact.imageUrl}`} alt="profile" className="h-12 w-12 rounded-full mr-4 hover:cursor-default" />
                    ):(
                        <img src="images/User_profile.jpg" alt="profile" className="h-12 w-12 rounded-full mr-4 hover:cursor-default" />
                    ) }

                    <div className="flex flex-col overflow-hidden">
                        <span className="text-white font-bold text-xl">{contact.yourName}</span>
                        <span className="text-gray-300 overflow-hidden text-nowrap whitespace-nowrap text-ellipsis text-sm">This is a test message generated manually during development of this chatbox.</span>
                    </div>
                </li>
                ))}
            </ul>
        </>
    )
}

export default ChatContainer