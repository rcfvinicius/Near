const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController.js');
//


router.post('/criar',cursoController.criar);
router.post('/criarImg',cursoController.upload.single('foto'),(req,res)=>{res.send('{"status":"ok"}')})

router.patch('/update/:curso',cursoController.update);
//router.delete('/delete/:curso',cursoController.delete);

router.get('/cursosAdquiridosCount',cursoController.cursosAdquiridosCount);
router.post('/cursosAdquiridosDados',cursoController.cursosAdquiridosDados);

router.post('/cursosAdquiridosImg',cursoController.cursosAdquiridosImg);

router.get('/cursosCriadosCount',cursoController.cursosCriadosCount);
router.post('/cursosCriadosDados',cursoController.cursosCriadosDados);
router.get('/buscarVideoAulas',cursoController.buscarVideoAulas);
router.post('/criarVideoAula',cursoController.criarVideoAula);
router.patch('/ordenar',cursoController.ordenar);
router.get('/verificarCriador',cursoController.verificarCriador)

module.exports = router;