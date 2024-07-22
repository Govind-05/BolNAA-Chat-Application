import React, { useState, useContext, useEffect } from 'react'
import UserContext from '../context/userContext';

import axios from "axios"

function InviteContainer() {

    const {userInviteList, setUserInviteList} = useContext(UserContext)

    const [inviteUsername, setInviteUsername] = useState("")
    const [searchingLabel, setSearchingLabel] = useState(0) // 0:no display  1:searching  2:user found  3:invite already  4:user not found

    const handleSubmit = async () => {
        setSearchingLabel(1)

        for (let index = 0; index < userInviteList.length; index++) {
            if(userInviteList[index].inviteReceiver===inviteUsername){
                setSearchingLabel(3)
                setTimeout(()=>{
                    setSearchingLabel(0)
                },2500)
                return;
            }
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/searchUser`, { inviteUsername },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem("authToken")
                    }
                }
            )

            if (response.data.searchResult) {
                setSearchingLabel(2)
                setTimeout(() => {
                    setSearchingLabel(0)
                }, 2500);
                setUserInviteList([response.data.invite, ...userInviteList])
            } else {
                setSearchingLabel(4)
                setTimeout(() => {
                    setSearchingLabel(0)
                }, 2500);
            }

        } catch (error) {
            console.log(error);
            setSearchingLabel(4)
            setTimeout(() => {
                setSearchingLabel(0)
            }, 2500);
        }

    }

    const deleteInvite = async (inviteId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/deleteInvite`, { inviteId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem("authToken")
                    }
                }
            )

            if (!response.data.error) {
                const updatedUserInviteList = userInviteList.filter(invite => invite._id !== inviteId);
                setUserInviteList(updatedUserInviteList);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(userInviteList.length===0 || !userInviteList){
            
            (async()=>{
                try {
    
                    const response = await axios.get(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/getUserInvites`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                authorization: localStorage.getItem("authToken")
                            }
                        }
                    )
    
                    setUserInviteList(response.data.userInviteList)
                    
                } catch (error) {
                    console.log(error);
    
                }
    
            })();

        }
    },[])


    return (
        <div className="m-4">
            <form className="login-form flex-row">
                <input className="!w-80 focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" autoCorrect="off" autoComplete="off" placeholder='Username' name="inviteUsername" value={inviteUsername} onChange={(e) => setInviteUsername(e.target.value)} />
                <button className="w-20 h-10 ml-2 rounded-lg register-button bg-green-600 hover:bg-green-500 font-bold" type="button" onClick={handleSubmit}>Send</button>
            </form>
            {/* <div>
                <i className="fa-solid fa-spinner animate-spin text-green-500"></i>
                <span className="text-gray-400 ml-2">Searching for user</span>
            </div> */}

            {(() => {
                switch (searchingLabel) {
                    case 0:
                        return (
                            <></>
                        )
                    case 1:
                        return (
                            <div>
                                <i className="fa-solid fa-spinner animate-spin text-green-500"></i>
                                <span className="text-gray-400 ml-2">Searching for user</span>
                            </div>
                        )
                    case 2:
                        return (
                            <div>
                                <i className="fa-solid fa-check text-green-500"></i>
                                <span className="text-gray-400 ml-2">Invite Sent</span>
                            </div>
                        )
                    case 3:
                        return (
                            <div>
                                <i className="fa-solid fa-exclamation text-red-500"></i>
                                <span className="text-gray-400 ml-2">Invite sent already</span>
                            </div>
                        )
                    case 4:
                        return (
                            <div>
                                <i className="fa-solid fa-circle-xmark text-red-500"></i>
                                <span className="text-gray-400 ml-2">User not found</span>
                            </div>
                        )
                    default:
                        return (
                            <></>
                        )
                }
            })()}

            <div className="mt-2 overflow-auto">
                <span className="text-white ml-2 text-xl">Pending Invites</span>

                <ul>
            {userInviteList.map((users,index) => (

                        <li key={index} className="flex m-2 p-4 hover:bg-gray-800 rounded-lg hover:cursor-pointer items-center">
                            <img src="images/User_profile.jpg" alt="profile" className="h-12 w-12 rounded-full mr-4 hover:cursor-default" />
                            <div className="flex overflow-hidden w-full">
                                <span className="text-white font-bold text-xl">{users.inviteReceiver}</span>
                                <div className="flex-grow flex justify-end items-center">
                                    <i class="fa-solid fa-trash text-md text-red-500 hover:text-red-600" onClick={()=>deleteInvite(users._id)}></i>
                                </div>
                            </div>
                        </li>
            ))}

            {userInviteList.length===0 
            &&
            <div className="ml-2">
                <span className="text-gray-400 text-sm">No Pending Invites</span>
            </div>
            }

                </ul>
            </div>
        </div>
    )
}

export default InviteContainer