import { createContext, useRef, useState } from 'react';

export const WorkspaceContext = createContext(null);

const WorkspaceProvider = ({ children }) => {
    const [currentSelectedFile, setCurrentSelectedFile] = useState([
        { fileId: 1, filename: 'Main1.py', fileContent: '1' }
    ]);
    const [currentSelectedFileIndex, setCurrentSelectedFileIndex] = useState(0);

    return (
        <WorkspaceContext.Provider value={{
            currentSelectedFile, setCurrentSelectedFile,
            currentSelectedFileIndex, setCurrentSelectedFileIndex
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceProvider