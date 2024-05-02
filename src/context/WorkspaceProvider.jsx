import { createContext, useEffect, useRef, useState } from 'react';
import { getCookie } from '../utils/authUtils/helper';

export const WorkspaceContext = createContext(null);

const WorkspaceProvider = ({ children }) => {
    const token = getCookie('token');
    const socketRef = useRef(null);
    const [currentSelectedFile, setCurrentSelectedFile] = useState(
        { fileId: 1, filename: 'Main1.py', fileContent: '1' }
    );
    const [allMessages, setAllMessages] = useState([]);
    const [allDbFetchedMessages, setAllDbFetchedMessages] = useState([]);
    const [currentSelectedFileIndex, setCurrentSelectedFileIndex] = useState(0);

    return (
        <WorkspaceContext.Provider value={{
            socketRef, token,
            currentSelectedFile, setCurrentSelectedFile,
            allMessages, setAllMessages,
            allDbFetchedMessages, setAllDbFetchedMessages,
            currentSelectedFileIndex, setCurrentSelectedFileIndex
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceProvider