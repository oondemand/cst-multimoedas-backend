const express = require("express");
const SistemaService = require("../controllers/sistema");
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const router = express.Router();

router.get("/", asyncHandler(SistemaService.listarSistemaConfig));
router.put("/:id", asyncHandler(SistemaService.atualizarSistemaConfig));
router.post("/teste-email", asyncHandler(SistemaService.testeEmail));

module.exports = router;
