const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './constants/files')
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniquePrefix + '-' + file.originalname)
    }
})

exports.multerUpload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5,
    // }
});
