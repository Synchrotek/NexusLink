const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, requireSigninAsAdmin } = require('../middlewares/auth.middlewares.js')
const { readUser, updateUser, updateAllTodos, getAllTodos } = require('../controllers/user.controller.js');
const { saveProject, getAllProjects, deleteProject } = require('../controllers/project.controller.js');

// import validators

router.get('/user/:id', requireSignin, readUser);
router.put('/user/update', requireSignin, updateUser);
router.put('/admin/update', requireSignin, requireSigninAsAdmin, updateUser);

router.post('/user/todos/update', requireSignin, updateAllTodos);
router.post('/user/todos', requireSignin, getAllTodos);

router.post('/project', requireSignin, saveProject);
router.get('/project/:userId', requireSignin, getAllProjects);
router.delete('/project/:projectId', requireSignin, deleteProject);

module.exports = router;