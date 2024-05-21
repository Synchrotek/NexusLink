import { useState } from 'react'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Layout from '../Layout'

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        loading: false
    });

    const handleChange = (e, value) => {
        setValues({
            ...values,
            [value]: e.target.value
        });
    }

    const clickSubmit = async (e) => {
        e.preventDefault();
        setValues({ ...values, loading: true })
        await axios({
            method: 'PUT',
            url: `${import.meta.env.VITE_BACKEND_ENDPOINT}/forgot-password`,
            data: { email: values.email }
        }).then(response => {
            // console.log('FORGOT PASSWORD SUCCESS', response);
            toast.success(response.data);
        }).catch(err => {
            console.log('FORGOT PASSWORD ERROR', err.response.data);
            toast.error(err.response.data.error);
            setValues({ ...values, loading: false })
        });
        setValues({ email: '', loading: false })
    }


    const forgotPasswordForm = () => (
        <form>
            <div>
                <input
                    className='w-full input input-bordered h-10 focus:outline-none  p-2 mt-6'
                    type='email' placeholder='Provide your Email'
                    value={values.email}
                    onChange={e => handleChange(e, 'email')}
                />
            </div>

            <button className='btn btn-block mt-2'
                onClick={clickSubmit}
                disabled={values.loading}
            >{values.loading ? (
                <span className='loading loading-spinner'></span>
            ) : 'Get password reset link'}
            </button>
        </form>
    )


    return (
        <Layout className='backgroundWallpaper_dim min-h-screen flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className="rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-3/4 sm:w-1/2 md:w-1/2 lg:w-1/2 px-6 py-106">
                <h1 className='text-3xl font-semibold text-center text-gray-300 mb-2'>
                    <div className='text-blue-300 text-2xl'>Forgot Password ?</div>
                    <p className='text-sm mt-1'>{"Let's"} reset It</p>
                </h1>
                {forgotPasswordForm()}
            </div>
        </Layout>
    )
}

export default ForgotPassword