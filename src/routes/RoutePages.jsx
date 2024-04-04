import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Singin from '../pages/authPages/Signin'
import Singup from '../pages/authPages/Singup'
import AccountActivate from '../pages/authPages/AccountActivate'
import RoomSelect from '../pages/RoomSelect.jsx'
import PrivateRoutes from './PrivateRoleRoutes.jsx'
import UserProfile from '../pages/UserProfile.jsx'
import ForgotPassword from '../pages/authPages/ForgotPassword.jsx'
import ResetPassword from '../pages/authPages/ResetPassword.jsx'
import Workspace from '../pages/workspacePages/Workspace.jsx'

const RoutePages = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signup' element={<Singup />} />
                <Route path='/signin' element={<Singin />} />
                <Route path='/auth/activate/:token' element={<AccountActivate />} />
                <Route path='/auth/password/forogt' element={<ForgotPassword />} />
                <Route path='/auth/password/reset/:token' element={<ResetPassword />} />

                {/* Private Routes ------------------------------- */}
                <Route element={<PrivateRoutes />}>
                    <Route path='/room' element={<RoomSelect />} />
                    <Route path='/room/:roomId' element={<Workspace />} />
                    <Route path='/user' element={<UserProfile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutePages   