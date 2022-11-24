const express = require('express');
const router = express.Router();
const atendimentoController = require('../controllers/atendimentoController.js');
//

router.get('/buscarMensagens',atendimentoController.buscarMensagens);
router.get('/buscarChats',atendimentoController.buscarChats);
router.post('/enviarMensagem',atendimentoController.enviarMensagem);

module.exports = router;