const express = require("express");
const router = express.Router();
const controleAlteracao = require("../controllers/controleAlteracao");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");

router.get("/", asyncHandler(controleAlteracao.listarTodosRegistros));

module.exports = router;
