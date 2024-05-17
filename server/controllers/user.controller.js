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
    const { name, bio, profilePic, password } = req.body;
    User.findById(req.auth._id).then((user) => {
        if (!user) {
            console.log('User not found');
            throw new Error('User not found');
        }
        if (!name) {
            console.log('Name is required with min of 3 characters.');
            throw new Error('Name is required');
        }
        user.name = name;
        user.bio = bio;
        user.profilePic = profilePic;
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

exports.getAllTodos = async (req, res) => {
    const { userId } = req.body;
    await User.findOne({ _id: userId }).then(async (user) => {
        if (!user) {
            return res.status(400).json({
                error: 'This user does not exists'
            });
        }
        const todos = user.todos || [];
        return res.status(200).json(todos);
    }).catch((err) => {
        console.log('FINDING USER IN DATABASE ERROR', err);
        return res.status(400).json({
            error: 'Error FINDING user. Please try again'
        });
    })
}

exports.updateAllTodos = async (req, res) => {
    const { userId, todos } = req.body;
    await User.findOne({ _id: userId }).then(async (user) => {
        if (!user) {
            return res.status(400).json({
                error: 'This user does not exists'
            });
        }
        await User.findByIdAndUpdate(
            { _id: user._id },
            { todos }
        ).then(result => {
            res.status(200).json({
                message: 'TodoList updated successfully'
            })
        }).catch(err => {
            console.log('UPDATING TODOS TO DB ERROR', err)
            return res.status(500).json({
                error: 'UPDATING TODOS TO DB ERROR'
            });
        })
    }).catch((err) => {
        console.log('FINDING USER IN DATABASE ERROR', err);
        return res.status(400).json({
            error: 'Error FINDING user. Please try again'
        });
    })
}