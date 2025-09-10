const express = require("express");
const PessoaController = require("../controllers/pessoa");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const router = express.Router();
const { asyncHandler } = require("../utils/helpers");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { uploadExcel } = require("../config/multer");

router.get("/", asyncHandler(PessoaController.listar));

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.PESSOA,
  }),
  asyncHandler(PessoaController.criar)
);

router.get("/exportar", asyncHandler(PessoaController.exportar));
router.get("/:id", asyncHandler(PessoaController.obterPorId));

router.patch(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.PESSOA,
  }),
  asyncHandler(PessoaController.atualizar)
);

router.delete(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.PESSOA,
  }),
  asyncHandler(PessoaController.excluir)
);

router.post(
  "/importar",
  uploadExcel.array("file"),
  asyncHandler(PessoaController.importarPessoa)
);

module.exports = router;
