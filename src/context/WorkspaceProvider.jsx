import { createContext, useEffect, useRef, useState } from 'react';
import { getCookie } from '../utils/authUtils/helper';

export const WorkspaceContext = createContext(null);

const WorkspaceProvider = ({ children }) => {
    const token = getCookie('token');
    const socketRef = useRef(null);
    const [allMessages, setAllMessages] = useState([]);
    const [allDbFetchedMessages, setAllDbFetchedMessages] = useState([]);
    const currentSelectedFileIndexRef = useRef(0);
    const [files, setFiles] = useState([
        {
            fileId: 'demo', filename: 'demo',
            fileContent: '// Hello world', language: 'javascript'
        }
    ]);
    const [userSavedProjects, setUserSavedProjects] = useState([]);
    const [currentSelectedFile, setCurrentSelectedFile] = useState(files[0]);
    const [selectedUserProfile, setSelectedUserProfile] = useState();
    const [isFilesSyncing, setIsFilesSyncing] = useState(true);
    const [isTodoApOpen, setIsTodoApOpen] = useState(false);
    const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
    const [todos, setTodos] = useState([]);

    return (
        <WorkspaceContext.Provider value={{
            socketRef, token,
            currentSelectedFile, setCurrentSelectedFile,
            allMessages, setAllMessages,
            allDbFetchedMessages, setAllDbFetchedMessages,
            userSavedProjects, setUserSavedProjects,
            currentSelectedFileIndexRef,
            files, setFiles,
            selectedUserProfile, setSelectedUserProfile,
            isFilesSyncing, setIsFilesSyncing,
            isTodoApOpen, setIsTodoApOpen,
            isRoomDetailsOpen, setIsRoomDetailsOpen,
            todos, setTodos,
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceProvider