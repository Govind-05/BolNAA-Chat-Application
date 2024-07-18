import React, {useContext} from 'react'
import SidebarContext from '../context/SidebarContext';
import ChatContainer from './ChatContainer';
import UserProfileContainer from './UserProfileContainer';
import UserRequestsContainer from './UserRequestsContainer';


function SideInfoBar() {

  const {sidebarNavigation} = useContext(SidebarContext)

  return (
    <div className="w-[30rem] bg-slate-900 border-r-2 border-black flex flex-col h-screen">
      <div className="flex items-center">
        {(() => {
          switch (sidebarNavigation) {
            case 'chats':
              return <span className="text-white text-3xl font-semibold m-2 ml-6">Chats</span>;
            case 'userRequests':
              return <span className="text-white text-3xl font-semibold m-2 ml-6">Invite / Requests</span>;
            case 'userProfile':
              return <span className="text-white text-3xl font-semibold m-2 ml-6">Profile</span>;
            case 'notifications':
              return <span className="text-white text-3xl font-semibold m-2 ml-6">Notifications</span>;
            case 'settings':
              return <span className="text-white text-3xl font-semibold m-2 ml-6">Settings</span>;
            default:
              return <span className="text-white text-3xl font-semibold m-2 ml-6">Chats</span>;
          }
        })()}
      </div>

      <div className="flex-1 overflow-auto">
      {(() => {
          switch (sidebarNavigation) {
            case 'chats':
              return <ChatContainer />
            case 'userRequests':
              return <UserRequestsContainer />
            case 'userProfile':
              return <UserProfileContainer />
            case 'notifications':
              return <span className="text-white text-3xl font-semibold m-2 ml-4">Notifications</span>;
            case 'settings':
              return <span className="text-white text-3xl font-semibold m-2 ml-4">Settings</span>;
            default:
              return <span className="text-white text-3xl font-semibold m-2 ml-4">Chats</span>;
          }
        })()}
        
      </div>
    </div>
  )
}

export default SideInfoBar