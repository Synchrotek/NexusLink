/* eslint-disable react/prop-types */
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdMessage } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { WorkspaceContext } from "../../context/WorkspaceProvider";

const WorksapceHeader = ({
    setEditorLanguage, setEditorTheme, isChatSelected, toggleIsChatSelected
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

    useEffect(() => {
        console.log('currentSelectedFile: ', currentSelectedFile);
        console.log('currentSelectedFileName: ', currentSelectedFile.filename);
    }, [currentSelectedFile])

    const WorksapcePageHeader = () => (
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
                <button className="btn tooltip tooltip-bottom w-14 mx-1 flex justify-center z-40"
                    data-tip={isChatSelected ? "Back to Code" : "See Chats"}
                    onClick={toggleIsChatSelected}
                >
                    {isChatSelected ? (
                        <FaCode />
                    ) : (
                        <MdMessage className="text-lg" />
                    )}
                </button>
            </div >
        </>);

    return (
        <div className={`navbar bg-slate-600 flex justify-between max-h-[15%]`}>
            {WorksapcePageHeader()}
        </div>


    )
}

export default WorksapceHeader