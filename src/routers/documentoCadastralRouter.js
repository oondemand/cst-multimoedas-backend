const express = require("express");
const DocumentoCadastralController = require("../controllers/documentoCadastral");

const router = express.Router();

const { uploadExcel, uploadPDFAndImage } = require("../config/multer");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { asyncHandler } = require("../utils/helpers");

router.get("/", asyncHandler(DocumentoCadastralController.listar));
router.get("/exportar", asyncHandler(DocumentoCadastralController.exportar));

router.post(
  "/importar",
  uploadExcel.array("file"),
  asyncHandler(DocumentoCadastralController.importar)
);

router.get(
  "/pessoa/:pessoaId",
  asyncHandler(DocumentoCadastralController.listarPorPessoa)
);

// router.get(
//   "/prestador",
//   DocumentoCadastralController.listarDocumentoCadastralPorUsuarioPrestador
// );

router.delete(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.EXCLUIDO,
    entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
  }),
  asyncHandler(DocumentoCadastralController.excluir)
);

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
  }),
  asyncHandler(DocumentoCadastralController.criar)
);

// router.post(
//   "/usuario-prestador",
//   upload.single("file"),
//   DocumentoCadastralController.criarDocumentoCadastralPorUsuarioPrestador
// );

router.post(
  "/anexar-arquivo/:documentoCadastralId",
  uploadPDFAndImage.single("file"),
  asyncHandler(DocumentoCadastralController.anexarArquivo)
);

router.delete(
  "/excluir-arquivo/:documentoCadastralId/:id",
  asyncHandler(DocumentoCadastralController.removerArquivo)
);

router.patch(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
  }),
  asyncHandler(DocumentoCadastralController.atualizar)
);

router.post(
  "/aprovar-documento/:id",
  registrarAcaoMiddleware({
    acao: ACOES.APROVADO,
    entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
  }),
  asyncHandler(DocumentoCadastralController.aprovarDocumento)
);

router.post(
  "/reprovar-documento/:id",
  registrarAcaoMiddleware({
    acao: ACOES.REPROVADO,
    entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
  }),
  asyncHandler(DocumentoCadastralController.reprovarDocumento)
);

module.exports = router;
