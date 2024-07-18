import React from 'react'

function UserProfileContainer() {
    return (
        <div className="flex items-end m-4">
            <img src="/images/User_profile.jpg" alt="" className="h-40 w-40 rounded-full"/>
            <div className="ml-4">
                <form className="login-form">
                    <input className="!w-60 focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" autoCorrect="off" autoComplete="off" placeholder='Your Name' name="yourName" />
                    <input className="!w-60 focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" minLength="4" autoCorrect="off" autoComplete="off" placeholder='Username' name="userName" />
                    <div className="flex justify-end">
                        <button className="w-20 p-2 rounded-lg register-button bg-gray-400 hover:bg-gray-500 font-bold">Reset</button>
                        <button className="w-20 p-2 ml-2 rounded-lg register-button bg-green-600 hover:bg-green-500 font-bold">Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfileContainer