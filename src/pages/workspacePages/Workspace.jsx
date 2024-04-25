/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import Client from './Client';
import CodeEditor from './CodeEditor';
import WorksapceHeader from './WorksapceHeader';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initSocket } from '../../utils/socketConn/socket';
import SOCKET_ACTIONS from '../../utils/socketConn/SocketActions.js';
import { ToastContainer, toast } from 'react-toastify';

const Workspace = () => {
    const [editorLanguage, setEditorLanguage] = useState('javaScript');
    const [editorTheme, setEditorTheme] = useState('vs-dark');

    const location = useLocation();
    const codeRef = useRef(null);
    const socketRef = useRef(null);
    const reactNavigate = useNavigate();
    const { roomId } = useParams();

    const [clients, setClients] = useState([]);

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

            console.log('Socket Connection Done')
            socketRef.current.emit(SOCKET_ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            //  Listeinging for joined event
            socketRef.current.on(SOCKET_ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`);
                    console.log(`${username} joined the room`);
                }
                setClients(clients);
                socketRef.current.emit(SOCKET_ACTIONS.SYNC_CODE, {
                    editorCode: codeRef.current,
                    socketId
                });
            })

            socketRef.current.on(SOCKET_ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId)
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
            <div className="##asideInner h-3/5">
                <div className="##logo p-1">
                    <h2 className='gifLogoAnimation h-14 text-xl text-white font-mono flex justify-center items-center'>
                        Synchrotek
                    </h2>
                </div>
                <h3>Connected devs :</h3>
                <div className="##clientList overflow-x-hidden overflow-y-scroll hideScrollBar h-full">
                    <ul className='menu p-4 w-80 bg-base-200 text-base-content'>
                        {clients.map(client => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className='flex flex-col w-full gap-4 z-20'>
                <button className='btn btn-accent font-semibold mb-3'>Group Chat</button>
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
                editorLanguage={editorLanguage} editorTheme={editorTheme}
                setEditorLanguage={setEditorLanguage} setEditorTheme={setEditorTheme}
            />
            <CodeEditor
                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={(editorCode) => {
                    codeRef.current = editorCode;
                }}
                editorLanguage={editorLanguage} editorTheme={editorTheme}
            />
        </div>
    </div>
    )
}

export default Workspace