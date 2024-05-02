const express = require('express');
const router = express.Router();

// import controller
const { requireSignin } = require('../controllers/auth.controller.js');

// import validators

router.get('/rooms', requireSignin, readUser);
router.post('/room/new', requireSignin, updateUser);

module.exports = router;