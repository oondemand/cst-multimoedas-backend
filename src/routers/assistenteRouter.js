const express = require("express");
const router = express.Router();
const AssistenteController = require("../controllers/assistente");
const { registrarAcaoMiddleware } = require("central-oon-core-backend");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.CONFIGURACAO_ASSISTENTE,
  }),
  asyncHandler(AssistenteController.criarAssistente)
);
router.get("/", asyncHandler(AssistenteController.listarAssistentes));
router.get(
  "/ativos",
  asyncHandler(AssistenteController.listarAssistentesAtivos)
);
router.get("/:id", asyncHandler(AssistenteController.obterAssistente));

router.put(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.CONFIGURACAO_ASSISTENTE,
  }),
  asyncHandler(AssistenteController.atualizarAssistente)
);

router.delete(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.CONFIGURACAO_ASSISTENTE,
  }),
  asyncHandler(AssistenteController.excluirAssistente)
);

module.exports = router;
