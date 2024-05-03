/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import CodeEditor from './CodeEditor';
import WorksapceHeader from './WorksapceHeader';
import UpperSideBar from './UpperSideBar.jsx';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initSocket } from '../../utils/socketConn/socket';
import SOCKET_ACTIONS from '../../utils/socketConn/SocketActions.js';
// import { ToastContainer, toast } from 'react-toastify';
import { Toaster, toast } from 'react-hot-toast';
import { WorkspaceContext } from '../../context/WorkspaceProvider.jsx';
import ChatPage from '../chatPages/ChatPage.jsx';
import axios from 'axios';
import TodoPage from '../todoPages/TodoPage.jsx';
import { getAllTodosFromDB, updateAllTodos } from '../../utils/apiCalls/user.apicalls.js';

const Workspace = () => {
    const {
        socketRef, token,
        currentSelectedFile, setCurrentSelectedFile,
        allDbFetchedMessages, setAllDbFetchedMessages,
        allMessages, setAllMessages,
        files, setFiles,
        setIsTodoApOpen,
        todos, setTodos
    } = useContext(WorkspaceContext);
    const [editorLanguage, setEditorLanguage] = useState('javaScript');
    const [editorTheme, setEditorTheme] = useState('vs-dark');
    const [isChatSelected, setIsChatSelected] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    // const [files, setFiles] = useState(EXAMPLE_FILE_LIST);

    const location = useLocation();
    const reactNavigate = useNavigate();
    const { roomId } = useParams()

    // =================================================================================
    const fetchDbMessages = async () => {
        await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/messages`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { roomId }
        }).then(response => {
            // console.log('ALl messages GET -----------------------------')
            setAllDbFetchedMessages(response.data);
        }).catch(err => {
            // console.log('ROOM CREATE ERROR', err.response.data);
            toast.error(err.response.data.error);
        });
    }
    const pushToDbMessages = async () => {
        if (allMessages.length > 0) {
            if (allDbFetchedMessages.length > 0) {
                const isAlreayPushed = allMessages[allMessages.length - 1]._id ===
                    allDbFetchedMessages[allDbFetchedMessages.length - 1]._id;
                if (isAlreayPushed) {
                    // console.log('ALREADY PUSHED ------------------------------');
                    return;
                }
            }
            await axios({
                method: 'POST',
                url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/messages/push-messages`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { allMessages }
            }).then(response => {
                // console.log('ALl messages SENT -----------------------------');
                // console.log(response);
                setAllMessages([]);
                socketRef.current.emit(SOCKET_ACTIONS.MESSAGE, {
                    messageObject: {},
                    roomId,
                    senderObject: 'null',
                });
            }).catch(err => {
                console.log('ROOM CREATE ERROR', err.response.data);
                toast.error(err.response.data.error);
            });
        }
    }
    const getAllFilesInRoom = async () => {
        await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/rooms/files`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { roomId }
        }).then(response => {
            // console.log('ALl FIles from room POST -----------------------------')
            console.log('Recived Data --', response.data);
            setFiles(response.data)
        }).catch(err => {
            console.log('FILE FETCH ERROR FROM ROOM', err.response.data);
            toast.error(err.response.data.error);
        });
    }
    const updateFilesInRoom = async () => {
        await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/rooms/files/update`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { roomId, files }
        }).then(response => {
            // console.log('ALl FIles upload to db POST -----------------------------')
            console.log(response.data);
        }).catch(err => {
            console.log('FILE UPATE DB ERROR FROM ROOM', err.response.data);
            toast.error(err.response.data.error);
        });
    }

    // =================================================================================
    useEffect(() => {
        const handleErrors = (err) => {
            console.log('Socket error: ', err);
            toast.error('Socket connection failed, try again later');
            reactNavigate('/');
        }
        const initScoketClient = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            await getAllFilesInRoom();
            await fetchDbMessages();
            await getAllTodosFromDB(token, setTodos);

            console.log('Socket Connection Done')
            const userDeatils = location.state?.userDeatils;
            socketRef.current.emit(SOCKET_ACTIONS.JOIN, {
                roomId,
                userDeatils,
            });

            //  Listeinging for joined event
            socketRef.current.on(SOCKET_ACTIONS.JOINED, ({ connectedUsers, username, socketId }) => {
                if (username !== location.state?.userDeatils.username) {
                    toast.success(`${username} joined the room`);
                }
                setConnectedUsers(connectedUsers);
                if (files.length > 0 && files[0].fileId !== 'demo') {
                    socketRef.current.emit(SOCKET_ACTIONS.SYNC_CODE, {
                        files,
                        socketId
                    });
                }
            });

            socketRef.current.on(SOCKET_ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast(`${username} left the room.`, {
                    icon: 'ℹ️'
                });
                setConnectedUsers((prev) => {
                    return prev.filter(connectedUser => connectedUser.socketId !== socketId)
                })
            });

        }
        initScoketClient();
        return () => {
            socketRef.current.off(SOCKET_ACTIONS.JOINED);
            // socketRef.current.off(SOCKET_ACTIONS.CODE_CHANGE);
            socketRef.current.off(SOCKET_ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, [location.state?.userDeatils, reactNavigate, roomId]);

    useEffect(() => {
        console.log('files: -- ', files);
    }, [files])

    // =================================================================================
    const toggleIsChatSelected = () => {
        if (isChatSelected) {
            pushToDbMessages();
        }
        setIsChatSelected(prevIsChatSelected => !prevIsChatSelected);
    }
    const handleFileChange = (newFileContent) => {
        setFiles(prevFiles => {
            const newFiles = prevFiles.map(file => {
                if (file.fileId === currentSelectedFile.fileId) {
                    // currentSelectedFileIndexRef.current = files.indexOf(file);
                    return { ...file, fileContent: newFileContent }
                } else {
                    return file;
                }
            })
            if (socketRef.current) {
                socketRef.current.emit(SOCKET_ACTIONS.CODE_CHANGE, {
                    roomId, files: newFiles, fileId: currentSelectedFile.fileId
                })
            }
            return newFiles;
        });
        console.log(files[0]);
        if (socketRef.current) {
            socketRef.current.emit(SOCKET_ACTIONS.CODE_CHANGE, {
                roomId, files, fileId: currentSelectedFile.fileId
            })
        }
    }
    const handleCurrentSelectedFileRefChange = (file) => {
        setCurrentSelectedFile(file);
    }
    const handleCopyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('ROOM ID has been copied to your clipboard')
        } catch (err) {
            toast.error('Could not copy the ROOM ID')
            console.error(err);
        }
    }
    const handleLeaveRoom = async () => {
        await updateFilesInRoom();
        await pushToDbMessages();
        await updateAllTodos(token, todos);
        reactNavigate('/');
    }

    // =================================================================================
    if (!location.state) {
        return <Navigate to='/room' />
    }

    return (<div className='##mainwrap h-screen flex p-2 overflow-y-hidden relative'>
        <div className="h-full flex flex-col justify-between">
            <div className="h-[60%]">
                <div className="p-1">
                    <h2 className='gifLogoAnimation py-3 text-xl text-white font-mono flex justify-center items-center'>
                        Synchrotek
                    </h2>
                </div>
                {/* ----------------------------------- */}
                <UpperSideBar
                    connectedUsers={connectedUsers}
                    files={files}
                    setFiles={setFiles}
                    handleCurrentSelectedFileRefChange={handleCurrentSelectedFileRefChange}
                />
            </div>
            <TodoPage />
            <div className='flex flex-col justify-end w-full gap-4 z-20 h-[40%] '>
                <button className='btn btn-accent font-semibold'
                    onClick={() => setIsTodoApOpen(true)}
                >TO-DO</button>
                <button className='btn btn-accent font-semibold'
                    onClick={handleCopyRoomId}
                >Copy ROOM ID</button>
                <button className='btn btn-outline btn-warning font-semibold'
                    onClick={handleLeaveRoom}
                >LEAVE</button>
            </div>
        </div>
        <div className="w-full h-screen p-0 my-0 ml-3 overflow-x-hidden">
            <WorksapceHeader
                setEditorLanguage={setEditorLanguage} setEditorTheme={setEditorTheme}
                isChatSelected={isChatSelected}
                toggleIsChatSelected={toggleIsChatSelected}
            />
            <div className='h-[85%] relative'>
                <ChatPage
                    isChatSelected={isChatSelected}
                    roomId={roomId}
                    fetchDbMessages={fetchDbMessages}
                />
                <CodeEditor
                    socketRef={socketRef}
                    setFiles={setFiles}
                    editorLanguage={editorLanguage} editorTheme={editorTheme}
                    handleCurrentSelectedFileRefChange={handleCurrentSelectedFileRefChange}
                    handleFileChange={handleFileChange}
                />
            </div>
        </div>
        <Toaster
            position="top-left"
            reverseOrder={false}
        />
    </div>
    )
}

export default Workspace