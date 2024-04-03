import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { isAuth } from '../../utils/authUtils/helper';
import Layout from '../Layout'


const Singup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        loading: false
    });
    const [passwordShow, setPasswordShow] = useState(false);

    const handleChange = (e, value) => {
        setValues({
            ...values,
            [value]: e.target.value
        });
    }

    const handleInputErrors = ({ name, email, password, confirmPassword }) => {
        if (!name || !email || !password || !confirmPassword) {
            toast.error('Please fill in all the fields');
            return false;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        return true;
    }


    const clickSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, loading: true })
        const dataToSend = { name: values.name, email: values.email, password: values.password }
        if (handleInputErrors(values)) {
            await axios({
                method: 'POST',
                url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/signup`,
                data: dataToSend
            }).then(response => {
                console.log('SIGNIN SUCCESS', response);
                setValues(
                    { ...values, name: '', email: '', password: '', loading: false }
                );
                toast.success(response.data.message);
            }).catch(err => {
                console.log('SIGNIN ERROR', err.response.data);
                setValues({ ...values, loading: false });
                toast.error(err.response.data.error);
            });
        } else {
            setValues({ ...values, loading: false });
        }
    }

    const signupForm = () => (
        <form>
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
                    value={values.email}
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
                    type={passwordShow ? 'text' : 'password'} placeholder='Enter password'
                    value={values.password}
                    onChange={(e => handleChange(e, 'password'))}
                />
            </div>
            <div>
                <label className='label p-2'>
                    <span className='text-base label-text'>
                        Confirm Password :
                    </span>
                </label>
                <input
                    className='w-full input input-bordered h-10 focus:outline-none'
                    type={passwordShow ? 'text' : 'password'} placeholder='Confirm password'
                    value={values.confirmPassword}
                    onChange={(e => handleChange(e, 'confirmPassword'))}
                />
            </div>


            <label className='mt-1 label justify-start gap-2 cursor-pointer'>
                <input type="checkbox"
                    className='checkbox checkbox-primary border-slate-400'
                    onChange={() => setPasswordShow(!passwordShow)}
                />
                <span className='label-text'>Show Password</span>
            </label>

            <Link to="/signin"
                className='text-sm hover:underline hover:text-blue-500 inline-block mt-2'
            >Already have an account?
            </Link>
            <div>
                <button className='btn btn-block mt-2'
                    onClick={clickSubmit}
                    disabled={values.loading}
                >{values.loading ? (
                    <span className='loading loading-spinner'></span>
                ) : 'Sign Up'}
                </button>
            </div>
        </form>
    )

    return (
        <Layout className='backgroundWallpaper min-h-screen flex flex-col items-center justify-center min-w-96 mx-auto'>
            <ToastContainer />
            <div className="rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/2 px-6 py-106">
                {isAuth() ? <Navigate to='/' /> : null}
                <h1 className='text-3xl font-semibold text-center text-gray-300 my-2'>
                    <span className='text-blue-300'>Let's</span>
                    &nbsp;Sign Up
                </h1>
                {signupForm()}
            </div>
        </Layout>
    )
}

export default Singup







