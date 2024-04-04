import React, { useState } from 'react'
import Client from './Client';
import CodeEditor from './CodeEditor';

const Workspace = () => {

    const [clients, setClients] = useState([
        { socketId: 1, username: 'Sam k' },
        { socketId: 2, username: 'Alm P' },
        { socketId: 2, username: 'Alm P' },
        { socketId: 2, username: 'Alm P' },
        { socketId: 2, username: 'Alm P' },
        { socketId: 1, username: 'Sam k' },
    ]);

    return (<div className='##mainwrap h-screen flex p-2'>
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
                <button className='btn btn-accent font-semibold'>Copy ROOM ID</button>
                <button className='btn btn-outline btn-warning font-semibold'>LEAVE</button>
            </div>
        </div>
        <div className="##editWrap w-full py-1 ml-3">
            <CodeEditor
                code={`  
                
const CodeEditor = () => {
  return (
    <div>CodeEditor</div>
  )
}

export default CodeEditor
                `}
            />
        </div>
    </div>
    )
}

export default Workspace