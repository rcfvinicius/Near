const express = require('express');
const router = express.Router();
const exercicioController = require('../controllers/exercicioController.js');


router.post('/criar',exercicioController.criar);
router.post('/criarImg',exercicioController.upload.single('foto'),(req,res)=>{res.send('{"status":"ok"}')});
router.post('/responder',exercicioController.responder);
router.get('/img',exercicioController.img);
router.get('/buscarExercicios', exercicioController.buscarExercicios);
router.get('/buscarRespostas',exercicioController.buscarRespostas);

module.exports = router;