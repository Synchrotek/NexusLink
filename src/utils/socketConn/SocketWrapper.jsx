import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import SOCKET_ACTIONS from './SocketActions';

const SocketWrapper = ({ children }) => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const socket = io(import.meta.env.VITE_BACKEND_ROOT_ENDPOINT);

    useEffect(() => {
        socket.emit(SOCKET_ACTIONS.JOIN, {
            roomId,
            username: 
        })
    })

    return (
        <div>SocketWrapper</div>
    )
}

export default SocketWrapper