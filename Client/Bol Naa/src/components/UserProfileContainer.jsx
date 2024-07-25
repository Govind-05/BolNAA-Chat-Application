import React,{useState,useContext} from 'react'
import UserContext from '../context/userContext';
import axios from "axios"


function UserProfileContainer() {

    const {profile, setProfile} = useContext(UserContext)

    const [profileInput,setProfileInput] = useState({
        yourName:profile.yourName,
        userName:profile.userName
    })

    const [updatingLabel, setUpdatingLabel] = useState(0) // 0:no display  1:loading  2:updated 3:error 4:username already exists 5: Log in Again


    const handleInput = (e) =>{
        console.log(e.target.name);
        setProfileInput(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const resetProfile = () => {
        setProfileInput({
            yourName:profile.yourName,
            userName:profile.userName
        })
    }

    const updateProfile = async() => {
        setUpdatingLabel(1);
        if (profile.userName === profileInput.userName && profile.yourName === profileInput.yourName) {
            setUpdatingLabel(4)
            setTimeout(() => {
                setUpdatingLabel(0)
            }, 2500)
            return
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/api/users/updateUserProfile`, profileInput ,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: localStorage.getItem("authToken")
                    }
                }
            )

            if (!response.data.error){
                setProfile(profileInput);
                setUpdatingLabel(2)
                setTimeout(()=>{
                    setUpdatingLabel(5)
                },2500)
                return
            }else{
                setProfileInput(profile);
                setUpdatingLabel(4)
                setTimeout(()=>{
                    setUpdatingLabel(0)
                },2500)
                return
            }

        } catch (error) {
            console.log(error);
            setProfileInput(profile);
                setUpdatingLabel(3)
                setTimeout(()=>{
                    setUpdatingLabel(0)
                },2500)
                return
        }
    }

    return (
        <div className="flex items-end m-4">
            <img src="/images/User_profile.jpg" alt="" className="h-40 w-40 rounded-full"/>
            <div className="ml-4">
                <form className="login-form ">
                    <input className="!w-60 focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" autoCorrect="off" autoComplete="off" placeholder='Your Name' name="yourName" value={profileInput.yourName} onChange={(e)=>handleInput(e)} />
                    <input className="!w-60 focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" minLength="4" autoCorrect="off" autoComplete="off" placeholder='Username' name="userName" value={profileInput.userName} onChange={(e)=>handleInput(e)} />
                    {(() => {
                switch (updatingLabel) {
                    case 0:
                        return (
                            <></>
                        )
                    case 1:
                        return (
                            <div>
                                <i className="fa-solid fa-spinner animate-spin text-green-500"></i>
                                <span className="text-gray-400 ml-2">Updating...</span>
                            </div>
                        )
                    case 2:
                        return (
                            <div>
                                <i className="fa-solid fa-check text-green-500"></i>
                                <span className="text-gray-400 ml-2">Updated Successfully</span>
                            </div>
                        )
                        case 3:
                            return (
                                <div>
                                    <i className="fa-solid fa-exclamation text-red-500"></i>
                                    <span className="text-gray-400 ml-2">Erro</span>
                                </div>
                            )
                    case 4:
                        return (
                            <div>
                                <i className="fa-solid fa-circle-xmark text-red-500"></i>
                                <span className="text-gray-400 ml-2">User with username exists</span>
                            </div>
                        )
                        case 5:
                        return (
                            <div>
                                <i className="fa-solid fa-exclamation text-red-500"></i>
                                <span className="text-gray-400 ml-2">Log in again</span>
                            </div>
                        )
                    default:
                        return (
                            <></>
                        )
                }
            })()}
                    <div className="flex justify-end mt-2">
                        <button className="w-20 p-2 rounded-lg register-button bg-gray-400 hover:bg-gray-500 font-bold" type="button" onClick={resetProfile}>Reset</button>
                        <button className="w-20 p-2 ml-2 rounded-lg register-button bg-green-600 hover:bg-green-500 font-bold" type="button" onClick={updateProfile}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfileContainer