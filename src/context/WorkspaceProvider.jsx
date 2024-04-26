import { createContext, useRef, useState } from 'react';

export const WorkspaceContext = createContext(null);

const WorkspaceProvider = ({ children }) => {
    const [currentSelectedFile, setCurrentSelectedFile] = useState([]);
    const currentSelectedFileIndexRef = useRef(0);

    return (
        <WorkspaceContext.Provider value={{
            currentSelectedFile, setCurrentSelectedFile,
            currentSelectedFileIndexRef
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceProvider