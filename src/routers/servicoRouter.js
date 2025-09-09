const express = require("express");
const ServicoController = require("../controllers/servico");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const router = express.Router();
const { asyncHandler } = require("../utils/helpers");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { uploadExcel } = require("../../packages/core");

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
