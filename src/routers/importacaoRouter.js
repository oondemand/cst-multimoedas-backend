const express = require("express");
const ImportacaoController = require("../controllers/importacao");
const { asyncHandler } = require("../../packages/central-oon-core-backend/src/utils/helpers");

const router = express.Router();
router.get("/", asyncHandler(ImportacaoController.listar));

module.exports = router;
