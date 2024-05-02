import React, { useState } from 'react'
import { v4 as uuidV4, validate } from 'uuid'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout'
import { getCookie } from '../utils/authUtils/helper'

const RoomSelect = () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = getCookie('token');

    const location = useLocation();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        roomId: location.state?.roomId || '',
        username: currentUser.name,
        loading: false
    });

    const handleChange = (e, value) => {
        setValues({
            ...values,
            [value]: e.target.value
        });
    }

    const createNewRoom = (e) => {
        e.preventDefault();
        const newRoomId = uuidV4();
        setValues({ ...values, roomId: newRoomId });
        toast.success('New roomId creeated');
    }

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        // console.log('TO SEND REQUEST', currentUser._id, values.roomId);
        if (!values.roomId || !values.username) {
            return toast.error('ROOM ID & Username is required');
        }
        if (!validate(values.roomId)) {
            return toast.error('Invalid room ID');
        }
        const { name, email, profilePic, bio, createdAt } = JSON.parse(localStorage.getItem('user'));
        const tobeSendUsername = {
            username: values.username,
            name, email, profilePic, bio, createdAt
        }
        const dataToSendToDB = {
            roomId: values.roomId,
            creatorId: currentUser._id,
        }
        await axios({
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/rooms/new`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: dataToSendToDB
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.log('ROOM CREATE ERROR', err.response.data);
            toast.error(err.response.data.error);
        });


        navigate(`/room/${values.roomId}`, {
            state: {
                userDeatils: tobeSendUsername
            }
        });
    }

    const roomSelectForm = () => (
        <form>
            <div className='flex flex-col gap-2 mt-4'>
                <input
                    className='w-full input input-bordered h-10 focus:outline-none'
                    type="text" placeholder='Enter ROOM ID'
                    value={values.roomId}
                    onChange={e => handleChange(e, 'roomId')}
                />
                <input
                    className='w-full input input-bordered h-10 focus:outline-none'
                    type="text" placeholder='Enter your Username'
                    value={values.username}
                    onChange={e => handleChange(e, 'username')}
                />
                <div className='flex justify-between items-center my-4 mx-1'>
                    <button to="/signup"
                        className='btn btn-md lg:w-9/12 btn-accent'
                        onClick={handleJoinRoom}
                    >Join the Room
                    </button>
                    <span className='text-right'>
                        You can also<br />create A&nbsp;
                        <button className='hover:underline hover:text-green-100 text-green-400'
                            onClick={createNewRoom}
                        >new room
                        </button>
                    </span>
                </div>
            </div>
        </form>
    )

    return (
        <Layout navFixed={true} className='backgroundWallpaper_dim  min-h-screen flex flex-col items-center justify-center min-w-96 mx-auto'>
            <ToastContainer />
            <div className="rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5 w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/2 px-6 pb-10 pt-3">
                <h1 className='text-3xl font-semibold text-center text-gray-300 my-6 mx-10'>
                    Create or Join
                    <div className='text-blue-300'>A Room</div>
                    <hr className='mt-4' />
                </h1>
                <div className='flex justify-center mb-4'>
                    <img className='w-1/2' src="/codeLogo1.png" alt="" />
                </div>
                <h4>Paste Invitation Room ID</h4>
                {roomSelectForm()}
            </div>
        </Layout>
    )
}

export default RoomSelect