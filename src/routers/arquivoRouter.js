const express = require("express");
const ArquivoController = require("../controllers/arquivo");
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const router = express.Router();

router.get("/:id", asyncHandler(ArquivoController.obterArquivoPorId));

module.exports = router;
