const mongoose = require('mongoose');
const crypto = require('crypto');

// Room schema ----------------------------------------
const roomSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     trim: true,
    //     // required: true,
    //     // unique: true,
    //     max: 20
    // },
    roomId: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        max: 20
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false,
    },
    description: {
        type: String,
        trim: true,
    },
    files: [
        {
            fileId: {
                type: Number,
                required: true,
            },
            filename: {
                type: String,
                required: true,
            },
            fileContent: {
                type: String,
                required: true,
            },
            language: {
                type: String,
                required: true,
            },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);

// { fileId: 1, filename: 'Main1.py', fileContent: '1' },