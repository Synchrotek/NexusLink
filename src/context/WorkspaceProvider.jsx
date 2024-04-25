import { createContext, useState } from 'react';

export const WorkspaceContext = createContext(null);

const WorkspaceProvider = ({ children }) => {
    const [currentSelectedFile, setCurrentSelectedFile] = useState({});

    return (
        <WorkspaceContext.Provider value={{
            currentSelectedFile, setCurrentSelectedFile
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceProvider