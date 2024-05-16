/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { WorkspaceContext } from '../../context/WorkspaceProvider'
import { IoArrowBackSharp } from 'react-icons/io5';

const RoomDetails = ({ roomDetails }) => {
    const { isRoomDetailsOpen, setIsRoomDetailsOpen } = useContext(WorkspaceContext);

    return (
        <div>
            <div className={`absolute min-w-[80vw] bg-[#153448] z-50 top-0 h-[90%] 
        mt-2 transition-all ${isRoomDetailsOpen ? 'left-0' : '-left-[100%]'}`}>
                <div className='flex mx-[10%] h-[10%] items-center pb-[3%] pt-[5%] justify-start border-b-2'>
                    <IoArrowBackSharp
                        onClick={() => setIsRoomDetailsOpen(false)}
                        className='cursor-pointer text-xl hover:scale-150 hover:text-slate-300 transition-all rounded-lg'
                    />
                    <h1 className='w-full text-center text-2xl pr-2'>
                        Room Details
                    </h1>
                </div>
                <div className='flex flex-col justify-start py-10 gap-2 h-full items-start px-20'>
                    <p>
                        <span className='font-semibold text-slate-100'>
                            RoomId : </span>
                        {roomDetails.roomId}
                    </p>
                    <p>
                        <span className='font-semibold text-slate-100'>
                            Room Name : </span>
                        {roomDetails.name}
                    </p>
                    <p>
                        <span className='font-semibold text-slate-100'>
                            Room Creator : </span>
                        {roomDetails.creator.creatorEmail}
                    </p>
                    <p>
                        <span className='font-semibold text-slate-100'>
                            Room Description : </span>
                        {roomDetails.description}
                    </p>
                    <p>
                        <span className='font-semibold text-slate-100'>
                            Room Created on : </span>
                        {roomDetails.createdAt.substring(0, 10)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RoomDetails