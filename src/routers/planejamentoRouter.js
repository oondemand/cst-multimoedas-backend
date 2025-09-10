const express = require("express");
const PlanejamentoController = require("../controllers/planejamento");
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const router = express.Router();

router.get("/listar-servicos", asyncHandler(PlanejamentoController.listar));
router.get("/estatisticas", asyncHandler(PlanejamentoController.estatisticas));
router.post(
  "/processar-servicos",
  asyncHandler(PlanejamentoController.processarMultiplosServicos)
);

router.post(
  "/processar-servico/:id",
  asyncHandler(PlanejamentoController.processarServico)
);

router.post(
  "/sincronizar-esteira",
  asyncHandler(PlanejamentoController.sincronizarEsteira)
);

module.exports = router;
