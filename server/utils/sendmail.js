const nodemailer = require('nodemailer');
// let userEmail = undefined;
// let userToken = undefined;

// const chaneEmailTokenVal = (email, token) => {
//     userEmail = email;
//     userToken = token;
//     AccontActivationEmail = {
//         ...AccontActivationEmail,

//     }
// }

/* // using mailtrap sandbox service -----------------------------
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
    },
});
*/

// using gmail service ----------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    // 'true' fo port 465, 'false' for all other ports
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// fnuction to give respective EmailTmplate ----------------------
const getEmailTemplate = (email, token, emailType) => {
    if (emailType === 'account-activation') {
        return {
            from: `"Sentinal Prime HQ👻" ${process.env.EMAIL_FROM}`, // sender address
            to: email,
            subject: `Account Activation Link ✔`,
            text: "Account Activation Link",
            html: `
        <h1>Click on the below link</h1>
        <h3>To Activate your Account</h3>
        <a href="${process.env.CLIENT_URL}/auth/activate/${token}">
            Click here to Activate your account to Continue.
        </a>
        <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        <br /><hr /><br />
        <p>This email is kind of sensitive</p>
        <p>Handle with care && Have a good Day ;)</p>
        <p>${process.env.CLIENT_URL}</p>
    `,
        }
    }
    if (emailType === 'reset-password') {
        return {
            from: `"Sentinal Prime HQ👻" ${process.env.EMAIL_FROM}`, // sender address
            to: email,
            subject: `Password Reset Link ✔`,
            text: "Password Reset Link",
            html: `
        <h1>Click on the below link</h1>
        <h3>To reset your password</h3>
        <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}">
            Click here to Activate your account to Continue.
        </a>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <br /><hr /><br />
        <p>This email is kind of sensitive</p>
        <p>Handle with care && Have a good Day ;)</p>
        <p>${process.env.CLIENT_URL}</p>
    `,
        }
    }
}

// Sending mail utility function ------------------------------s
const sendMail = async ({ email, token, emailType, messageToShow }) => {
    let responseToSend;
    await transporter.sendMail(getEmailTemplate(email, token, emailType))
        .then(emailSent => {
            // console.log("EMAIL SENT", emailSent);
            responseToSend = {
                success: true,
                message: messageToShow
            }
        }).catch(err => {
            responseToSend = {
                success: false,
                message: err.message
            }
        });
    return responseToSend;
}

module.exports = sendMail;