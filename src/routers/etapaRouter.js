const express = require("express");
const router = express.Router();
const EtapaController = require("../controllers/etapa");
const {
  middlewares: { registrarAcaoMiddleware },
} = require("../../central-oon-core-backend");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { asyncHandler } = require("../utils/helpers");

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.CONFIGURACAO_ETAPA,
  }),
  asyncHandler(EtapaController.criarEtapa)
);
router.get(
  "/ativas/:esteira",
  asyncHandler(EtapaController.listarEtapasAtivasPorEsteira)
);
router.get("/", asyncHandler(EtapaController.listarEtapas));
// router.get("/:id", EtapaController.obterEtapa);

router.put(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.CONFIGURACAO_ETAPA,
  }),
  asyncHandler(EtapaController.atualizarEtapa)
);

router.delete(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.CONFIGURACAO_ETAPA,
  }),
  asyncHandler(EtapaController.excluir)
);

module.exports = router;
