const mongoose = require('mongoose');
const crypto = require('crypto');

// Room schema ----------------------------------------
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        // required: true,
        max: 20
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomPicture: {
        type: String,
        trim: true,
        // required: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);