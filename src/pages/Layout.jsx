import { FaCodeMerge } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuth, signout } from '../utils/authUtils/helper'

const Layout = ({ children, navFixed, className }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => {
        return (location.pathname === path);
    }

    return (
        <div className='h-screen'>
            {/* NavBar --------------------------------------------- */}
            <div className={`navbar bg-slate-600 flex justify-between px-4
                ${navFixed ? 'fixed' : ''}`}>
                <div className="flex gap-2 items-center">
                    <Link to='/' className='text-white'>
                        NexusLink
                    </Link>
                    <a href='https://github.com/Synchrotek/NexusLink'
                        className='tooltip tooltip-bottom' data-tip="Source code"
                    ><FaCodeMerge />
                    </a>
                </div>
                <div className="navbar-end gap-3">
                    {isAuth() ? (<>
                        <Link to='/room'
                            className={`btn btn-info border-none
                            ${isActive('/room') ? '' : 'btn-outline'}`}
                        ><p className='text-white'>Join Room</p>
                        </Link>
                        <Link to='/user'
                            className={`btn btn-info border-none
                            ${isActive('/user') ? '' : 'btn-outline'}`}
                        ><p className='text-white'>Edit Profile</p>
                        </Link>
                        <Link className="btn btn-outline btn-error"
                            onClick={() => {
                                signout(() => {
                                    navigate(0)
                                    navigate('/signin')
                                });
                            }}><p className='text-white'>LogOut</p>
                        </Link>
                    </>) : (<>
                        <Link to='/signin'
                            className={`btn btn-info border-none
                            ${isActive('/signin') ? '' : 'btn-outline'}`}
                        ><p className='text-white'>SignIn</p>
                        </Link>
                        <Link to='/signup'
                            className={`btn btn-info border-none
                            ${isActive('/signup') ? '' : 'btn-outline'}`}
                        ><p className='text-white'>SignUp</p>
                        </Link>
                    </>)}
                </div>
            </div>

            {/* Children prop --------------------------------------------- */}
            <div className={className} >
                {children}
            </div>
        </div>
    )
}

export default Layout