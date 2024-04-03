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
            console.log('User not found');
            throw new Error('User not found');
        }
        if (!name) {
            console.log('Name is required');
            throw new Error('Name is required');
        }
        user.name = name;
        // if user exists authenticate
        if (!user.authenticate(password)) {
            throw new Error('Incorrect Password. Try Again');
        }
        return user;
    }).then((user) => {
        user.save().then(updatedUser => {
            // updatedUser.hashed_password = undefined;
            // updatedUser.salt = undefined;
            res.json(updatedUser);
        }).catch((err) => {
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