/* eslint-disable react/prop-types */
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdMessage } from "react-icons/md";
import { useContext, useEffect } from "react";
import { WorkspaceContext } from "../../context/WorkspaceProvider";

const WorksapceHeader = ({
    isCodeEditorPage, setEditorLanguage, setEditorTheme
}) => {
    const { currentSelectedFile } = useContext(WorkspaceContext);

    // Editor dynamic properties -------------------------------------
    const languagesAvailable = [
        'javaScript', 'typeScript',
        'cpp', 'java',
        'python', 'php',
        'html', 'css',
    ]
    const editorThemes = [
        'vs-dark', 'light'
    ]

    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => {
        return (location.pathname === path);
    }

    const EditorPageHeader = () => (
        <>
            <h1 className="h-5/6">
                {currentSelectedFile.filename}
            </h1>
            <div className="">

                {/* ---------------------------------------------------- */}

                <select className="select select-bordered capitalize w-full"
                    onChange={e => setEditorLanguage(e.target.value)}
                >{languagesAvailable.map((eachLanguage) => (
                    <option key={eachLanguage}
                        value={eachLanguage}>
                        {eachLanguage}
                    </option>
                ))}

                </select>

                <select className="select select-bordered capitalize w-full max-w-xs"
                    onChange={e => setEditorTheme(e.target.value)}
                >{editorThemes.map((eachTheme) => (
                    <option key={eachTheme}
                        value={eachTheme}>
                        {eachTheme}
                    </option>
                ))}
                </select>

                {/* ---------------------------------------------------- */}
                <button className="btn tooltip tooltip-bottom w-14 mx-1 flex justify-center" data-tip="Go to Chats">
                    <MdMessage
                        className="text-lg"
                    />
                </button>
            </div >
        </>);


    const ChatPageHeader = () => { };

    return (
        <div className={`navbar bg-slate-600 flex justify-between max-h-16`}>
            {isCodeEditorPage ?
                ChatPageHeader() : EditorPageHeader()
            }
        </div>


    )
}

export default WorksapceHeader