/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import SOCKET_ACTIONS from '../../utils/socketConn/SocketActions';

const CodeEditor = ({
    socketRef, roomId, onCodeChange, editorLanguage, editorTheme, currentSelectedFile, handleFileChange
}) => {
    const [editorCode, setEditorCode] = useState();


    useEffect(() => {
        setEditorCode(currentSelectedFile.fileContent)
    }, [currentSelectedFile])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(SOCKET_ACTIONS.CODE_CHANGE, ({ editorCode }) => {
                if (editorCode !== null) {
                    // console.log(editorCode);
                    // console.log('editor code coming')
                    setEditorCode(editorCode)
                }
            });
        }
        return () => {
            socketRef.current.off(SOCKET_ACTIONS.CODE_CHANGE);
        }
    }, [socketRef.current])

    const handleEditorChange = (value, e) => {
        setEditorCode(e.target.value);
        if (socketRef.current) {
            onCodeChange(editorCode);
            // Perform operations related to editorCode state change
            // For example, emit an event to broadcast the code change
            socketRef.current.emit(SOCKET_ACTIONS.CODE_CHANGE, {
                roomId,
                editorCode
            });
        }
    }

    return (
        <Editor className='bg pt-2'
            width="100%" height="90%"
            theme={editorTheme}
            language={editorLanguage}
            value={editorCode}
            onChange={handleFileChange}
        />
    )
}

export default CodeEditor