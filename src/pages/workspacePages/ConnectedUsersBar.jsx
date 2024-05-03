/* eslint-disable react/prop-types */
import { useContext } from 'react'
import Avatar from 'react-avatar'
import { WorkspaceContext } from '../../context/WorkspaceProvider'

const ConnectedUsersBar = ({ username, userDeatils }) => {

    const { setSelectedUserProfile } = useContext(WorkspaceContext);

    return (
        <li className='flex flex-row items-center gap-2 my-2'>
            <Avatar name={username} size={40}
                className='rounded-md cursor-pointer'
                onClick={() => setSelectedUserProfile(userDeatils)}
            />
            <span className=''>{username}</span>
        </li>
    )
}

export default ConnectedUsersBar
