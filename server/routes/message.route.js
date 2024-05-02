const express = require('express');
const router = express.Router();

// import controller
const { uploadFileToCloudinary } = require('../controllers/message.controller.js');
const { multerUpload } = require('../middlewares/multer.js');
const { requireSignin } = require('../controllers/auth.controller.js');

// import validators

router.post('/upload-file', requireSignin, multerUpload.fields([
    { name: "attachment", maxCount: "1" },
]), uploadFileToCloudinary);

module.exports = router;