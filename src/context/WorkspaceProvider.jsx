import { createContext, useEffect, useRef, useState } from 'react';
import { getCookie } from '../utils/authUtils/helper';

export const WorkspaceContext = createContext(null);

const WorkspaceProvider = ({ children }) => {
    const token = getCookie('token');
    const socketRef = useRef(null);
    const [allMessages, setAllMessages] = useState([]);
    const [allDbFetchedMessages, setAllDbFetchedMessages] = useState([]);
    const [currentSelectedFileIndex, setCurrentSelectedFileIndex] = useState(0);
    const [files, setFiles] = useState([
        {
            fileId: 'demo', filename: 'demo',
            fileContent: '// Hello world', language: 'javascript'
        }
    ]);
    const [currentSelectedFile, setCurrentSelectedFile] = useState(files[0]);

    return (
        <WorkspaceContext.Provider value={{
            socketRef, token,
            currentSelectedFile, setCurrentSelectedFile,
            allMessages, setAllMessages,
            allDbFetchedMessages, setAllDbFetchedMessages,
            currentSelectedFileIndex, setCurrentSelectedFileIndex,
            files, setFiles
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceProvider