const express = require("express");
const { asyncHandler } = require("../utils/helpers");

module.exports = ({
  controller,
  registrarAcaoMiddleware,
  ACOES,
  ENTIDADES,
}) => {
  const router = express.Router();
  router.get("/", asyncHandler(controller.listar));
  router.get("/todos", asyncHandler(controller.listaComPaginacao));
  router.post("/reprocessar/:id", asyncHandler(controller.reprocessar));

  router.post(
    "/arquivar/:id",
    registrarAcaoMiddleware({
      acao: ACOES.ARQUIVADO,
      entidade: ENTIDADES.INTEGRACAO,
    }),
    asyncHandler(controller.arquivar)
  );

  router.get("/config", asyncHandler(controller.listarConfigs));
  router.put("/config/:id", asyncHandler(controller.atualizarConfig));

  return router;
};
