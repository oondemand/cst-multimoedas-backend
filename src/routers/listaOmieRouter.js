const express = require("express");
const router = express.Router();
const ListaOmieController = require("../controllers/listaOmie");

const {
  middlewares: { registrarAcaoMiddleware },
} = require("../../central-oon-core-backend");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { asyncHandler } = require("../../central-oon-core-backend/utils/helpers");

router.post("/", asyncHandler(ListaOmieController.create));
router.get("/", asyncHandler(ListaOmieController.listAll));
router.get("/:codigo", asyncHandler(ListaOmieController.getListaPorCodigo));
router.delete("/:id", asyncHandler(ListaOmieController.deleteLista));
router.put("/:id", asyncHandler(ListaOmieController.update));

router.put(
  "/sync-omie/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.CONFIGURACAO_LISTA_OMIE,
  }),
  asyncHandler(ListaOmieController.syncOmie)
);

module.exports = router;
