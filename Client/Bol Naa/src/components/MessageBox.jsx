import { useContext, useEffect, useRef, useState } from "react";
import SocketContext from "../context/SocketContext";
import UserContext from '../context/userContext';
import EmojiPicker from 'emoji-picker-react';
import DOMPurify from 'dompurify';
import axios from "axios";


export default function MessageBox(props) {

    // const { userName } = props;
    // const [sendMes, setSendMes] = useState("")
    // const socketValues = useContext(SocketContext);

    // const socket = socketValues.socket;
    // const containerRef = useRef();

    // function handleChange(e) {
    //     setSendMes(e.target.value);
    // }

    // const Scroll = () => {
    //     const { offsetHeight, scrollHeight, scrollTop } = containerRef.current
    //     if (scrollHeight <= scrollTop + offsetHeight + 100) {
    //         containerRef.current?.scrollTo(0, scrollHeight)
    //     }
    // }

    // function addMessageToConversation(type, text) {
    //     const msgBox = document.createElement("div");
    //     if (type) {
    //         msgBox.classList.add("senders-message");
    //     } else {
    //         msgBox.classList.add("receivers-message")
    //     }
    //     msgBox.textContent = text;

    //     const msgContainer = document.getElementById("conversations-container");
    //     msgContainer.appendChild(msgBox);

    //     Scroll();

    // }

    // const initialRenderRef = useRef(true);


    // useEffect(() => {
    //     if (socket == null) return;
    //     socket.on("received-message", (receiverName, text, senderName) => {
    //         if (senderName === userName) {
    //             addMessageToConversation(false, text);
    //         }
    //     })



    //     return () => socket.off("received-message")
    // }, [socket, addMessageToConversation])

    // async function handleSubmit(e) {
    //     e.preventDefault();
    //     socket.emit("send-message", { userName, sendMes, sender: socketValues.id });
    //     addMessageToConversation(true, sendMes)
    //     const response = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/addMessages`, {
    //         sender: socketValues.id,
    //         receiver: userName,
    //         message: sendMes
    //     },
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })

    //     setSendMes("");
    // }

    // async function getAllMessages(sender, receiver) {
    //     const messages = await axios.post(`${import.meta.env.VITE_APP_PROXY_DOMAIN}/post/fetchMessages`, {
    //         sender: sender,
    //         receiver: receiver,
    //     },
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //     console.log(messages.data);
    //     return messages.data.messages;

    // }



    // async function getMessages() {
    //     const messages = await getAllMessages(socketValues.id, userName);
    //     console.log(messages);
    //     messages.map((messageData) => {
    //         if (messageData.sender === socketValues.id && messageData.receiver === userName) {
    //             addMessageToConversation(true, messageData.message);
    //         } else if (messageData.sender === userName && messageData.receiver === socketValues.id) {
    //             addMessageToConversation(false, messageData.message);
    //         }
    //     })
    //     Scroll();
    // }
    // useEffect(() => {
    //     // if (initialRenderRef.current) {
    //     //     initialRenderRef.current = false;
    //     // } else {
    //     const msgContainer = document.getElementById("conversations-container");

    //     while (msgContainer.hasChildNodes()) {
    //         msgContainer.removeChild(msgContainer.firstChild);
    //     }
    //     getMessages();

    //     setSendMes("");
    //     // }
    // }, [userName]);
    
  
    const {setShowMessageBox} = useContext(UserContext);
    
    const emojiPickerRef = useRef(null)
    const textInputRef = useRef(null)

    const [emojiPickerState,setEmojiPickerState] =useState(false)
    const [textInput,setTextInput] =useState("")
    const [messagesArray, setMessagesArray] = useState([]);

    const handleEmojiInsert = (emojiData) => {
        const content=textInputRef.current.innerHTML
        textInputRef.current.innerHTML = ""
        textInputRef.current.innerHTML = content+""+emojiData.emoji

        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(textInputRef.current);
        range.collapse(false); // Collapse to the end
        selection.removeAllRanges();
        selection.addRange(range);
        setTextInput(textInputRef.current.innerHTML)
    }

    const handleInput = (event) => {
        const content = event.target.innerHTML;
        setTextInput(content);
    };

    const addMessage = () => {
        if (textInput.trim() === '') return;

        setMessagesArray([...messagesArray, textInput]);
        setTextInput('');
        textInputRef.current.innerHTML = '';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setEmojiPickerState(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* <div className="message-box-container">
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
            </div> */}

            <div className="bg-slate-900 flex-grow flex flex-col overflow-hidden">
                <div className="flex border-b-2 border-black items-center">
                    <img src="/images/User_profile.jpg" alt="profile" className="h-12 w-12 rounded-full m-2"/>
                    <span className="text-white text-xl font-semibold">Govind</span>
                    <div className="ml-auto mr-2 p-1 pl-3 pr-2 hover:bg-slate-600 rounded-md cursor-pointer" onClick={()=>setShowMessageBox(false)} >
                        <i className="fa-solid fa-location-arrow rotate-[230deg] text-white text-2xl "></i>
                    </div>
                </div>

                <div className="flex-grow bg-contain overflow-auto" style={{backgroundImage:"linear-gradient(rgb(20 23 36 / 90%), rgb(0 0 0 / 90%)), url(/images/chat_background.jpg)"}}>

                    <ul className="">
                        {/* <li className="bg-green-700 max-w-[55%] w-fit p-2 flex flex-col items-end rounded-md m-2 ml-auto mr-8">
                            <span className="text-wrap break-words w-full text-white text-sm">USER SIDE MESSAGE HERE. WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWOHOOOOOO!!!!!!</span>
                            <span className="text-black font-bold text-[0.7rem]">00:14</span>
                        </li>

                        <li className="bg-gray-800 max-w-[55%] w-fit p-2 flex flex-col items-end rounded-md m-2 ml-8 mr-8">
                            <span className="text-wrap break-words w-full text-white text-sm">USER SIDE MESSAGE HERE. WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWOHOOOOOO!!!!!!</span>
                            <span className="text-gray-400 font-bold text-[0.7rem]">00:14</span>
                        </li> */}

                        {messagesArray.map((msg, index) => (
                            <li key={index} className="bg-green-700 max-w-[55%] w-fit p-2 flex flex-col items-end rounded-md m-2 ml-auto mr-8">
                                <span className="text-wrap break-words w-full text-white text-sm" dangerouslySetInnerHTML={{ __html: msg }}></span>
                                <span className="text-black font-bold text-[0.7rem]">00:14</span>
                            </li>
                        ))}
            
                    </ul>

                </div>

                <div className="border-t-2 border-black w-auto flex items-end p-2">
                    <div ref={emojiPickerRef}>
                    <EmojiPicker open={emojiPickerState} theme="dark" suggestedEmojisMode="recent" skinTonesDisabled={true} onEmojiClick={handleEmojiInsert} className="!absolute bottom-11"/>
                    </div>
                    <i className="fa-regular fa-face-smile ml-2 text-white text-lg hover:cursor-pointer p-2 hover:bg-slate-600 rounded-lg mt-1 mb-1" onClick={() => setEmojiPickerState(!emojiPickerState)}></i>
                    <div
                        ref={textInputRef}
                        className='min-h-4 max-h-28 text-white w-11/12 overflow-y-auto text-base m-2 focus:outline-none'
                        contentEditable='true'
                        placeholder="Type a message"
                        autoFocus={true} onBlur={({ target }) => target.focus()}
                        onInput={handleInput}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevent new line on Enter
                                addMessage();
                            }
                        }}
                        
                        ></div>
                    <i className="fa-solid fa-paper-plane ml-2 mr-2 text-white text-lg hover:cursor-pointer p-2 hover:bg-slate-600 rounded-lg mt-1 mb-1" onClick={addMessage}></i>
                </div>
            </div>
        </>
    )
}
