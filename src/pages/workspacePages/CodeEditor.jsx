/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import SOCKET_ACTIONS from '../../utils/socketConn/SocketActions';

const CodeEditor = ({
    socketRef, setFiles, editorLanguage, editorTheme,
    currentSelectedFile, handleFileChange, setCurrentSelectedFile
}) => {

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(SOCKET_ACTIONS.CODE_CHANGE, ({ files, fileId }) => {
                // console.log('-----------------------------');
                // console.log(files.find(file => file.fileId === fileId));
                setFiles(files);
                if (currentSelectedFile.fileId === fileId) {
                    setCurrentSelectedFile(files.find(file => file.fileId === fileId));
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

    useEffect(() => {
        console.log(currentSelectedFile.filename);
    }, [currentSelectedFile])

    return (
        <Editor className='bg pt-2'
            width="100%" height="90%"
            theme={editorTheme}
            language={editorLanguage}
            value={currentSelectedFile.fileContent}
            onChange={handleFileChange}
        />
    )
}

export default CodeEditor