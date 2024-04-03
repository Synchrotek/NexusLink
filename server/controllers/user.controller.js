const User = require('../models/user.model.js');

exports.readUser = (req, res) => {
    const userId = req.params.id;
    User.findById(userId).then((user) => {
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }).then((user) => {
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    }).catch(err => {
        return res.status(400).json({
            error: err.message
        })
    })
}

exports.updateUser = (req, res) => {
    const { name, password } = req.body;
    User.findById(req.auth._id).then((user) => {
        if (!user) {
            throw new Error('User not found');
        }
        if (!name) {
            throw new Error('Name is required');
        }
        user.name = name;
        if (password.length < 6) {
            throw new Error('Password should be 6 characters long');
        }
        user.password = password;
        return user;
    }).then((user) => {
        user.save().then(updatedUser => {
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        }).then().catch((err) => {
            console.log('USER UPDATE ERROR', err);
            return res.status(400).json({
                error: 'User update failed'
            })
        })
    }).catch(err => {
        return res.status(400).json({
            error: err.message
        })
    });
}