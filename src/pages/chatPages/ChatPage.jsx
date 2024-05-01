import React from 'react'
import { sampleUsers, sampleMessage } from '../../constants/sampleData.js'
import MessageComponent from './MessageComponent.jsx'

const ChatPage = () => {
    return (<>
        <div className='bg-orange-400 w-full h-[80%] text-black'>
            {sampleMessage.map((msg) => (
                <MessageComponent key={msg._id}
                    message={msg} user={sampleUsers[0]}
                />
            ))}
        </div>
        <form className='h-[10%] flex w-full items-center px-2'>
            <label htmlFor='fileInput' className='btn hover:bg-slate-700'>File</label>
            <input type="file" className='hidden' id='fileInput' />
            <input type='text'
                className='input w-full focus-within:outline-none'
                placeholder="Type Message here..."
            />
            <button className='btn hover:bg-slate-700'>Send</button>
        </form>
    </>
    )
}

export default ChatPage