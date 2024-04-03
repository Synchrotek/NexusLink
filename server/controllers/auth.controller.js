const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const { expressjwt: ejwt } = require('express-jwt');
const lodashLib = require('lodash');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASSWORD,
    },
});

// exports.signup = (req, res) => {
// console.log('REQ BODY ON SIGNUP:', req.body);
// const { name, email, password } = req.body;

// User.findOne({ email }).then(user => {
//     if (user) {
//         return res.status(400).json({
//             error: 'Email is taken'
//         });
//     }

//     let newUser = new User({ name, email, password });
//     newUser.save().then(success => {
//         return res.json({
//             message: 'Singup succes! Please SignIn'
//         });
//     }).catch(err => {
//         console.log('SINGUP ERROR', err);
//         return res.status(400).json({
//             error: err
//         });
//     });
// });
// };

exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }).then(async (user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const token = jwt.sign(
            { name, email, password },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: '10m' }
        );

        const emailDataToSend = {
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
        await transporter.sendMail(emailDataToSend)
            .then(emailSent => {
                console.log("SIGNUP EMAIL SENT", emailSent);
                return res.json({
                    message: `Email has been sent to ${email}. Follow the instruction to activate your account`
                });
            }).catch(err => {
                // console.log('SIGNUP EMAIL SENT ERROR', err)
                return res.json({
                    message: err.message
                })
            })
    });
};

exports.accountActivation = (req, res) => {
    const { token } = req.body;

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
            const { name, email, password } = jwt.decode(token);
            User.findOne({ email }).then(async (existingUser) => {
                if (existingUser) {
                    return res.status(400).json({
                        error: 'Account is already activated! Pleae SingIn.'
                    });
                }
                if (err) {
                    // console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
                    return res.status(401).json({
                        error: 'Expired link. Please Singup again'
                    })
                }
                const user = new User({ name, email, password });
                user.save().then(result => {
                    return res.json({
                        message: 'Signup Activation success. Please Singin'
                    });
                }).catch(err => {
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                    return res.status(400).json({
                        error: 'Error saving user in our databse. Try Singup again'
                    });
                })
            });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again.'
        });
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
        // check if user exists
        if (!user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            })
        }
        // if user exists authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and Password do not match'
            })
        }
        // generate a token and send to client
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },

        );
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role }
        })
    })
}

exports.requireSignin = ejwt({
    // user data will be available in req.auth
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
})

exports.requireSigninAsAdmin = (req, res, next) => {
    User.findById(req.auth._id)
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            if (user.role !== 'admin') {
                throw new Error('Admin resource. Access denied');
            }
            res.profile = user;
            next();
        }).catch(err => {
            return res.status(401).json({
                error: err.message
            })
        })
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                throw new Error("User with that email doesn't exists");
            }
            return user;

        }).then((user) => {
            const token = jwt.sign(
                { _id: user._id, name: user.name },
                process.env.JWT_RESET_PASSWORD,
                { expiresIn: '10m' }
            );

            const emailDataToSend = {
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

            return user.updateOne({ resetPasswordToken: token })
                .then(async (success) => {
                    await transporter.sendMail(emailDataToSend)
                        .then(emailSent => {
                            console.log("RESET PASSWORD EMAIL SENT", emailSent);
                            return res.json({
                                message: `Email has been sent to ${email}. Follow the instruction to Reset your password`
                            });
                        }).catch(err => {
                            // console.log('RESET PASSWORD EMAIL SENT ERROR', err)
                            return res.json({
                                message: err.message
                            })
                        })
                }).catch(err => {
                    console.log('RESET PASSWORD LINK ERROR', err);
                    return res.status(401).json({
                        error: 'Ddatabase connection error on user password forgot request'
                    })
                })
        }).catch(err => {
            return res.status(401).json({
                error: err.message
            })
        })
}

exports.resetPassword = (req, res) => {
    const { resetPasswordToken, newPassword } = req.body;
    if (resetPasswordToken) {
        jwt.verify(resetPasswordToken, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: 'Expired link. Please try again'
                })
            }
            User.findOne({ resetPasswordToken }).then((user) => {
                if (!user) {
                    throw new Error("The requested User doesn't exists");
                }
                return user;
            }).then((user) => {
                const updatedFields = {
                    password: newPassword,
                    resetPasswordToken: ''
                }
                user = lodashLib.extend(user, updatedFields);
                user.save().then(result => {
                    return res.json({
                        message: `Graet! Now you can login with your New Password`
                    });
                }).catch(err => {
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                    return res.status(400).json({
                        error: 'Error resetting User Passsword in database'
                    });
                })
            }).catch(err => {
                return res.status(401).json({
                    error: 'Something went wrong, Please Try later'
                })
            })
        });
    }
}