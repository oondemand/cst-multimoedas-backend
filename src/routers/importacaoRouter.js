const express = require("express");
const ImportacaoController = require("../controllers/importacao");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");

const router = express.Router();
router.get("/", asyncHandler(ImportacaoController.listar));

module.exports = router;
