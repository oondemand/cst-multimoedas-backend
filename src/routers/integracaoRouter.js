const express = require("express");
const IntegracaoController = require("../controllers/integracao");
const { asyncHandler } = require("../utils/helpers");

const router = express.Router();
router.get("/", asyncHandler(IntegracaoController.listar));
router.get("/todos", asyncHandler(IntegracaoController.listaComPaginacao));
// router.post("/processar", asyncHandler(IntegracaoController.processar));
router.post("/reprocessar/:id", asyncHandler(IntegracaoController.reprocessar));
router.post("/arquivar/:id", asyncHandler(IntegracaoController.arquivar));

module.exports = router;
