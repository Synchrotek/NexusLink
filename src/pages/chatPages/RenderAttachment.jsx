import React from 'react'
import { transformImage } from './fileFearures'

const RenderAttachment = (fileType, url) => {
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
                <div className='border'>Sent File</div>
            )
    }
}

export default RenderAttachment