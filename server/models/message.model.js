const mongoose = require('mongoose');
const crypto = require('crypto');

// Message schema ----------------------------------------
const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    sender: {
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
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