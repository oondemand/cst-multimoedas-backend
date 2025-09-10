const express = require('express');
const router = express.Router();
const SistemaController = require('../controllers/sistema');
const { asyncHandler } = require('../utils/helpers');

router.get('/', asyncHandler(SistemaController.listarSistemaConfig));
router.put('/:id', asyncHandler(SistemaController.atualizarSistemaConfig));
router.post('/teste-email', asyncHandler(SistemaController.testeEmail));

module.exports = router;
