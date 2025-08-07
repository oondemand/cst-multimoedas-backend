const express = require("express");
const MoedaController = require("../controllers/moeda");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const router = express.Router();
const { asyncHandler } = require("../utils/helpers");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { uploadExcel } = require("../config/multer");

router.get("/", asyncHandler(MoedaController.listarComPaginacao));
router.get("/ativas", asyncHandler(MoedaController.listarAtivas));
router.post("/atualizar-cotacao", asyncHandler(MoedaController.atualizarCotacao));

// router.post(
//   "/",
//   registrarAcaoMiddleware({
//     acao: ACOES.ADICIONADO,
//     entidade: ENTIDADES.PESSOA,
//   }),
//   asyncHandler(MoedaController.criar)
// );

// router.get("/exportar", asyncHandler(MoedaController.exportar));
// router.get("/:id", asyncHandler(MoedaController.obterPorId));

// router.patch(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.PESSOA,
//   }),
//   asyncHandler(MoedaController.atualizar)
// );

// router.delete(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.EXCLUIDO,
//     entidade: ENTIDADES.PESSOA,
//   }),
//   asyncHandler(MoedaController.excluir)
// );

// router.post(
//   "/importar",
//   uploadExcel.array("file"),
//   asyncHandler(MoedaController.importarPessoa)
// );

module.exports = router;
