const mongoose = require('mongoose');

// Room schema ----------------------------------------
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        // unique: true,
    },
    roomId: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    creator: {
        creatorId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: false,
        },
        creatorEmail: {
            type: String,
            required: true,
        },
        cratorName: {
            type: String,
            required: true,
        }
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