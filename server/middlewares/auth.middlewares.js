const User = require("../models/user.model");
const { expressjwt: ejwt } = require('express-jwt');

// Middleware for singin-check with singedin-role ------------------------------------------
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

// Middleware for singin-check --------------------------------------------------------------
exports.requireSignin = ejwt({
    // user data will be available in req.auth
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
})
