const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController.js');

router.post('/criar',cursoController.criar);
router.patch('/update/:curso',cursoController.update);
//router.delete('/delete/:curso',cursoController.delete);
router.get('/cursosAdquiridosCount',cursoController.cursosAdquiridosCount);
router.post('/cursosAdquiridosImg',cursoController.cursosAdquiridosImg);
router.post('/cursosAdquiridosDados',cursoController.cursosAdquiridosDados);

router.get('/cursosCriadosCount',cursoController.cursosCriadosCount);
router.post('/cursosCriadosDados',cursoController.cursosCriadosDados);

module.exports = router;