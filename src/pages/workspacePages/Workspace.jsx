/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import CodeEditor from './CodeEditor';
import WorksapceHeader from './WorksapceHeader';
import UpperSideBar from './UpperSideBar.jsx';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initSocket } from '../../utils/socketConn/socket';
import SOCKET_ACTIONS from '../../utils/socketConn/SocketActions.js';
import { ToastContainer, toast } from 'react-toastify';

// delete here
const EXAMPLE_CONNECTED_USERS = [
    { socketId: "o5houZ1Il4l_v0f4AAAX1", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX2", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX3", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX4", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX5", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX6", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX7", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX8", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX9", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX0", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAX12", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAA12X", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAA123X", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAsX", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAawefA124X", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AAAaws124X", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0fafasdd4sAAA124X", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AaAA124X", username: "sam2" },
    { socketId: "o5houZ1Il4l_v0f4AsAAX", username: "sam2" },
]
const EXAMPLE_FILE_LIST = [
    { fileId: 1, filename: 'Main1.py', fileContent: '//First WRite some code here' },
    { fileId: 2, filename: 'Main2.py', fileContent: '//WRite2 some code here' },
    { fileId: 3, filename: 'Main3.py', fileContent: '//WRite3 some code here' },
    { fileId: 4, filename: 'Main4.py', fileContent: '//WRite4 some code here' },
    { fileId: 5, filename: 'Main5.py', fileContent: '//WRite5 some code here' },
    { fileId: 6, filename: 'Main6.py', fileContent: '//WRite6 some code here' },
    { fileId: 7, filename: 'Main7.py', fileContent: '//WRite7 some code here' },
    { fileId: 8, filename: 'Main8.py', fileContent: '//WRite8 some code here' },
    { fileId: 9, filename: 'Main9.py', fileContent: '//WRite9 some code here' },
    { fileId: 10, filename: 'Main10.py', fileContent: '//WRite10 some code here' },
]

const Workspace = () => {
    const [editorLanguage, setEditorLanguage] = useState('javaScript');
    const [editorTheme, setEditorTheme] = useState('vs-dark');
    const [connectedUsers, setConnectedUsers] = useState(EXAMPLE_CONNECTED_USERS);
    const [files, setFiles] = useState(EXAMPLE_FILE_LIST);
    const [currentSelectedFile, setCurrentSelectedFile] = useState(EXAMPLE_FILE_LIST[0]);

    const location = useLocation();
    const codeRef = useRef(null);
    const socketRef = useRef(null);
    const reactNavigate = useNavigate();
    const { roomId } = useParams()

    useEffect(() => {
        setCurrentSelectedFile(EXAMPLE_FILE_LIST[0]);
        const handleErrors = (err) => {
            console.log('Socket error: ', err);
            toast.error('Socket connection failed, try again later');
            reactNavigate('/');
        }
        const initScoketClient = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            console.log('Socket Connection Done')
            socketRef.current.emit(SOCKET_ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            //  Listeinging for joined event
            socketRef.current.on(SOCKET_ACTIONS.JOINED, ({ connectedUsers, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined the room`);
                }
                // setConnectedUsers(connectedUsers);
                socketRef.current.emit(SOCKET_ACTIONS.SYNC_CODE, {
                    editorCode: codeRef.current,
                    socketId
                });
            })

            socketRef.current.on(SOCKET_ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setConnectedUsers((prev) => {
                    return prev.filter(connectedUser => connectedUser.socketId !== socketId)
                })
            })
        }
        initScoketClient();
        return () => {
            socketRef.current.off(SOCKET_ACTIONS.JOINED);
            socketRef.current.off(SOCKET_ACTIONS.DISCONNECTED);
            socketRef.current.disconnect();
        }
    }, [])


    const handleFileChange = (newFileContent) => {
        setFiles(prevFiles =>
            prevFiles.map(file => (file.fileId === currentSelectedFile.fileId ? { ...file, fileContent: newFileContent } : file))
        );
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

    const handleLeaveRoom = () => {
        reactNavigate('/');
    }

    if (!location.state) {
        return <Navigate to='/room' />
    }

    return (<div className='##mainwrap h-screen flex p-2'>
        <ToastContainer />
        <div className="##aside flex flex-col justify-between">
            <div className="##asideInner h-3/5 relative">
                <div className="##logo p-1">
                    <h2 className='gifLogoAnimation h-14 text-xl text-white font-mono flex justify-center items-center'>
                        Synchrotek
                    </h2>
                </div>
                {/* ----------------------------------- */}
                <UpperSideBar
                    connectedUsers={connectedUsers}
                    files={files}
                    setCurrentSelectedFile={setCurrentSelectedFile}
                />
            </div>
            <div className='flex flex-col w-full gap-4 z-20'>
                <button className='btn btn-accent font-semibold'>TO-DO</button>
                <button className='btn btn-accent font-semibold' onClick={handleCopyRoomId}
                >Copy ROOM ID</button>
                <button className='btn btn-outline btn-warning font-semibold'
                    onClick={handleLeaveRoom}
                >LEAVE</button>
            </div>
        </div>
        <div className="w-full py-1 ml-3">
            <WorksapceHeader
                setEditorLanguage={setEditorLanguage} setEditorTheme={setEditorTheme}
                currentSelectedFileName={currentSelectedFile.filename}
            />
            <CodeEditor
                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={(editorCode) => {
                    codeRef.current = editorCode;
                }}
                editorLanguage={editorLanguage} editorTheme={editorTheme}
                currentSelectedFile={currentSelectedFile}
                handleFileChange={handleFileChange}
            />
        </div>
    </div>
    )
}

export default Workspace