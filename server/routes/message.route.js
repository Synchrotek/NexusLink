const express = require('express');
const router = express.Router();

// import controller -----------------------------------------------
const { uploadFileToCloudinary, getAllMessages, pushMessagesIntoDB } = require('../controllers/message.controller.js');
const { multerUpload } = require('../middlewares/multer.js');
const { requireSignin } = require('../middlewares/auth.middlewares.js');

// import validators -----------------------------------------------

router.post('/upload-file', multerUpload.fields([
    { name: "attachment", maxCount: "1" },
]), uploadFileToCloudinary);

router.post('/push-messages', requireSignin, pushMessagesIntoDB)
router.post('/', requireSignin, getAllMessages)

module.exports = router;