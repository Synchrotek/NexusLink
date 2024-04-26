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
const EXAMPLE_FILE_LIST = [
    { fileId: 1, filename: 'Main1.py', fileContent: '' },
    { fileId: 2, filename: 'Main2.py', fileContent: '' },
    { fileId: 3, filename: 'Main3.py', fileContent: '' },
    { fileId: 4, filename: 'Main4.py', fileContent: '' },
    { fileId: 5, filename: 'Main5.py', fileContent: '' },
    { fileId: 6, filename: 'Main6.py', fileContent: '' },
    { fileId: 7, filename: 'Main7.py', fileContent: '' },
    { fileId: 8, filename: 'Main8.py', fileContent: '' },
    { fileId: 9, filename: 'Main9.py', fileContent: '' },
    { fileId: 10, filename: 'Main10.py', fileContent: '' },
]

const Workspace = () => {
    const [editorLanguage, setEditorLanguage] = useState('javaScript');
    const [editorTheme, setEditorTheme] = useState('vs-dark');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [files, setFiles] = useState(EXAMPLE_FILE_LIST);
    const [currentSelectedFile, setCurrentSelectedFile] = useState(EXAMPLE_FILE_LIST[0]);

    const location = useLocation();
    const socketRef = useRef(null);
    const reactNavigate = useNavigate();
    const { roomId } = useParams()

    useEffect(() => {
        console.log('UseEffect called ----------------------------');
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
                username: location.state?.userDeatils.username,
            });

            //  Listeinging for joined event
            socketRef.current.on(SOCKET_ACTIONS.JOINED, ({ connectedUsers, username, socketId }) => {
                if (username !== location.state?.userDeatils.username) {
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined the room`);
                }
                setConnectedUsers(connectedUsers);
                socketRef.current.emit(SOCKET_ACTIONS.SYNC_CODE, {
                    files,
                    socketId
                });
            });

            socketRef.current.on(SOCKET_ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
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
        console.log(files[4]);
    }, [files])

    const handleFileChange = (newFileContent) => {
        setFiles(prevFiles => {
            const newFiles = prevFiles.map(file => {
                if (file.fileId === currentSelectedFile.fileId) {
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
        // console.log(files[0]);
        // if (socketRef.current) {
        // socketRef.current.emit(SOCKET_ACTIONS.CODE_CHANGE, {
        //     roomId, files, fileId: currentSelectedFile.fileId
        // })
        // }
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
                    currentSelectedFile={currentSelectedFile}
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
                setFiles={setFiles}
                editorLanguage={editorLanguage} editorTheme={editorTheme}
                currentSelectedFile={currentSelectedFile}
                handleFileChange={handleFileChange}
                setCurrentSelectedFile={setCurrentSelectedFile}
            />
        </div>
    </div>
    )
}

export default Workspace