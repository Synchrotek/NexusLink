/* eslint-disable react/prop-types */
import Avatar from 'react-avatar'

const Client = ({ username }) => {
    return (
        <li className='##client flex flex-row items-center my-2'>
            <Avatar name={username} size={40} round={10} />
            <span className='##username ml-2'>{username}</span>
        </li>
    )
}

export default Client