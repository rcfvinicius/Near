const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
// /user/
router.post('/login', userController.login);
router.post('/cadastro', userController.cadastro);
router.delete('/delete', userController.delete);
router.patch('/update', userController.update);
router.get('/token', userController.token);

router.post('/all', userController.all);
router.post('/redirect', userController.redirect);
router.get('/tokenValido', userController.tokenValido);

module.exports = router;