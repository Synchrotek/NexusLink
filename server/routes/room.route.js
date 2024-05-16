const express = require('express');
const router = express.Router();

// import controller
const {
    createNewRoom, getAllRooms, deleteARoom,
    updateFilesInRoom, getAllFilesInRoom
} = require('../controllers/room.controller.js');
const { requireSignin } = require('../middlewares/auth.middlewares.js');

// import validators

router.get('/', requireSignin, getAllRooms);
router.post('/new', requireSignin, createNewRoom);
router.post('/delete', requireSignin, deleteARoom);

router.post('/files/update', requireSignin, updateFilesInRoom);
router.post('/files', requireSignin, getAllFilesInRoom);

module.exports = router;