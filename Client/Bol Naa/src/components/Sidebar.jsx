import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../context/userContext';
import AddPeopleModal from './AddPeopleModal';
import SocketContext from "../context/SocketContext";
import axios from "axios";



export default function Sidebar(props) {

    const profile = useContext(UserContext);

    const [addModal, setAddModal] = useState(false);

    const [peopleAdded, setPeopleAdded] = useState([]);

    const { setUserSelected } = props;

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
            <div className='home-sidebar-container'>
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
            </div>
        </>
    )
}
