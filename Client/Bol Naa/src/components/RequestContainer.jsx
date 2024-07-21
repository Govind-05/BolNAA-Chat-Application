import React from 'react'

function RequestContainer() {

    const items = Array.from({ length: 20 }, (_, index) => index);


    return (
        <>
            <ul>
            {items.map(index => (

                <li className="flex m-2 p-4 hover:bg-gray-800 rounded-lg hover:cursor-pointer items-center">
                    <img src="images/User_profile.jpg" alt="profile" className="h-12 w-12 rounded-full mr-4 hover:cursor-default" />
                    <div className="flex overflow-hidden w-full">
                        <span className="text-white font-bold text-xl">Govind</span>
                        <div className="flex-grow flex justify-end items-center">
                            <i class="fa-solid fa-trash text-md text-red-500 hover:text-red-600"></i>
                            <i class="fa-solid fa-circle-check text-md ml-3 text-green-600 hover:text-green-500"></i>
                        </div>
                    </div>
                </li>

            ))}
            </ul>
        </>
    )
}

export default RequestContainer