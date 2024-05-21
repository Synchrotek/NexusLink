const nodemailer = require('nodemailer');

// using mailtrap sandbox service -----------------------------
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
    },
});

/* // using gmail service ----------------------------------------
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
*/

// fnuction to give respective EmailTmplate ----------------------
const getEmailTemplate = (email, token, emailType) => {
    if (emailType === 'account-activation') {
        return {
            from: `nexuslinkhq@nexuslink01.co`,
            to: email,
            subject: `Account Activation - NexusLink`,
            text: "Account Activation Link",
            html: `
    <div
    style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #FFE8C8; padding: 10px padding-bottom: 20px;">
    <h1>Click on the below link</h1>
    <h3>To Activate your Account</h3>
    <a href="${process.env.CLIENT_URL}/auth/activate/${token}">
        Click here
    </a>
    <br>

    <h4 style="text-align: center; width: 100%;">
        Or copy & paste below url in your browser.
    </h4>
    <div style="overflow-wrap: break-word; inline-size: 80%;">
        ${process.env.CLIENT_URL}/auth/activate/${token}
    </div>
    </p>
    <hr />
    <p style="display: flex; flex-direction: column; text-align: center;">
        <span>( This email contains sensitive data. )</span>
        <span>Please Handle with care</span>
        <span>-------- And Have a good Day ;) --------</span>
    </p>
    <span>NexusLink HQ</span><span>${process.env.CLIENT_URL}</span>
    </div>`,
        }
    }
    if (emailType === 'reset-password') {
        return {
            from: `nexuslinkhq@nexuslink01.co`,
            to: email,
            subject: `Password Reset - NexusLink`,
            text: "Password Reset Link",
            html: `
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #FFE8C8; padding: 10px; padding-bottom: 20px;">
    <h1>Click on the below link</h1>
    <h3>To reset your password</h3>
    <a href="${process.env.CLIENT_URL}/auth/password/reset/${token}">
        Click here
    </a>
    <br>
    <h4 style="text-align: center; width: 100%;">
        Or copy & paste below url into your broser.
    </h4>
    <div style="overflow-wrap: break-word; inline-size: 80%;">
        ${process.env.CLIENT_URL}/auth/password/reset/${token}
    </div>
    </p>
    <hr />
    <p style="display: flex; flex-direction: column; text-align: center;">
        <span>( This email contains sensitive data. )</span>
        <span>Please Handle with care</span>
        <span>-------- And Have a good Day ;) --------</span>
    </p>
    <span>NexusLink HQ</span><span>${process.env.CLIENT_URL}</span>
    </div>`,
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