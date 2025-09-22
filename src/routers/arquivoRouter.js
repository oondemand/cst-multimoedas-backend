const express = require("express");
const ArquivoController = require("../controllers/arquivo");
const { asyncHandler } = require("../../packages/central-oon-core-backend/src/utils/helpers");
const router = express.Router();

router.get("/:id", asyncHandler(ArquivoController.obterArquivoPorId));

module.exports = router;
