import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/userContext';
import AddPeopleModal from './AddPeopleModal';
import SocketContext from "../context/SocketContext";
import { IoMenu } from "react-icons/io5";
import axios from "axios";
import SidebarContext from '../context/SidebarContext';



export default function Sidebar(props) {

    const { setUserSelected } = props;

    const profile = useContext(UserContext);
    const {setSidebarNavigation} = useContext(SidebarContext)

    const [addModal, setAddModal] = useState(false);

    const [peopleAdded, setPeopleAdded] = useState([]);

    const [sidebarOpen, setSideBarOpen] = useState(false);

    const socketValues = useContext(SocketContext);
    const id = socketValues.id;

    function addPeopleModal() {
        setAddModal(true);
        setTimeout(() => {
            setAddModal(false);
        }, 1000)
    }

    async function addContacts() {
        const contacts = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/fetchContacts`, {
            userName: id,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(contacts.data.contacts);
        const beforePeople=peopleAdded;
        const afterPeople=[];
        contacts.data.contacts.map((user)=>{
            afterPeople.push({userName:user.userName});
        })
        setPeopleAdded(beforePeople.concat(afterPeople));
    }
    useEffect(() => {
            addContacts();
    }, []);


    function handleUserClick(user) {
        console.log(user);
        setUserSelected({
            selected: true,
            userName: user
        })
    }

    async function deleteUser(user){
        peopleAdded.length=0;
        const delResponse=await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/deleteContact`, {
            sender:id,
            userName: user,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setUserSelected({
            selected: false,
            userName: ""
        })
        addContacts();

    }

    return (
        <>
            {/* <div className='home-sidebar-container'>
                <div className='sidebar-user-container'>
                    <img className='user-profile' src="../images/User_profile.jpg" alt="" />
                    <span className='profile-name'>{profile.profile}</span>
                    <img className='add-people-icon' src="../images/Add_user.png" alt="" onClick={addPeopleModal} />
                    <AddPeopleModal modalState={addModal} peopleAdded={peopleAdded} setPeopleAdded={setPeopleAdded} />
                </div>
                <div className='sidebar-chats-container'>
                    {peopleAdded.map((user) => {
                        return (
                            <div key={user.userName} onClick={() => { handleUserClick(user.userName) }}>
                                <div className='chat-box' >
                                    <img className='chat-user-profile' src="../images/User_profile.jpg" alt="" />
                                    <span className='chat-profile-name'>{user.userName}</span>
                                    <span className='delete-user' onClick={()=>deleteUser(user.userName)}>x</span>
                                </div>
                                <div className='chat-bottom-border'></div>
                            </div>
                        )

                    })}

                </div>
            </div> */}
            <div className={`bg-slate-950 flex flex-col ${sidebarOpen?(`w-52 h-full absolute rounded-tr-lg rounded-br-lg`):(`w-[60px]`)} transition-all duration-[0.3s]`}>
                <div className="border-gray-400 border-b-[1px] flex items-center">
                <i className="fa-solid fa-bars text-gray-300 text-md p-2 m-2 rounded-md hover:bg-slate-600 cursor-pointer" onClick={()=>setSideBarOpen(!sidebarOpen)}></i>
                <span className={`title transition-all duration-[0.3s] ${sidebarOpen ? `text-2xl`:`text-[0px]` }`}>BolNAA</span>
                </div>
                <div className="grow">
                    <ul className="h-full flex flex-col">
                        <li className="hover:bg-slate-600 cursor-pointer m-1 rounded-md" onClick={()=>setSidebarNavigation("chats")}>
                            <i className="fa-solid fa-comment-dots text-gray-300 text-md p-2 m-2 rounded-md cursor-pointer"><span className={`transition-all duration-[0.3s] ${sidebarOpen ? 'text-md text-gray-300 ml-2' : 'text-[0px]'}`}>Chats</span></i>
                        </li>
                        <li className="hover:bg-slate-600 cursor-pointer m-1 rounded-md" onClick={()=>setSidebarNavigation("userRequests")}>
                            <i className="fa-solid fa-users text-gray-300 text-md p-2 m-2 rounded-md cursor-pointer"><span className={`transition-all duration-[0.3s] ${sidebarOpen ? 'text-md text-gray-300 ml-2' : 'text-[0px]'}`}>User Requests/Invite</span></i>
                        </li>
                        <li className="hover:bg-slate-600 cursor-pointer m-1 rounded-md" onClick={()=>setSidebarNavigation("userProfile")}>
                            <i className="fa-solid fa-user-gear text-gray-300 text-md p-2 m-2 rounded-md cursor-pointer"><span className={`transition-all duration-[0.3s] ${sidebarOpen ? 'text-md text-gray-300 ml-2' : 'text-[0px]'}`}>Profile</span></i>
                        </li>
                        <li className="hover:bg-slate-600 cursor-pointer m-1 rounded-md" onClick={()=>setSidebarNavigation("notifications")}>
                            <i className="fa-solid fa-bell text-gray-300 text-md p-2 m-2 rounded-md cursor-pointer"><span className={`transition-all duration-[0.3s] ${sidebarOpen ? 'text-md text-gray-300 ml-2' : 'text-[0px]'}`}>Notifications</span></i>
                        </li>
                        <li className="mt-auto mb-2 hover:bg-slate-600 cursor-pointer m-1 rounded-md" onClick={()=>setSidebarNavigation("settings")}>
                            <i className="fa-solid fa-gear text-gray-300 text-lg p-2 m-2 rounded-md cursor-pointer"><span className={`transition-all duration-[0.3s] ${sidebarOpen ? 'text-md text-gray-300 ml-2' : 'text-[0px]'}`}>Settings</span></i>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
