import React, {useState} from 'react'
import InviteContainer from './InviteContainer'
import RequestContainer from './RequestContainer'

function UserRequestsContainer() {

    const [inviteTab, setInviteTab] = useState(true)

    return (
        <div>
            <div className="flex">
                <div className={`w-6/12 p-2 rounded-t-lg text-center text-white font-bold transition-all hover:cursor-pointer ${inviteTab ? `bg-green-600` : `bg-gray-700`}`} onClick={() => setInviteTab(true)}>Invite</div>
                <div className={`w-6/12 p-2 rounded-t-lg text-center text-white font-bold transition-all hover:cursor-pointer ${inviteTab ? `bg-gray-700` : `bg-green-600`}`} onClick={() => setInviteTab(false)}>Request</div>
            </div>
            <div>
                {
                    inviteTab ?
                        (<InviteContainer />)
                        :
                        (<RequestContainer />)
                }
            </div>
        </div>
    )
}

export default UserRequestsContainer