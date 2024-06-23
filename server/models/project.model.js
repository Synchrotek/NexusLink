const mongoose = require('mongoose');

// Room schema ----------------------------------------
const projectSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
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
    ],
});

module.exports = mongoose.model('Project', projectSchema);
