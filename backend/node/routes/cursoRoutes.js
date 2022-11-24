const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController.js');
//


router.post('/criar',cursoController.criar);
router.post('/criarImg',cursoController.upload.single('foto'),(req,res)=>{res.send('{"status":"ok"}')});

router.patch('/update/:curso',cursoController.update);
router.delete('/delete/:id',cursoController.delete);
router.get('/cursosAdquiridosCount',cursoController.cursosAdquiridosCount);
router.post('/cursosAdquiridosDados',cursoController.cursosAdquiridosDados);
router.get('/cursosAdquiridosImg',cursoController.cursosAdquiridosImg);
router.get('/cursosCriadosCount',cursoController.cursosCriadosCount);
router.post('/cursosCriadosDados',cursoController.cursosCriadosDados);

router.get('/buscarVideoAulas',cursoController.buscarVideoAulas);
router.post('/criarVideoAula',cursoController.criarVideoAula);

router.patch('/ordenar',cursoController.ordenar);
router.get('/verificarCriador',cursoController.verificarCriador);
router.get('/verificarAquisicao', cursoController.verificarAquisicao);

router.get('/buscarComentarios',cursoController.buscarComentarios);
router.post('/comentar',cursoController.comentar);

router.patch('/updateVideoAula', cursoController.updateVideoAula);

router.get('/cursoInfo', cursoController.cursoInfo);
router.get('/cursosPopulares', cursoController.cursosPopulares);
router.get('/categorias', cursoController.categorias);


router.post('/adquirir', cursoController.adquirir);
router.get('/pesquisar', cursoController.pesquisarTudo);

//carrinho
router.post('/carrinho/salvar', cursoController.carrinhoSalvar);
router.delete('/carrinho/deleteItem', cursoController.carrinhoDeleteItem);
router.get('/carrinho/ler', cursoController.carrinhoLer);
router.delete('/carrinho/delete', cursoController.carrinhoDelete);
router.post('/carrinho/finalizarCompra', cursoController.finalizarCompra);

module.exports = router;