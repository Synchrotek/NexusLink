const express = require('express');
const router = express.Router();

// import controller
const { createNewRoom, getAllRooms, deleteARoom } = require('../controllers/room.controller.js');
const { requireSignin } = require('../controllers/auth.controller.js');

// import validators

router.get('/', requireSignin, getAllRooms);
router.post('/new', requireSignin, createNewRoom);
router.post('/delete', requireSignin, deleteARoom);

module.exports = router;