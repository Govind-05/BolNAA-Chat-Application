import React, { useContext, useEffect } from 'react'
import UserContext from '../context/userContext';
import axios from "axios"

function RequestContainer() {

    const items = Array.from({ length: 20 }, (_, index) => index);
    const { userRequestList, setUserRequestList } = useContext(UserContext)

    const deleteRequest = async (requestId) => {
        try {

            const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/deleteRequest`, { requestId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem("authToken")
                    }
                }
            )

            if (!response.data.error) {
                const updatedUserRequestList = userRequestList.filter(request => request._id !== requestId);
                setUserRequestList(updatedUserRequestList);
            }

        } catch (error) {
            console.log(error);

        }

    }

    const acceptRequest = async (requestId, inviteSender) => {
        try {

            const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/acceptRequest`, { requestId, inviteSender },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem("authToken")
                    }
                }
            )

            if (!response.data.error) {
                const updatedUserRequestList = userRequestList.filter(request => request._id !== requestId);
                setUserRequestList(updatedUserRequestList);
            }

        } catch (error) {
            console.log(error);

        }

    }


    useEffect(() => {

        (async () => {
            try {

                const response = await axios.get(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/getUserRequests`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: localStorage.getItem("authToken")
                        }
                    }
                )

                setUserRequestList(response.data.userRequestList)

            } catch (error) {
                console.log(error);

            }

        })();


    }, [])


    return (
        <>
            <div className="mt-2 overflow-auto">
                <span className="text-white ml-2 text-xl">Pending Requests</span>

                <ul>
                    {userRequestList.map((user, index) => (

                        <li key={index} className="flex m-2 p-4 hover:bg-gray-800 rounded-lg hover:cursor-pointer items-center">
                            <img src="images/User_profile.jpg" alt="profile" className="h-12 w-12 rounded-full mr-4 hover:cursor-default" />
                            <div className="flex overflow-hidden w-full">
                                <span className="text-white font-bold text-xl">{user.inviteSender}</span>
                                <div className="flex-grow flex justify-end items-center">
                                    <i className="fa-solid fa-trash text-md text-red-500 hover:text-red-600" onClick={() => deleteRequest(user._id)}></i>
                                    <i className="fa-solid fa-circle-check text-md ml-3 text-green-600 hover:text-green-500" onClick={() => acceptRequest(user._id, user.inviteSender)}></i>
                                </div>
                            </div>
                        </li>

                    ))}


                    {userRequestList.length === 0
                        &&
                        <div className="ml-2">
                            <span className="text-gray-400 text-sm">No Pending Requests</span>
                        </div>
                    }

                </ul>
            </div>

        </>
    )
}

export default RequestContainer