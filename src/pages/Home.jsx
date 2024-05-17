import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from './Layout.jsx'
import { getCookie } from '../utils/authUtils/helper.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Home = () => {
    const navigate = useNavigate();
    const [allRooms, setAllRooms] = useState([]);

    useEffect(() => {
        getAllRooms();
    }, []);

    const getAllRooms = async () => {
        const token = getCookie('token');
        await axios({
            method: 'GET',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/rooms`,
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).then(response => {
            const allFetchedRooms = response.data;
            setAllRooms(allFetchedRooms);
        }).catch(err => {
            console.log('ROOM CREATE ERROR', err.response.data);
            toast.error(err.response.data.error);
        });
    }

    const handleJoinRoom = (currentRoomId) => {
        navigate(`/room`, {
            state: {
                roomId: currentRoomId
            }
        });
    }
    const handleDeleteRoom = async (currentRoomId) => {
        const token = getCookie('token');
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const dataToSend = {
            roomId: currentRoomId,
            givenCreatorId: currentUser._id
        }
        await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/rooms/delete`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: dataToSend
        }).then(response => {
            // console.log(response.data);
            getAllRooms();
        }).catch(err => {
            console.log('ROOM CREATE ERROR', err.response.data);
            toast.error(err.response.data.error);
        });
    }

    return (
        <Layout>
            <div className="col-d-6 offset-md-1 text-center">
                <h1 className='p-5 pb-3 border-b-[1px] mx-[8%] text-xl'>
                    All existing rooms
                </h1>
                {/* <hr /> */}
                <div className='flex flex-wrap'>
                    {allRooms.length > 0 && allRooms.map(eachRoom => (
                        <div className="card w-1/2 bg-base-100 shadow-xl" key={eachRoom._id}>
                            <div className="card-body items-center text-center text-sm">
                                <h2 className="card-title">- {eachRoom.name} -</h2>
                                <p className='text-xs'>Id: {eachRoom.roomId}</p>
                                <p>( {eachRoom.description} )</p>
                                <p>Creator: {eachRoom.creator.cratorName}</p>
                                <p>Created on: {eachRoom.createdAt.substring(0, 10)}</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary"
                                        onClick={() => handleJoinRoom(eachRoom.roomId)}
                                    >Join Room</button>
                                    <button className="btn btn-error"
                                        onClick={() => handleDeleteRoom(eachRoom.roomId)}
                                    >Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Home