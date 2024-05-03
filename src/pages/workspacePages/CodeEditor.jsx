/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import SOCKET_ACTIONS from '../../utils/socketConn/SocketActions';
import { WorkspaceContext } from '../../context/WorkspaceProvider';

const CodeEditor = ({
    socketRef, setFiles, editorLanguage, editorTheme,
    handleCurrentSelectedFileRefChange, handleFileChange

}) => {
    const {
        currentSelectedFile, currentSelectedFileIndexRef,
    } = useContext(WorkspaceContext);
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(SOCKET_ACTIONS.CODE_CHANGE, ({ files, fileId }) => {
                // console.log('-----------------------------');
                // console.log(files.find(file => file.fileId === fileId));

                setFiles(files);
                if (isNaN(currentSelectedFileIndexRef.current.fileId)) {
                    currentSelectedFileIndexRef.current = 0;
                }
                // currentSelectedFileIndexRef.current = fileId - 1;


                // if (currentSelectedFile.fileId === fileId) {
                //     setCurrentSelectedFile(files.find(file => file.fileId === fileId));
                // }
                // console.log(currentSelectedFile, currentSelectedFileIndex);
                console.log('lllll', currentSelectedFileIndexRef.current, fileId)
                handleCurrentSelectedFileRefChange(files[currentSelectedFileIndexRef.current]);
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
            language={editorLanguage}
            value={currentSelectedFile.fileContent}
            onChange={handleFileChange}
        />
    )
}

export default CodeEditor