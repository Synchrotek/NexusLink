const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const lodashLib = require('lodash');
const sendMail = require('../utils/sendmail.js');

// controller for SIGNUP handle -------------------------------------------------------------
exports.signup = (req, res) => {
    const { name, email, password, profilePic, bio } = req.body;

    User.findOne({ email }).then(async (user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const token = jwt.sign(
            {
                name, email, password,
                profilePic: profilePic ? profilePic : `${process.env.PROFILE_PIC_API}?username=${name}`,
                bio: bio ? bio : 'Success is not final, failure is not fatal: it is the courage to continue that counts.'
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: '10m' }
        );

        const { success, message } = await sendMail({
            email, token,
            emailType: 'account-activation',
            messageToShow: `Email has been sent to ${email}. Follow the instruction to activate your account`
        });
        return res.status(success ? 200 : 500).json(message)
    });
};

// controller for ACCOUNT-ACTIVATINO -------------------------------------------------------
exports.accountActivation = (req, res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
            const { name, email, password, profilePic, bio } = jwt.decode(token);
            User.findOne({ email }).then(async (existingUser) => {
                if (existingUser) {
                    return res.status(400).json({
                        error: 'Account is already activated! Pleae SingIn.'
                    });
                }
                if (err) {
                    return res.status(401).json({
                        error: 'Expired link. Please Singup again'
                    })
                }
                const user = new User({ name, email, password, profilePic, bio });
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

// controller for SINGIN handle -------------------------------------------------------------
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
        const { _id, name, email, role, profilePic, bio } = user;

        return res.json({
            token,
            user: { _id, name, email, role, profilePic, bio }
        })
    })
}

// controller for FORGOT-PASSWORD -----------------------------------------------------------
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
                .then(async (result) => {
                    const { success, message } = await sendMail({
                        email, token,
                        emailType: 'reset-password',
                        messageToShow: `Email has been sent to ${email}. Follow the instruction to Reset your password`
                    });
                    return res.status(success ? 200 : 500).json(message)
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

// controller for RESET-PASSWORD ------------------------------------------------------------
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