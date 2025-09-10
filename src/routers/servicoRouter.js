const express = require("express");
const ServicoController = require("../controllers/servico");
const { registrarAcaoMiddleware } = require("central-oon-core-backend");
const router = express.Router();
const {
  helpers: { asyncHandler },
} = require("central-oon-core-backend");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { uploadExcel } = require("central-oon-core-backend");

router.get("/", asyncHandler(ServicoController.listar));

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.SERVICO,
  }),
  asyncHandler(ServicoController.criar)
);

router.get("/exportar", asyncHandler(ServicoController.exportar));
// router.get("/:id", asyncHandler(ServicoController.obterPorId));

router.patch(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.SERVICO,
  }),
  asyncHandler(ServicoController.atualizar)
);

router.delete(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.SERVICO,
  }),
  asyncHandler(ServicoController.excluir)
);

router.post(
  "/importar",
  uploadExcel.array("file"),
  asyncHandler(ServicoController.importarServico)
);

router.get(
  "/pessoa/:pessoaId",
  asyncHandler(ServicoController.listarServicoPorPessoa)
);

module.exports = router;
