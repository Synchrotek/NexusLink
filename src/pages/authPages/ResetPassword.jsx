import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { decodeToken } from 'react-jwt'
import axios from 'axios'
import Layout from '../Layout';

const ResetPassword = () => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        newPassword: '',
        loading: false
    });
    const [passwordShow, setPasswordShow] = useState(false);

    let { token } = useParams();

    useEffect(() => {
        let { name } = decodeToken(token);
        if (token) {
            setValues({ ...values, name, token })
        }
    }, [])

    const handleChange = (e) => {
        setValues({
            ...values, newPassword: e.target.value
        });
    }

    const clickSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, loading: true })
        await axios({
            method: 'PUT',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/reset-password`,
            data: { newPassword: values.newPassword, resetPasswordToken: token }
        }).then(response => {
            console.log('RESET PASSWORD SUCCESS', response);
            toast.success(response.data.message);
        }).catch(err => {
            console.log('RESET PASSWORD ERROR', err.response.data);
            toast.error(err.response.data.error);
        });
        setValues({ ...values, loading: false })
    }

    const resetPasswordForm = () => (
        <form>
            <div>
                <input
                    className='w-full input input-bordered h-10 focus:outline-none  p-2 mt-6'
                    type={passwordShow ? 'text' : 'password'}
                    placeholder='Provide a new Password'
                    value={values.newPassword}
                    onChange={e => handleChange(e, 'email')}
                />
            </div>

            <label className='mt-1 label justify-start gap-2 cursor-pointer'>
                <input type="checkbox"
                    className='checkbox checkbox-primary border-slate-400'
                    onChange={() => setPasswordShow(!passwordShow)}
                />
                <span className='label-text'>Show Password</span>
            </label>

            <button className='btn btn-block mt-2'
                onClick={clickSubmit}
                disabled={values.loading}
            >{values.loading ? (
                <span className='loading loading-spinner'></span>
            ) : 'Reset password'}
            </button>
        </form>
    )

    return (
        <Layout className='backgroundWallpaper_dim min-h-screen flex flex-col items-center justify-center min-w-96 mx-auto'>
            <ToastContainer />
            <div className="rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/2 px-6 py-106">
                <h1 className='text-3xl font-semibold text-center text-gray-300 mb-2'>
                    <div className='text-blue-300 text-2xl'>Reset your Password</div>
                    <p className='text-sm mt-1'>By providing a new one</p>
                </h1>
                {resetPasswordForm()}
            </div>
        </Layout>
    )
}

export default ResetPassword