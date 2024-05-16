/* eslint-disable react/prop-types */
import { ImAttachment } from "react-icons/im";
import { FiSend } from "react-icons/fi";
import { uploadFileToDb } from '../../utils/apiCalls/file.apicalls.js'
import ReactScrollToBottom from 'react-scroll-to-bottom';
import MessageComponent from './MessageComponent.jsx'
import { useContext, useEffect, useState } from "react";
import SOCKET_ACTIONS from "../../utils/socketConn/SocketActions.js";
import { WorkspaceContext } from "../../context/WorkspaceProvider.jsx";

const ChatPage = ({ isChatSelected, roomId, fetchDbMessages }) => {
    const {
        socketRef, allMessages, allDbFetchedMessages, setAllMessages
    } = useContext(WorkspaceContext);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [selectedFileData, setSelectedFileData] = useState(undefined)
    const [loader, setLoader] = useState(false);
    const [senderObject, setSenderObject] = useState()
    const [currentMessageInput, setCurrentMessageInput] = useState(
        {
            attachments: [
                {
                    public_id: "file1",
                    url: "https://e0.pxfuel.com/wallpapers/272/172/desktop-wallpaper-futuristic-minimalistic-at-hipster-minimalist.jpg",
                },
            ],
            content: "",
            sender: {
                _id: currentUser._id,
                name: currentUser.name,
            },
            roomId: roomId,
            createdAt: "",
        }
    );

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(SOCKET_ACTIONS.SEND_MESSAGE, ({
                messageObject, senderObject
            }) => {
                if (messageObject.roomId) {
                    setAllMessages(prevAllMessages => {
                        return [...prevAllMessages, messageObject]
                    });
                    setSenderObject(senderObject);
                } else {
                    setAllMessages([]);
                    fetchDbMessages();
                }
            })
        } else {
            console.log('Socket code-sync error! !!!!!!!!!');
        }
        return () => {
            socketRef.current.off(SOCKET_ACTIONS.SEND_MESSAGE);
        }
    }, [socketRef.current])

    const sendMessage = async (e) => {
        e.preventDefault();
        let uploaeAttachments;
        if (selectedFileData) {
            const uploadedFileData = await uploadFileToDb(setLoader, selectedFileData, setSelectedFileData);
            uploaeAttachments = [{
                public_id: uploadedFileData.original_filename,
                url: uploadedFileData.url
            }]
        }
        const messageObject = {
            ...currentMessageInput,
            createdAt: new Date().toISOString(),
            attachments: uploaeAttachments || []
        }
        if (socketRef.current) {
            socketRef.current.emit(SOCKET_ACTIONS.MESSAGE, {
                messageObject,
                roomId,
                senderObject: currentUser,
            });
        }
        setCurrentMessageInput(prevMessageInput => {
            return { ...prevMessageInput, content: '' }
        });
    }

    const handleInputChange = (e) => {
        setCurrentMessageInput(prevMessageInput => {
            return { ...prevMessageInput, content: e.target.value }
        });
    }

    return (<div className={`absolute z-20 w-full h-[90%] transition-all
    ${isChatSelected ? 'right-0' : '-right-[110%]'}
    `}>
        <ReactScrollToBottom className="bg-[#F8C794] w-full h-[90%] text-black overflow-y-scroll hideScrollBar">
            <div >
                {allDbFetchedMessages.map((msg) => (
                    <MessageComponent key={`${msg.createdAt}${msg.content}`}
                        message={msg} currentUserId={currentUser._id}
                        senderObject={senderObject}
                    />
                ))}
                {allMessages.map((msg) => (
                    <MessageComponent key={`${msg.createdAt}${msg.content}`}
                        message={msg} currentUserId={currentUser._id}
                        senderObject={senderObject}
                    />
                ))}
            </div>
        </ReactScrollToBottom>
        <form className='h-[10%] flex w-full items-center px-2 my-2'
            encType="multipart/form-data"
        >
            <label htmlFor='fileInput' className='btn hover:bg-slate-700'>
                <ImAttachment />
            </label>
            <input type="file" className='hidden' id='fileInput'
                onChange={e => setSelectedFileData(e.target.files[0])}
            />
            <input type='text'
                className='input w-full focus-within:outline-none'
                placeholder="Type Message here..."
                disabled={!!selectedFileData}
                value={selectedFileData ? selectedFileData.name : currentMessageInput.content}
                onChange={handleInputChange}
            />
            <button className={`btn text-white hover:bg-slate-700 hover:text-xl transition-all
            ${loader ? 'loading' : ''}`}
                onClick={sendMessage}
            ><FiSend />
            </button>
        </form>
    </div>
    )
}

export default ChatPage