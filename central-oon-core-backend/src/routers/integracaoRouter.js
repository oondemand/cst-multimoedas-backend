const express = require("express");
const path = require("path");
const IntegracaoController = require("../controllers/integracao");
const { asyncHandler } = require("../utils/helpers");
const registrarAcaoMiddleware = require("../middlewares/registrarAcaoMiddleware");
const { ACOES, ENTIDADES } = require(path.join(process.cwd(), "src", "constants", "controleAlteracao"));

const router = express.Router();
router.get("/", asyncHandler(IntegracaoController.listar));
router.get("/todos", asyncHandler(IntegracaoController.listaComPaginacao));
router.post("/reprocessar/:id", asyncHandler(IntegracaoController.reprocessar));

router.post(
  "/arquivar/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ARQUIVADO,
    entidade: ENTIDADES.INTEGRACAO,
  }),
  asyncHandler(IntegracaoController.arquivar)
);

router.get("/config", asyncHandler(IntegracaoController.listarConfigs));
router.put("/config/:id", asyncHandler(IntegracaoController.atualizarConfig));

module.exports = router;
