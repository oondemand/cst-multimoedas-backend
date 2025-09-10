const express = require("express");
const ImportacaoController = require("../controllers/importacao");
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");

const router = express.Router();
router.get("/", asyncHandler(ImportacaoController.listar));

module.exports = router;
