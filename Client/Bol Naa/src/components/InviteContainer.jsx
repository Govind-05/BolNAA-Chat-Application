import React from 'react'

function InviteContainer() {
    return (
        <div className="m-4">
            <form className="login-form flex-row">
                <input className="!w-80 focus:border-green-400 focus:border-2 text-gray-400 font-semibold bg-black" type="text" autoCorrect="off" autoComplete="off" placeholder='Username' name="userName" />
                <button className="w-20 h-10 ml-2 rounded-lg register-button bg-green-600 hover:bg-green-500 font-bold">Send</button>
            </form>

        </div>
    )
}

export default InviteContainer