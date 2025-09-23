const express = require("express");
const ArquivoController = require("../controllers/arquivo");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");
const router = express.Router();

router.get("/:id", asyncHandler(ArquivoController.obterArquivoPorId));

module.exports = router;
