import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const SocialLogin = () => {
    const [params, setParams] = useSearchParams();
    useEffect(() => {
        if (params.get('code')) {
            const githubLoginCode = params.get('code');
            // console.log('param-code: ', githubLoginCode)
            loginGithubAfterRedirect(githubLoginCode);
        }
    }, []);

    const loginGithubAfterRedirect = (githubLoginCode) => {
        const getAccessToken = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_ENDPOINT}/getAccessToken?githublogincode=${githubLoginCode}`
                );
                const { access_token } = response.data;
                getUserDetailsGithub(access_token);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        }
        const getUserDetailsGithub = async (access_token) => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_ENDPOINT}/getUserDetailsGithub`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        getAccessToken();
    }

    const handleGithubLogin = () => {
        window.location.assign(
            `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUBLOGIN_CLIENT_ID}`
        );
    }


    return (
        <div className='flex flex-col items-center gap-6 my-6'>
            <button onClick={handleGithubLogin}
                className='btn btn-lg'
            >Login with Github
            </button>
            <div className=''>
                <GoogleLogin
                    theme='filled_blue'
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>
        </div>
    )
}

export default SocialLogin