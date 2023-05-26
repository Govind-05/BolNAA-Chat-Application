import { useRef, useState, useContext } from "react"
import axios from "axios"
import SocketContext from "../context/SocketContext";



export default function AddPeopleModal(props) {


    const socketValues = useContext(SocketContext);
    const id = socketValues.id;
    const modalRef = useRef(null);
    const userRef = useRef();
    const closeRef = useRef();
    const [invalid, setInvalid] = useState(false);
    const alreadyUsers = props.peopleAdded;

    if (props.modalState) {
        modalRef.current.click();
    }

    async function handleSubmitModal() {

        const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/checkUser`, {
            userName: userRef.current.value
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(response.data.error)


        if (!response.data.error && userRef.current.value !== id) {


            console.log(alreadyUsers)
            console.log(userRef.current.value)

            props.setPeopleAdded(
                [...alreadyUsers, { userName: userRef.current.value }]
            )

            await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/saveContacts`, {
                user: id,
                userName: userRef.current.value
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            console.log(userRef.current.value);
            userRef.current.value = "";
            closeRef.current.click();



        } else {
            userRef.current.value = "";
            setInvalid(true);
            setTimeout(() => {
                setInvalid(false);
            }, 2000)
        }
    }

    return (
        <>
            <button type="button" ref={modalRef} style={{ display: "none" }} data-bs-toggle="modal" data-bs-target="#exampleModal"></button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" data-bs-keyboard="false" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create Contact</h5>
                        </div>

                        <div className="modal-body">

                            <label htmlFor="modal-userName" className="modal-userName-label">Username:</label>
                            <input ref={userRef} type="text" name="modal-userName" className="modal-userName" required />
                            {invalid ? <span className="username-error">***Invalid Username</span> : <span></span>}
                        </div>
                        <div className="modal-footer">
                            <button ref={closeRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmitModal}>Save User</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
