const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.post('/login', userController.login);
router.post('/cadastro', userController.cadastro);
router.delete('/delete', userController.delete);
router.patch('/update', userController.update);

router.post('/all', userController.all);
router.get('/token', userController.token);
router.post('/redirect', userController.redirect);

module.exports = router;