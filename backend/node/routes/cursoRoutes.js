const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController.js');

router.post('/criar',cursoController.criar);
router.patch('/update/:curso',cursoController.update);
router.delete('/delete/:curso',cursoController.delete);
router.delete('/all',cursoController.all);

module.exports = router;