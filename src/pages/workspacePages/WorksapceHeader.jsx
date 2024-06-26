/* eslint-disable react/prop-types */
import { FaCode } from "react-icons/fa";
import { MdSyncDisabled, MdOutlineSync, MdMessage } from "react-icons/md";
import { useContext } from "react";
import { WorkspaceContext } from "../../context/WorkspaceProvider";

const WorksapceHeader = ({
    setEditorTheme,
    handleFileLanguageChange,
    isChatSelected, toggleIsChatSelected,
    saveProject, getAllProjects,
}) => {
    const {
        token,
        setUserSavedProjects,
        currentSelectedFile,
        files,
        isFilesSyncing, setIsFilesSyncing,
    } = useContext(WorkspaceContext);

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

    const toggleIsFilesSyncing = async () => {
        if (!isFilesSyncing) {
            const userProceed = confirm("Do you want to save current work as Projct ?");
            let projectName;
            if (userProceed) {
                projectName = prompt("Name of this save: ");
                while (!projectName) {
                    projectName = prompt("Name of this save: ");
                }
                await saveProject(token, projectName, files);
            }
        } else {
            const allProjects = await getAllProjects(token);
            setUserSavedProjects(allProjects);
        }
        setIsFilesSyncing(prevIsFilesSyncing => !prevIsFilesSyncing);
    }

    const handleLanguageChange = (e) => {
        handleFileLanguageChange(e.target.value);
    }

    const WorksapcePageHeader = () => (
        <>
            <h1 className="h-5/6">
                {currentSelectedFile.filename}
            </h1>
            <div className="">

                {/* ---------------------------------------------------- */}

                <select className="select select-bordered capitalize w-full"
                    onChange={handleLanguageChange}
                    value={currentSelectedFile.language}
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
                <button className="btn tooltip tooltip-bottom w-14 mx-1 text-lg flex justify-center z-40"
                    data-tip={isFilesSyncing ? "Turn off sync" : "Turn on sync"}
                    onClick={toggleIsFilesSyncing}
                >
                    {isFilesSyncing ? (
                        <MdOutlineSync />
                    ) : (
                        <MdSyncDisabled />
                    )}
                </button>
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
            </div>
        </>);

    return (
        <div className={`navbar bg-slate-600 flex justify-between max-h-[15%]`}>
            {WorksapcePageHeader()}
        </div>
    )
}

export default WorksapceHeader