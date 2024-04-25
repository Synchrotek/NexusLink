/* eslint-disable react/prop-types */
import Avatar from 'react-avatar'

const ConnectedUsersBar = ({ username }) => {
    return (
        <li className='flex flex-row items-center gap-2 my-2'>
            <Avatar name={username} size={40} round={10}
                className=''
            />
            <span className=''>{username}</span>
        </li>
    )
}

export default ConnectedUsersBar
