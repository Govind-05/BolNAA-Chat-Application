import React,{useContext} from 'react'
import UserContext from '../context/userContext';


function ChatContainer() {
    const items = Array.from({ length: 5 }, (_, index) => index);

    const {setShowMessageBox} = useContext(UserContext);

    return (
        <>
            <ul>
                {items.map(index => (

                <li className="flex m-2 p-4 hover:bg-gray-800 rounded-lg hover:cursor-pointer" onClick={()=>setShowMessageBox(true)}>
                    <img src="images/User_profile.jpg" alt="profile" className="h-12 w-12 rounded-full mr-4 hover:cursor-default" />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-white font-bold text-xl">Govind</span>
                        <span className="text-gray-300 overflow-hidden text-nowrap whitespace-nowrap text-ellipsis text-sm">This is a test message generated manually during development of this chatbox.</span>
                    </div>
                </li>
                ))}
            </ul>
        </>
    )
}

export default ChatContainer