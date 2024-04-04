import React, { useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'

const CodeEditor = ({ code }) => {
    const [editorCode, setEditorCode] = useState(code.trim());
    function handleEditorChange(value, event) {
        setEditorCode(value);
    }

    return (
        <Editor className='bg-orange-300'
            width="100%" height="100%"
            theme="vs-dark"
            defaultLanguage="javascript" defaultValue={editorCode}
            onChange={handleEditorChange}
        />
    )
}

export default CodeEditor