const express = require("express");
const IntegracaoController = require("../controllers/integracao");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");
const {
  middlewares: { registrarAcaoMiddleware },
} = require("../../central-oon-core-backend");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");

const router = express.Router();
router.get("/", asyncHandler(IntegracaoController.listar));
router.get("/todos", asyncHandler(IntegracaoController.listaComPaginacao));
// router.post("/processar", asyncHandler(IntegracaoController.processar));
router.post("/reprocessar/:id", asyncHandler(IntegracaoController.reprocessar));

router.post(
  "/arquivar/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ARQUIVADO,
    entidade: ENTIDADES.INTEGRACAO,
  }),
  asyncHandler(IntegracaoController.arquivar)
);

// router.post(
//   "/processar/ativas",
//   asyncHandler(IntegracaoController.processarAtivas)
// );

router.get("/config", asyncHandler(IntegracaoController.listarConfigs));
router.put("/config/:id", asyncHandler(IntegracaoController.atualizarConfig));

module.exports = router;
