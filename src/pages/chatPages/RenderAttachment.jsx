import { FaFileDownload } from "react-icons/fa";
import { transformImage } from './fileFearures'

const RenderAttachment = (fileType, url, filename) => {
    switch (fileType) {
        case "video":
            return (
                <video src={url} preload='none' width={'200px'} controls />
            )
        case "audio":
            return (
                <audio src={url} preload='none' controls />
            )
        case "image":
            return (
                <img src={transformImage(url, 200)} alt="Attachment Image"
                    width={'200pxs'}
                    className='object-contain'
                />
            )

        default:
            return (
                <div className='p-1 flex items-center gap-1'>
                    <FaFileDownload />
                    {filename}
                </div>
            )
    }
}

export default RenderAttachment