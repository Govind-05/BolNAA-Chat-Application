import { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "../context/SocketContext";
import axios from "axios";


export default function MessageBox(props) {

    const { userName } = props;
    const [sendMes, setSendMes] = useState("")
    const socketValues = useContext(SocketContext);

    const socket = socketValues.socket;
    const containerRef = useRef();

    function handleChange(e) {
        setSendMes(e.target.value);
    }

    const Scroll = () => {
        const { offsetHeight, scrollHeight, scrollTop } = containerRef.current
        if (scrollHeight <= scrollTop + offsetHeight + 100) {
            containerRef.current?.scrollTo(0, scrollHeight)
        }
    }

    function addMessageToConversation(type, text) {
        const msgBox = document.createElement("div");
        if (type) {
            msgBox.classList.add("senders-message");
        } else {
            msgBox.classList.add("receivers-message")
        }
        msgBox.textContent = text;

        const msgContainer = document.getElementById("conversations-container");
        msgContainer.appendChild(msgBox);

        Scroll();

    }

    const initialRenderRef = useRef(true);


    useEffect(() => {
        if (socket == null) return;
        socket.on("received-message", (receiverName, text, senderName) => {
            if (senderName === userName) {
                addMessageToConversation(false, text);
            }
        })

        

        return () => socket.off("received-message")
    }, [socket, addMessageToConversation])

    async function handleSubmit(e) {
        e.preventDefault();
        socket.emit("send-message", { userName, sendMes, sender: socketValues.id });
        addMessageToConversation(true, sendMes)
        const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/addMessages`, {
            sender: socketValues.id,
            receiver: userName,
            message: sendMes
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        setSendMes("");
    }

    async function getAllMessages(sender, receiver) {
        const messages = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/fetchMessages`, {
            sender: sender,
            receiver: receiver,
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        console.log(messages.data);
        return messages.data.messages;

    }

    

    useEffect(() => {
        if (initialRenderRef.current) {
            initialRenderRef.current = false;
        } else {
            const msgContainer = document.getElementById("conversations-container");

            while (msgContainer.hasChildNodes()) {
                msgContainer.removeChild(msgContainer.firstChild);
            }

            async function getMessages() {
                const messages = await getAllMessages(socketValues.id, userName);
                messages.map((messageData) => {
                    if (messageData.sender === socketValues.id && messageData.receiver === userName) {
                        addMessageToConversation(true, messageData.message);
                    } else if (messageData.sender === userName && messageData.receiver === socketValues.id) {
                        addMessageToConversation(false, messageData.message);
                    }
                })
                Scroll();
            }


            getMessages();
            setSendMes("");
        }
    }, [userName]);

    return (
        <>
            <div className="message-box-container">
                <div className="message-user-profile">
                    <img className='chat-user-profile' src="../images/User_profile.jpg" alt="" />
                    <span className='chat-profile-name message-user-profile-name'>{userName}</span>
                </div>
                <div ref={containerRef} className="message-show-box" id="conversations-container">
                    <div className="senders-message">Sender</div>
                    <div className="receivers-message">Reciever</div>

                </div>
                <div className="send-message-container" >
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="send-message-input" placeholder="Type a message" value={sendMes} onChange={handleChange} required />
                        <button>Send</button>
                    </form>
                </div>
            </div>
        </>
    )
}
