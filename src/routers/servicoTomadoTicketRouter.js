const express = require("express");
const router = express.Router();
const ServicoTomadoTicketController = require("../controllers/servicoTomadoTicket");
const multer = require("multer");
const {
  middlewares: { registrarAcaoMiddleware },
} = require("../../central-oon-core-backend");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { asyncHandler } = require("../utils/helpers");
const storage = multer.memoryStorage({});

const fileFilter = (req, file, cb) => {
  return cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limite de 1MB por arquivo
});

router.post(
  "/:id/upload",
  upload.array("arquivos", 10),
  asyncHandler(ServicoTomadoTicketController.anexarArquivos)
);

router.delete(
  "/arquivo/:ticketId/:id",
  asyncHandler(ServicoTomadoTicketController.removerArquivo)
);

// router.get("/:id/arquivos", ServicoTomadoTicketController.listFilesFromTicket);
// router.get("/arquivo/:id", ServicoTomadoTicketController.getArquivoPorId);

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.createTicket)
);

router.get("/", asyncHandler(ServicoTomadoTicketController.getAllTickets));
router.get(
  "/arquivados",
  asyncHandler(ServicoTomadoTicketController.getArchivedTickets)
);

// router.get("/pagos", ServicoTomadoTicketController.getTicketsPago);
// router.get(
//   "/usuario-prestador/:usuarioId",
//   ServicoTomadoTicketController.getTicketsByUsuarioPrestador
// );
// router.get("/:id", ServicoTomadoTicketController.getTicketById);

router.post(
  "/arquivar/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ARQUIVADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.excluir)
);

router.patch(
  "/:id",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.updateTicket)
);

router.post(
  "/:id/aprovar",
  registrarAcaoMiddleware({
    acao: ACOES.APROVADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.aprovar)
);

router.post(
  "/:id/reprovar",
  registrarAcaoMiddleware({
    acao: ACOES.REPROVADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.reprovar)
);

// router.delete(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.DELETADO,
//     entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
//   }),
//   ServicoTomadoTicketController.deleteTicket
// );

router.post(
  "/adicionar-servico/:ticketId/:servicoId/",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.adicionarServico)
);

router.post(
  "/remover-servico/:servicoId",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.removerServico)
);

router.post(
  "/adicionar-documento-fiscal/:ticketId/:documentoFiscalId/",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.addDocumentoFiscal)
);

router.post(
  "/remover-documento-fiscal/:documentoFiscalId",
  registrarAcaoMiddleware({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.SERVICO_TOMADO_TICKET,
  }),
  asyncHandler(ServicoTomadoTicketController.removeDocumentoFiscal)
);

router.get("/:id", asyncHandler(ServicoTomadoTicketController.obterTicket));

module.exports = router;
