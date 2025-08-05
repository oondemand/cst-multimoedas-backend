const express = require("express");
const SistemaService = require("../controllers/sistema");
const { asyncHandler } = require("../utils/helpers");
const router = express.Router();

router.get("/", asyncHandler(SistemaService.listarSistemaConfig));
router.put("/:id", asyncHandler(SistemaService.atualizarSistemaConfig));
router.post("/teste-email", asyncHandler(SistemaService.testeEmail));

module.exports = router;
