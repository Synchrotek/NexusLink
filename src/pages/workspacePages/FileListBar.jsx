/* eslint-disable react/prop-types */
import { FaFile } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const FileListBar = ({
    file, handleCurrentSelectedFileRefChange, handleDeleteFile,
    currentSelectedFileIndexRef
}) => {
    const HanleSelectAnewFile = () => {
        // console.log('FROM FL:', file);
        currentSelectedFileIndexRef.current = file.fileId;
        handleCurrentSelectedFileRefChange(file);
    }

    return (
        <li className={`flex flex-row items-center justify-between gap-2 my-2 btn`}
        ><FaFile />
            <button
                onClick={HanleSelectAnewFile}
            >{file.filename}
            </button>
            <button className="p-1 rounded-md hover:bg-orange-400 hover:text-black"
                onClick={e => handleDeleteFile(e, file.fileId)}
            ><MdOutlineDelete />
            </button>
        </li>
    )
}

export default FileListBar