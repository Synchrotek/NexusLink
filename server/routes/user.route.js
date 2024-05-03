const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, requireSigninAsAdmin } = require('../controllers/auth.controller.js');
const { readUser, updateUser, updateAllTodos, getAllTodos } = require('../controllers/user.controller.js');

// import validators

router.get('/user/:id', requireSignin, readUser);
router.put('/user/update', requireSignin, updateUser);
router.put('/admin/update', requireSignin, requireSigninAsAdmin, updateUser);

router.post('/user/todos/update', requireSignin, updateAllTodos);
router.post('/user/todos', requireSignin, getAllTodos);

module.exports = router;