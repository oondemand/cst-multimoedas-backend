const express = require('express');
const MoedaController = require('../controllers/moeda');
const { asyncHandler } = require('../utils/helpers');

const router = express.Router();

router.get('/', asyncHandler(MoedaController.listarComPaginacao));
router.get('/ativas', asyncHandler(MoedaController.listarAtivas));
router.post('/atualizar-cotacao', asyncHandler(MoedaController.atualizarCotacao));

module.exports = router;
