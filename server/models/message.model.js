const mongoose = require('mongoose');
const crypto = require('crypto');

// Message schema ----------------------------------------
const messageSchema = new mongoose.Schema({
    room: {
        type: mongoose.Types.ObjectId,
        ref: 'Room',
        unique: true,
        required: true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
    },
    attachments: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);