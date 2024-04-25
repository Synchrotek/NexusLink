/* eslint-disable react/prop-types */
import { FaFile } from "react-icons/fa";

const FileListBar = ({ file, setCurrentSelectedFile }) => {

    const HanleSelectAnewFile = () => {
        setCurrentSelectedFile(file);
    }

    return (
        <li className={`flex flex-row items-center justify-start gap-2 my-2 btn`}
            onClick={HanleSelectAnewFile}
        ><FaFile />
            <button>
                {file.filename}
            </button>
        </li>
    )
}

export default FileListBar