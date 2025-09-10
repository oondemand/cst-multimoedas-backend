const express = require('express');
const router = express.Router();
const importacaoController = require('../controllers/importacao');
const { asyncHandler } = require('../utils/helpers');

router.get('/', asyncHandler(importacaoController.listar));

module.exports = router;
