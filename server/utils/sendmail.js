const nodemailer = require('nodemailer');

// using mailtrap sandbox service --------------
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
    },
});

const sendMail = async (emailDataToSend, messageToShow) => {
    let responseToSend;
    await transporter.sendMail(emailDataToSend)
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