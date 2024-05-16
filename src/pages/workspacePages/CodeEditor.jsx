/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import SOCKET_ACTIONS from '../../utils/socketConn/SocketActions';
import { WorkspaceContext } from '../../context/WorkspaceProvider';

const CodeEditor = ({
    socketRef, setFiles, editorTheme,
    handleCurrentSelectedFileRefChange, handleFileChange

}) => {
    const {
        currentSelectedFile, currentSelectedFileIndexRef, isFilesSyncing
    } = useContext(WorkspaceContext);

    useEffect(() => {
        if (socketRef.current && isFilesSyncing) {
            socketRef.current.on(SOCKET_ACTIONS.CODE_CHANGE, ({ files, fileId }) => {
                setFiles(files);
                if (currentSelectedFileIndexRef.current === fileId) {
                    handleCurrentSelectedFileRefChange(files[currentSelectedFileIndexRef.current - 1]);
                }
            });
        } else {
            console.log('Socket code-sync error! !!!!!!!!!');
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(SOCKET_ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current, setFiles]);

    return (
        <Editor className='bg pt-2'
            width="100%" height="100%"
            theme={editorTheme}
            defaultLanguage={currentSelectedFile.language}
            language={currentSelectedFile.language}
            value={currentSelectedFile.fileContent}
            onChange={handleFileChange}
        />
    )
}

export default CodeEditor