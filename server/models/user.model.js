const mongoose = require('mongoose');
const crypto = require('crypto');

// user schema ----------------------------------------
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true
    },
    profilePic: {
        type: String,
        trim: true,
        required: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    social_login: {
        type: String,
        enum: ['', 'google', 'github'],
        default: ''
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: 'subscriber'
    },
    todos: [
        {
            checked: {
                type: Boolean,
            },
            deadline: {
                type: String,
            },
            priority: {
                type: String,
                default: "1",
            },
            value: {
                type: String,
                default: "",
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
        }
    ],
    resetPasswordToken: {
        data: {
            type: String,
            default: ''
        },
    },
}, { timestamps: true });

// virtual ---------------------------------------------
userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    }).get(function () {
        return this._password;
    });

// methods ----------------------------------------------
userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            console.log(err);
            return '';
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
}

module.exports = mongoose.model('User', userSchema);