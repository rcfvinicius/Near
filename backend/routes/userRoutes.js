const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/login', userController.login);
router.post('/cadastro', userController.cadastro);
router.delete('/:userEmail', userController.delete);
router.patch('/:userEmail', userController.update);
router.get('/all', userController.all);
router.get('/token', userController.token);
router.post('/redirect', userController.redirect);

module.exports = router;