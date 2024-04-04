import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import Layout from './Layout'
import { isAuth, getCookie, signout, updateUser } from '../utils/authUtils/helper'

const UserProfile = () => {
    const navigate = useNavigate();
    const [updateMode, setUpdateMode] = useState(false);
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        loading: false
    });
    const [passwordShow, setPasswordShow] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [])

    const loadProfile = async () => {
        const token = getCookie('token');
        const userId = isAuth()._id;
        await axios({
            method: 'GET',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/user/${userId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log('USER PROFILE GET', response);
            const { name, email } = response.data;
            setValues({ ...values, name, email })
        }).catch(err => {
            console.log('USER PROFILE UPDATE ERROR', err.response);
            if (err.response.status === 401) {
                signout(() => {
                    navigate('/');
                });
            }
        })
    }

    const handleChange = (e, value) => {
        setValues({
            ...values,
            [value]: e.target.value
        });
    }

    const clickSubmit = async (e) => {
        e.preventDefault();
        const token = getCookie('token');
        if (!updateMode) {
            return setUpdateMode(true);
        }
        setValues({ ...values, loading: true })
        const dataToSend = { name: values.name, password: values.password }
        await axios({
            method: 'PUT',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/user/update`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: dataToSend
        }).then(response => {
            console.log(response);
            console.log('USER PROFILE UPDATE SUCCESS', response);
            updateUser(response, () => {
                setValues(
                    { ...values, password: '', loading: false }
                );
                toast.success('Profile updated Successfully');
                setUpdateMode(false);
            })
        }).catch(err => {
            console.log('USER PROFILE UPDATE ERROR', err.response.data);
            setValues({ ...values, loading: false });
            toast.error(err.response.data.error);
        });
    }

    const updateUserForm = () => (<form>
        <div>
            <label className='label p-2'>
                <span className='text-base label-text'>
                    Full Name :
                </span>
            </label>
            <input
                className='w-full input input-bordered h-10 focus:outline-none'
                type="text" placeholder='Enter your name'
                value={values.name}
                disabled={!updateMode}
                onChange={(e => handleChange(e, 'name'))}
            />
        </div>
        <div>
            <label className='label p-2'>
                <span className='text-base label-text'>
                    Email :
                </span>
            </label>
            <input
                className='w-full input input-bordered h-10 focus:outline-none'
                type="email" placeholder='Enter your email'
                value={values.email} disabled
                onChange={(e => handleChange(e, 'email'))}
            />
        </div>
        <div>
            <label className='label p-2'>
                <span className='text-base label-text'>
                    Password :
                </span>
            </label>
            <input
                className='w-full input input-bordered h-10 focus:outline-none'
                type={passwordShow ? 'text' : 'password'} placeholder='Enter your password to update'
                value={values.password}
                onChange={(e => handleChange(e, 'password'))}
                disabled={!updateMode}
            />
        </div>


        <label className='mt-1 label justify-start gap-2 cursor-pointer'>
            <input type="checkbox"
                className='checkbox checkbox-primary border-slate-400'
                onChange={() => setPasswordShow(!passwordShow)}
            />
            <span className='label-text'>Show Password</span>
        </label>


        <Link to="/auth/password/forogt"
            className='text-sm hover:underline hover:text-blue-500 inline-block mt-3'
        >Forgot Password
        </Link>

        <div>
            <button className='btn btn-block mt-2'
                onClick={clickSubmit}
                disabled={values.loading}
            >{values.loading ? (
                <span className='loading loading-spinner'></span>
            ) : (
                updateMode ? 'Update' : 'Edit'
            )}
            </button>
        </div>
    </form>
    )

    return (
        <Layout navFixed={true} className='backgroundWallpaper_dim min-h-screen flex flex-col items-center justify-center min-w-96 mx-auto'>
            <ToastContainer />
            <div className="rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/2 px-6 py-106">
                {!isAuth() ? <Navigate to='/signin' /> : null}
                <h1 className='text-3xl font-semibold text-center text-gray-300 my-2'>
                    <span className={!updateMode ? 'hidden' : ''}>Update</span>
                    &nbsp;Your Profile
                </h1>
                {updateUserForm()}
            </div>
        </Layout>
    )
}

export default UserProfile