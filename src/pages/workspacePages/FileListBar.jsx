/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { FaFile } from "react-icons/fa";

const FileListBar = ({ file, handleCurrentSelectedFileRefChange, currentSelectedFileRef }) => {
    const HanleSelectAnewFile = () => {
        // console.log('FROM FL:', file);
        handleCurrentSelectedFileRefChange(file);
        // currentSelectedFileRef.current = file;
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