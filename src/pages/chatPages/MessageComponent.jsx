import RenderAttachment from './RenderAttachment';
import { fileFormat } from './fileFearures';

const MessageComponent = ({ message, currentUserId, senderObject }) => {
    const { sender, content, attachments = [], createdAt } = message;

    const isSameSender = currentUserId === sender._id;

    return (<div className={`chat flex flex-col px-3 ${isSameSender ? 'chat-end' : 'chat-start'}`}>


        <div className="chat-header">
            {isSameSender ? 'You' : sender.name}
            {/* <time className="text-xs ml-2 opacity-50">2 hours ago</time> */}
        </div>

        <div className="chat-bubble p-2">{content}
            {attachments.length > 0 && attachments.map((attachment, index) => {
                const url = attachment.url;
                const filename = attachment.public_id;
                const fileType = fileFormat(url);

                return <div key={index}>
                    <a href={url}
                        target='_blank'
                        download
                    >
                        {RenderAttachment(fileType, url, filename)}
                    </a>
                </div>
            })}
        </div></div>
    )
}

export default MessageComponent