import React from 'react'
import Layout from '../Layout'

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        buttonText: 'Get Password reset Link'
    });
    return (
        <Layout>
            ForgotPassword
        </Layout>
    )
}

export default ForgotPassword