const express = require("express");
const DocumentoFiscalController = require("../controllers/documentoFiscal");

const router = express.Router();

const { uploadExcel, uploadPDF } = require("central-oon-core-backend");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { asyncHandler } = require("../utils/helpers");

router.get("/", asyncHandler(DocumentoFiscalController.listar));
router.get("/exportar", asyncHandler(DocumentoFiscalController.exportar));

router.post(
  "/importar",
  uploadExcel.array("file"),
  asyncHandler(DocumentoFiscalController.importar)
);

router.get(
  "/pessoa/:pessoaId",
  asyncHandler(DocumentoFiscalController.listarPorPessoa)
);

// router.get(
//   "/prestador",
//   DocumentoFiscalController.listarDocumentoFiscalPorUsuarioPrestador
// );

router.delete(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.DOCUMENTO_FISCAL,
  }),
  asyncHandler(DocumentoFiscalController.excluir)
);

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.DOCUMENTO_FISCAL,
  }),
  asyncHandler(DocumentoFiscalController.criar)
);

// router.post(
//   "/usuario-prestador",
//   upload.single("file"),
//   DocumentoFiscalController.criarDocumentoFiscalPorUsuarioPrestador
// );

router.post(
  "/anexar-arquivo/:documentoFiscalId",
  uploadPDF.single("file"),
  asyncHandler(DocumentoFiscalController.anexarArquivo)
);

router.delete(
  "/excluir-arquivo/:documentoFiscalId/:id",
  asyncHandler(DocumentoFiscalController.removerArquivo)
);

router.patch(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.DOCUMENTO_FISCAL,
  }),
  asyncHandler(DocumentoFiscalController.atualizar)
);

router.post(
  "/aprovar-documento/:id",
  registrarAcaoMiddleware({
    acao: ACOES.APROVADO,
    entidade: ENTIDADES.DOCUMENTO_FISCAL,
  }),
  asyncHandler(DocumentoFiscalController.aprovarDocumento)
);

router.post(
  "/reprovar-documento/:id",
  registrarAcaoMiddleware({
    acao: ACOES.REPROVADO,
    entidade: ENTIDADES.DOCUMENTO_FISCAL,
  }),
  asyncHandler(DocumentoFiscalController.reprovarDocumento)
);

module.exports = router;
