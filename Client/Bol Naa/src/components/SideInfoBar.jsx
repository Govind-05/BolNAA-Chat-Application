import React, {useContext} from 'react'
import SidebarContext from '../context/SidebarContext';
import ChatContainer from './ChatContainer';
import UserProfileContainer from './UserProfileContainer';
import UserRequestsContainer from './UserRequestsContainer';


function SideInfoBar() {

  const {sidebarNavigation} = useContext(SidebarContext)

  return (
    <div className="!w-[30rem] bg-slate-900 border-r-2 border-black flex-grow-0 flex flex-col h-screen">
      <div className="flex items-center">
        {(() => {
          switch (sidebarNavigation) {
            case 'chats':
              return <span className="text-white text-3xl font-semibold m-2 ml-6" style={{width:"inherit"}}>Chats</span>;
            case 'userRequests':
              return <span className="text-white text-3xl font-semibold m-2 ml-6" style={{width:"inherit"}}>Invite / Requests</span>;
            case 'userProfile':
              return <span className="text-white text-3xl font-semibold m-2 ml-6" style={{width:"inherit"}}>Profile</span>;
            case 'notifications':
              return <span className="text-white text-3xl font-semibold m-2 ml-6" style={{width:"inherit"}}>Notifications</span>;
            case 'settings':
              return <span className="text-white text-3xl font-semibold m-2 ml-6" style={{width:"inherit"}}>Settings</span>;
            default:
              return <span className="text-white text-3xl font-semibold m-2 ml-6" style={{width:"inherit"}}>Chats</span>;
          }
        })()}
      </div>

      <div className="flex-1 overflow-y-auto">
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
              return <ChatContainer />
          }
        })()}
        
      </div>
    </div>
  )
}

export default SideInfoBar