import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAuth } from '../utils/authUtils/helper'

const PrivateRoutes = () => {
    return (<>
        {isAuth() ?
            (< Outlet />) : (
                <Navigate to='/signin' />
            )}
    </>
    )
}


export default PrivateRoutes