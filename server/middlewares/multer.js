const multer = require('multer');

exports.multerUpload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5,
    }
});
