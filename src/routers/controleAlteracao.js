const express = require("express");
const router = express.Router();
const controleAlteracao = require("../controllers/controleAlteracao");
const { asyncHandler } = require("../../packages/central-oon-core-backend/src/utils/helpers");

router.get("/", asyncHandler(controleAlteracao.listarTodosRegistros));

module.exports = router;
