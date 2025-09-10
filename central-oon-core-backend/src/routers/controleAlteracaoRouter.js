const express = require('express');
const path = require('path');
const router = express.Router();
const controleAlteracao = require('../controllers/controleAlteracao');
const { asyncHandler } = require("../utils/helpers");

router.get('/', asyncHandler(controleAlteracao.listarTodosRegistros));

module.exports = router;
