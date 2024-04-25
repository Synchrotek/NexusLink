/* eslint-disable react/prop-types */
import { useState } from 'react'
import ConnectedUsersBar from './ConnectedUsersBar'
import FileListBar from './FileListBar'
import { BiAdjust } from "react-icons/bi";

const UpperSideBar = ({
    connectedUsers, files, setCurrentSelectedFile, currentSelectedFile
}) => {

    const [isFilesTabOpen, setIsFilesTabOpen] = useState(false);

    const ConnectedUserList = () => (
        connectedUsers.map(connectedUser => (
            <ConnectedUsersBar key={`users-${connectedUser.socketId}`}
                username={connectedUser.username}
            />
        ))
    )

    const FileList = () => (
        files.map(file => (
            <FileListBar key={file.fileId}
                file={file}
                currentSelectedFile={currentSelectedFile}
                setCurrentSelectedFile={setCurrentSelectedFile}
            />

        ))
    )

    return (
        <div className="overflow-x-hidden overflow-y-scroll hideScrollBar w-[200px] h-full flex flex-col mt-10"
        >
            <div role="tablist" className="absolute top-16 tabs tabs-bordered">
                <button
                    onClick={() => setIsFilesTabOpen(false)}
                    role="tab" className={`tab ${isFilesTabOpen ? '' : 'tab-active'}`}>Users
                </button>
                <button
                    onClick={() => setIsFilesTabOpen(true)}
                    role="tab" className={`tab ${isFilesTabOpen ? 'tab-active' : ''}`}>Files
                </button>
            </div>
            <div className=''>
                {isFilesTabOpen ? (<>
                    {FileList()}
                </>) : (<>
                    {ConnectedUserList()}
                </>)}
            </div>
        </div>
    )
}

export default UpperSideBar