const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
// /user/
router.post('/criarImg',userController.upload.single('foto'),(req,res)=>{res.send('{"status":"ok"}')});
router.post('/login', userController.login);
router.post('/cadastro', userController.cadastro);
router.delete('/delete', userController.delete);
router.patch('/update', userController.update);
router.get('/token', userController.token);
router.get('/img', userController.img);


router.post('/all', userController.all);
//router.get('/tokenValido', userController.tokenValido);

module.exports = router;